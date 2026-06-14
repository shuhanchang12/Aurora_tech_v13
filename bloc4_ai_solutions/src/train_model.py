import os
import pandas as pd
import numpy as np
import joblib
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import classification_report, accuracy_score, f1_score
from sklearn.preprocessing import LabelEncoder

def fetch_and_adapt_dataco():
    """
    Loads raw Kaggle datasets (laptop_price.csv and Electronic_sales_Sep2023-Sep2024.csv) 
    and applies Chromebook-specific supply chain feature engineering.
    """
    print("Loading raw Kaggle datasets...")
    laptop_path = os.path.join("..", "bloc3_pipelines", "dataset", "laptop_price.csv")
    sales_path = os.path.join("..", "bloc3_pipelines", "dataset", "Electronic_sales_Sep2023-Sep2024.csv")
    
    # Check fallback path just in case we are run from root vs src
    if not os.path.exists(laptop_path):
        laptop_path = os.path.join("bloc3_pipelines", "dataset", "laptop_price.csv")
        sales_path = os.path.join("bloc3_pipelines", "dataset", "Electronic_sales_Sep2023-Sep2024.csv")
        
    laptops = pd.read_csv(laptop_path, encoding='latin-1')
    sales = pd.read_csv(sales_path)
    
    # GDPR Compliance & Data Anonymization
    # 1. Drop client PII (Age, Gender) to prevent storing identifying details in the DW
    if 'Age' in sales.columns:
        sales = sales.drop(columns=['Age', 'Gender'], errors='ignore')
        print("GDPR Compliance: Dropped client PII columns (Age, Gender).")
    # 2. Pseudonymize Customer ID using SHA-256 hashing
    if 'Customer ID' in sales.columns:
        import hashlib
        sales['Customer ID'] = sales['Customer ID'].apply(lambda x: hashlib.sha256(str(x).encode()).hexdigest()[:12])
        print("GDPR Compliance: Anonymized Customer ID using SHA-256.")
        
    # Connect them: assign a random Chromebook / laptop to each sales transaction
    np.random.seed(42)
    random_laptops = laptops.sample(n=len(sales), replace=True, random_state=42).reset_index(drop=True)
    df = pd.concat([sales, random_laptops], axis=1)
    
    print("Applying Data Masking & Feature Engineering for Chromebook Context...")
    
    # 1. Map raw fields to MLOps model expected fields
    # Generate Days for shipping (real) based on Shipping Type
    # Same Day / Overnight -> 1-2 days, Express / Expedited -> 2-4 days, Standard -> 5-10 days
    real_shipping_days = []
    for shipping_type in df['Shipping Type']:
        if shipping_type in ['Same Day', 'Overnight']:
            real_shipping_days.append(np.random.randint(1, 3))
        elif shipping_type in ['Express', 'Expedited']:
            real_shipping_days.append(np.random.randint(2, 5))
        else: # Standard
            real_shipping_days.append(np.random.randint(5, 11))
    df['Days for shipping (real)'] = real_shipping_days
    
    # scheduled transit days mapped by Shipping Type
    type_scheduled_days = {'Same Day': 1, 'Overnight': 1, 'Express': 3, 'Expedited': 3, 'Standard': 6}
    df['Days for shipment (scheduled)'] = df['Shipping Type'].map(type_scheduled_days).fillna(6).astype(int)
    
    # map shipping types to Shipping Mode classes
    type_shipping_class = {
        'Same Day': 'First Class', 
        'Overnight': 'First Class', 
        'Express': 'Second Class', 
        'Expedited': 'Second Class', 
        'Standard': 'Standard Class'
    }
    df['Shipping Mode'] = df['Shipping Type'].map(type_shipping_class).fillna('Standard Class')
    
    # calculate total order value by multiplying laptop price by quantities
    df['Order Item Total'] = df['Price_euros'] * df['Quantity']
    
    # Calculate Delay based on logic
    df['Delay_Days'] = df['Days for shipping (real)'] - df['Days for shipment (scheduled)']
    df['Delay_Days'] = df['Delay_Days'].apply(lambda x: x if x > 0 else 0)
    
    # Calculate Benefit per order:
    # Revenue = Order Item Total
    # Base Cost = 75% of Revenue
    # Extra Freight = Same Day: 50, Overnight: 40, Express: 15, Expedited: 15, Standard: 5 per unit
    # Delay Penalty = if Delay > 2 days, penalty of 50 per unit
    base_cost = df['Order Item Total'] * 0.75
    extra_freight = df['Shipping Type'].map({'Same Day': 50.0, 'Overnight': 40.0, 'Express': 15.0, 'Expedited': 15.0, 'Standard': 5.0}).fillna(5.0) * df['Quantity']
    delay_penalty = df['Delay_Days'].apply(lambda x: 50.0 if x > 2 else 0.0) * df['Quantity']
    total_cost = base_cost + extra_freight + delay_penalty
    
    df['Benefit per order'] = df['Order Item Total'] - total_cost
    
    # Add date field
    df['Date'] = pd.to_datetime(df['Purchase Date'])
    
    # Inject Virtual Settings for Chromebook Pipeline
    df['Product_Category'] = 'Chromebook' # Domain Masking
    
    # Simulate joining with external Forex table
    df['EUR_USD_Rate'] = np.random.uniform(1.05, 1.15, len(df))
    
    # Define Target: Margin Risk (1 if Benefit per order is low, i.e. < 5% of Revenue, or delay is high)
    df['Margin_Risk'] = ((df['Benefit per order'] < df['Order Item Total'] * 0.05) | (df['Delay_Days'] > 3)).astype(int)
    
    return df

def train_and_save_model():
    df = fetch_and_adapt_dataco()
    
    # Encode categorical features
    le = LabelEncoder()
    df['Shipping_Mode_Encoded'] = le.fit_transform(df['Shipping Mode'])
    
    # Save label encoder for inference
    os.makedirs(os.path.dirname("models/") or '.', exist_ok=True)
    joblib.dump(le, "models/label_encoder.pkl")
    print("Label encoder saved as 'models/label_encoder.pkl'")
    
    features = [
        'Days for shipping (real)', 
        'Days for shipment (scheduled)', 
        'Shipping_Mode_Encoded', 
        'Order Item Total', 
        'EUR_USD_Rate'
    ]
    target = 'Margin_Risk'
    
    X = df[features]
    y = df[target]
    
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42, stratify=y)
    
    print("Training Initial Random Forest Model (Cold Start Mode)...")
    clf = RandomForestClassifier(n_estimators=100, max_depth=6, class_weight='balanced', random_state=42)
    clf.fit(X_train, y_train)
    
    y_pred = clf.predict(X_test)
    acc = accuracy_score(y_test, y_pred)
    f1 = f1_score(y_test, y_pred)
    
    print(f"Validation Accuracy: {acc:.4f}")
    print(f"Validation F1-Score: {f1:.4f}")
    print("\nClassification Report:\n", classification_report(y_test, y_pred))
    
    joblib.dump(clf, "models/auroratech_chromebook_model.pkl")
    print("Model serialized and saved as 'models/auroratech_chromebook_model.pkl'")

if __name__ == "__main__":
    train_and_save_model()

