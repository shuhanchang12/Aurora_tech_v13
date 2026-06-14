import sys
from pathlib import Path
project_root = Path(__file__).resolve().parents[1]
sys.path.append(str(project_root))

import numpy as np
import pandas as pd
import subprocess
from scipy.stats import ks_2samp
import yaml
from src.train_model import fetch_and_adapt_dataco

def load_config():
    with open(project_root / "monitoring" / "drift_config.yaml", "r") as f:
        return yaml.safe_load(f)

def get_baseline_data():
    """Loads baseline feature distribution from the training dataset"""
    df = fetch_and_adapt_dataco()
    return df['EUR_USD_Rate'].values

def get_production_data():
    """Loads latest production requests (with injected drift to demonstrate circuit breaker)"""
    df = fetch_and_adapt_dataco()
    # Introducing a drift in the distribution (weaker Euro)
    return df['EUR_USD_Rate'].values - 0.08

def calculate_drift():
    print("Initiating Drift Detection monitoring...")
    baseline = get_baseline_data()
    prod = get_production_data()
    
    # Kolmogorov-Smirnov test for goodness of fit
    stat, p_value = ks_2samp(baseline, prod)
    
    config = load_config()
    threshold = config['drift_detection']['threshold']
    
    print(f"KS Statistic: {stat:.4f}, P-Value: {p_value:.4f}")
    
    if stat > threshold:
        print(f"Warning: Drift threshold exceeded ({stat:.4f} > {threshold}). Concept/Data Drift detected!")
        return True
    
    print("No significant drift detected. Model is healthy.")
    return False

if __name__ == "__main__":
    is_drifted = calculate_drift()
    if is_drifted:
        print("Triggering automated retraining pipeline...")
        # Automatically call the retraining script
        subprocess.run(["python", str(Path(__file__).resolve().parents[1] / "retrain" / "run_retrain.py")], cwd=Path(__file__).resolve().parents[1])
