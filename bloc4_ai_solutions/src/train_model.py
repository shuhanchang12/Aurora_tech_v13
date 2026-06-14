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
    Loads raw Kaggle datasets (laptop_price.csv and supply_chain_data.csv) 
    and applies Chromebook-specific supply chain feature engineering.
    """
    print("Loading raw Kaggle datasets...")
    laptop_path = os.path.join("..", "bloc3_pipelines", "dataset", "laptop_price.csv")
    supply_path = os.path.join("..", "bloc3_pipelines", "dataset", "supply_chain_data.csv")
    
    # Check fallback path just in case we are run from root vs src
    if not os.path.exists(laptop_path):
        laptop_path = os.path.join("bloc3_pipelines", "dataset", "laptop_price.csv")
        supply_path = os.path.join("bloc3_pipelines", "dataset", "supply_chain_data.csv")
        
    laptops = pd.read_csv(laptop_path, encoding='latin-1')
    supply = pd.read_csv(supply_path)
    
    # Connect them: assign a random Chromebook / laptop to each supply chain transaction
    np.random.seed(42)
    random_laptops = laptops.sample(n=len(supply), replace=True, random_state=42).reset_index(drop=True)
    df = pd.concat([supply, random_laptops], axis=1)
    
    print("Applying Data Masking & Feature Engineering for Chromebook Context...")
    
    # 1. Map raw fields to MLOps model expected fields
    df['Days for shipping (real)'] = df['Shipping times']
    
    # scheduled transit days mapped by transportation mode
    mode_scheduled_days = {'Air': 2, 'Road': 4, 'Rail': 4, 'Sea': 7}
    df['Days for shipment (scheduled)'] = df['Transportation modes'].map(mode_scheduled_days)
    
    # map transportation modes to Shipping Mode classes
    mode_shipping_class = {'Air': 'First Class', 'Road': 'Second Class', 'Rail': 'Second Class', 'Sea': 'Standard Class'}
    df['Shipping Mode'] = df['Transportation modes'].map(mode_shipping_class)
    
    # calculate total order value by multiplying laptop price by quantities
    df['Order Item Total'] = df['Price_euros'] * df['Order quantities']
    
    # calculate benefit per order
    df['Benefit per order'] = df['Revenue generated'] - (df['Manufacturing costs'] * df['Order quantities']) - df['Shipping costs']
    
    # Add date field
    df['Date'] = pd.date_range(start='2026-06-01', periods=len(df), freq='D')
    
    # Inject Virtual Settings for Chromebook Pipeline
    df['Product_Category'] = 'Chromebook' # Domain Masking
    
    # Simulate joining with external Forex table
    df['EUR_USD_Rate'] = np.random.uniform(1.05, 1.15, len(df))
    
    # Calculate Delay based on DataCo logic
    df['Delay_Days'] = df['Days for shipping (real)'] - df['Days for shipment (scheduled)']
    df['Delay_Days'] = df['Delay_Days'].apply(lambda x: x if x > 0 else 0)
    
    # Define Target: Margin Risk (1 if Benefit is negative or delay exceeds threshold causing penalties)
    df['Margin_Risk'] = ((df['Benefit per order'] < 0) | (df['Delay_Days'] > 3)).astype(int)
    
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

