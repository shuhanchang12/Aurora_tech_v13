// Mock data for the diverse file repositories and documents requested

export const BLOC2_REPO = [
  {
    name: 'README.md',
    language: 'markdown',
    content: `# AuroraTech Infrastructure
Full IaC documentation for Bloc 2 Data Architecture.

## Architecture Decisions
- Provider: AWS / GCP
- Orchestration: Kubernetes
- Containers: Docker
- Provisioning: Terraform

## Deployment
\`\`\`bash
cd terraform
terraform init
terraform apply -auto-approve
\`\`\`
`
  },
  {
    name: 'docker/docker-compose.yml',
    language: 'yaml',
    content: `version: '3.8'
services:
  postgres:
    image: postgres:14
    environment:
      POSTGRES_USER: auroratech
      POSTGRES_PASSWORD: \${DB_PASS}
      POSTGRES_DB: analytics
    ports:
      - "5432:5432"
    volumes:
      - pgdata:/var/lib/postgresql/data

  prometheus:
    image: prom/prometheus
    ports:
      - "9090:9090"

volumes:
  pgdata:
`
  },
  {
    name: 'terraform/main.tf',
    language: 'hcl',
    content: `provider "aws" {
  region = var.region
}

resource "aws_db_instance" "aurora" {
  identifier        = "auroratech-db"
  instance_class    = "db.r5.large"
  engine            = "postgres"
  engine_version    = "14.1"
  allocated_storage = 100
  
  username = var.db_user
  password = var.db_pass

  vpc_security_group_ids = [aws_security_group.db_sg.id]
}
`
  }
];

export const BLOC3_REPO = [
  {
    name: 'README.md',
    language: 'markdown',
    content: `# Real-Time Data Pipelines
ELT/ETL flows for real-time ingest using Airflow and dbt.

## Data Flow
Raw Data (Kafka) -> Snowflake (Staging) -> dbt (Transformation) -> Analytics Dashboards.

## Features
- Real-time stream monitoring.
- Quality control via Great Expectations.
- Error handling with dead-letter queues.
`
  },
  {
    name: 'dags/auroratech_pipeline.py',
    language: 'python',
    content: `from airflow import DAG
from airflow.providers.snowflake.operators.snowflake import SnowflakeOperator
from airflow.utils.dates import days_ago
from datetime import timedelta

default_args = {
    'owner': 'data_engineering',
    'depends_on_past': False,
    'email_on_failure': True,
    'email_on_retry': False,
    'retries': 3,
    'retry_delay': timedelta(minutes=5),
}

with DAG(
    'auroratech_realtime_elt',
    default_args=default_args,
    description='Main ELT pipeline for real-time analytics',
    schedule_interval='@hourly',
    start_date=days_ago(1),
    catchup=False,
) as dag:

    transform_data = SnowflakeOperator(
        task_id='run_dbt_models',
        sql='CALL dbt_cloud_run(job_id=12345);',
        snowflake_conn_id='snowflake_default',
    )
    
    # DAG execution path
    transform_data
`
  }
];

export const BLOC4_REPO = [
  {
    name: 'README.md',
    language: 'markdown',
    content: `# AI Solutions MLOps implementation
End-to-end industrialization of AuroraTech AI prediction model.

## Features
- CI/CD with GitHub Actions
- FastAPI serving API
- Automated retraining triggers
- Drift monitoring with Evidently.ai
`
  },
  {
    name: 'src/app.py',
    language: 'python',
    content: `import os
  import joblib
  import pandas as pd
  from fastapi import Depends, FastAPI, Header, HTTPException
  from pydantic import BaseModel, Field

  MODEL_DIR = "models"
  MODEL_PATH = os.path.join(MODEL_DIR, "auroratech_chromebook_model.pkl")
  ENCODER_PATH = os.path.join(MODEL_DIR, "label_encoder.pkl")
  API_KEY = os.getenv("API_KEY")

  try:
    model = joblib.load(MODEL_PATH)
    label_encoder = joblib.load(ENCODER_PATH)
  except FileNotFoundError:
    model = None
    label_encoder = None

  app = FastAPI(title="AuroraTech Margin Prediction API (DataCo Adapted)", version="1.1.0")

  class PredictionRequest(BaseModel):
    days_for_shipping_real: int = Field(...)
    days_for_shipment_scheduled: int = Field(...)
    shipping_mode: str = Field(...)
    order_item_total: float = Field(...)
    eur_usd_rate: float = Field(...)

  def verify_api_key(x_api_key: str | None = Header(default=None)) -> None:
    if API_KEY is None:
      return
    if x_api_key != API_KEY:
      raise HTTPException(status_code=401, detail="Invalid or missing API key")

  @app.get("/health")
  def health_check():
    return {
      "status": "ok",
      "model_loaded": model is not None,
      "encoder_loaded": label_encoder is not None,
      "api_key_required": API_KEY is not None,
    }

  @app.post("/predict-margin-risk")
  def predict(req: PredictionRequest, _: None = Depends(verify_api_key)):
    if model is None or label_encoder is None:
      raise HTTPException(status_code=503, detail="Model artifact or Label Encoder is not loaded. Train the model first.")

    features = pd.DataFrame([{
      "Days for shipping (real)": req.days_for_shipping_real,
      "Days for shipment (scheduled)": req.days_for_shipment_scheduled,
      "Shipping_Mode_Encoded": 0,
      "Order Item Total": req.order_item_total,
      "EUR_USD_Rate": req.eur_usd_rate,
    }])

    prediction = model.predict(features)[0]
    probability = model.predict_proba(features)[0][1]

    return {
      "status": "Success",
      "risk_prediction": int(prediction),
      "risk_probability": float(probability),
    }
  `
  },
  {
    name: '.github/workflows/mlops-ci.yml',
    language: 'yaml',
    content: `name: MLOps CI/CD Pipeline

on:
  push:
    branches: [ main ]

jobs:
  train-and-deploy:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v3
    
    - name: Set up Python
      uses: actions/setup-python@v4
      with:
        python-version: '3.9'
        
    - name: Install dependencies
      run: pip install -r requirements.txt
      
    - name: Run Tests & Quality Checks
      run: pytest tests/
      
    - name: Retrain Model
      run: python src/train_model.py
      
    - name: Build Docker Image
      run: docker build -t auroratech_api:latest .
`
  }
];
