from datetime import datetime, timedelta
from airflow import DAG
from airflow.operators.python import PythonOperator
import random
import csv
import os
from python.api_client import FXApiClient

default_args = {
    'owner': 'data_engineering',
    'depends_on_past': False,
    'email_on_failure': False,
    'email_on_retry': False,
    'retries': 1,
    'retry_delay': timedelta(minutes=5),
}

def extract_currency_rates(**kwargs):
    print("Extracting current FX rates via FXApiClient...")
    client = FXApiClient()
    rates = client.get_latest_rates()
    # Map key names to match downstream usage:
    mapped_rates = {
        'eur_to_usd': rates.get('USD', 1.1000),
        'eur_to_twd': rates.get('TWD', 34.5000)
    }
    kwargs['ti'].xcom_push(key='fx_rates', value=mapped_rates)
    print(f"Extracted rates: {mapped_rates}")

def extract_shipping_logistics(**kwargs):
    print("Extracting shipping logistics from dataset/Electronic_sales_Sep2023-Sep2024.csv...")
    base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    csv_path = os.path.join(base_dir, "dataset", "Electronic_sales_Sep2023-Sep2024.csv")
    
    with open(csv_path, mode="r", encoding="utf-8") as f:
        reader = csv.DictReader(f)
        rows = list(reader)
        row = random.choice(rows)
        
    shipping_type = row.get("Shipping Type", "Standard")
    quantity = int(row.get("Quantity", "1"))
    
    # Determine realistic shipping days based on Shipping Type (aligned with model training logic)
    if shipping_type in ['Same Day', 'Overnight']:
        real_days = random.randint(1, 2)
        scheduled_days = 1
        base_freight = random.uniform(40.0, 50.0)
    elif shipping_type in ['Express', 'Expedited']:
        real_days = random.randint(2, 4)
        scheduled_days = 3
        base_freight = random.uniform(15.0, 20.0)
    else:  # Standard
        real_days = random.randint(5, 10)
        scheduled_days = 6
        base_freight = random.uniform(5.0, 10.0)
        
    delay_days = max(0, real_days - scheduled_days)
    
    freight_base = random.uniform(5000.0, 8000.0)
    extra_freight = base_freight * quantity
    total_freight_cost = round(freight_base + extra_freight, 2)
    
    logistics = {
        'component_delay_days': delay_days,
        'base_freight_cost_eur': total_freight_cost
    }
    kwargs['ti'].xcom_push(key='logistics', value=logistics)
    print(f"Extracted logistics (Shipping Type: {shipping_type}, Qty: {quantity}): {logistics}")

def transform_and_load(**kwargs):
    ti = kwargs['ti']
    rates = ti.xcom_pull(key='fx_rates', task_ids='extract_currency_rates')
    logistics = ti.xcom_pull(key='logistics', task_ids='extract_shipping_logistics')
    
    eur_usd = rates['eur_to_usd']
    eur_twd = rates['eur_to_twd']
    delay = logistics['component_delay_days']
    cost = logistics['base_freight_cost_eur']
    
    # Air freight rerouting logic
    if delay >= 12:
        print("Delay >= 12 days. Rerouting via Air Freight.")
        cost = cost * 3.5  # Air freight is significantly more expensive
        
    print("Connecting to PostgreSQL DWH...")
    # Simple logic for Margin Impact Risk (1 = Risk, 0 = No risk)
    # High cost and low EUR value against TWD increases risk.
    risk = 1 if (cost > 15000 or (eur_twd < 34.0 and delay > 5)) else 0
    
    import psycopg2
    db_host = os.getenv("DB_HOST", "localhost")
    db_port = os.getenv("DB_PORT", "5432")
    db_name = os.getenv("DB_NAME", "auroratech_dwh")
    db_user = os.getenv("DB_USER", "admin")
    db_pass = os.getenv("DB_PASSWORD", "adminpassword")
    
    conn = psycopg2.connect(
        host=db_host,
        port=db_port,
        dbname=db_name,
        user=db_user,
        password=db_pass
    )
    try:
        cur = conn.cursor()
        
        # Insert current date metadata dynamically
        today = datetime.now().date()
        date_id = int(today.strftime("%Y%m%d"))
        is_weekend = today.weekday() >= 5
        
        cur.execute("""
            INSERT INTO dwh.dim_date (date_id, full_date, year, month, day, is_weekend)
            VALUES (%s, %s, %s, %s, %s, %s)
            ON CONFLICT (date_id) DO NOTHING;
        """, (date_id, today, today.year, today.month, today.day, is_weekend))
        
        # Ensure vendor 1 exists
        cur.execute("""
            INSERT INTO dwh.dim_chromebook_vendor (vendor_id, vendor_name, region, contract_type)
            VALUES (1, 'TechCorp Taiwan', 'Asia', 'Standard')
            ON CONFLICT (vendor_id) DO NOTHING;
        """)
        
        # Insert margin risk fact
        cur.execute("""
            INSERT INTO dwh.fact_chromebook_margin_risk 
            (date_id, vendor_id, eur_to_usd, eur_to_twd, component_delay_days, freight_cost_eur, margin_impact_risk)
            VALUES (%s, %s, %s, %s, %s, %s, %s)
            RETURNING fact_id;
        """, (date_id, 1, eur_usd, eur_twd, delay, cost, risk))
        
        fact_id = cur.fetchone()[0]
        conn.commit()
        print(f"Load Successful! Inserted row fact_id={fact_id} into dwh.fact_chromebook_margin_risk")
    except Exception as e:
        conn.rollback()
        print(f"Database insertion failed: {e}")
        raise e
    finally:
        conn.close()

with DAG(
    'auroratech_realtime_pipeline',
    default_args=default_args,
    description='ETL pipeline for FX Rates and Freight Logs',
    schedule=timedelta(days=1),
    start_date=datetime(2026, 1, 1),
    catchup=False,
    tags=['auroratech'],
) as dag:

    t1 = PythonOperator(
        task_id='extract_currency_rates',
        python_callable=extract_currency_rates,
    )

    t2 = PythonOperator(
        task_id='extract_shipping_logistics',
        python_callable=extract_shipping_logistics,
    )

    t3 = PythonOperator(
        task_id='transform_and_load',
        python_callable=transform_and_load,
    )

    [t1, t2] >> t3
