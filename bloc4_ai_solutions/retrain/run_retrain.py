from pathlib import Path
import subprocess
from datetime import datetime

def run_retraining():
    project_root = Path(__file__).resolve().parents[1]
    print(f"[{datetime.now().isoformat()}] Starting Automated Retraining Pipeline...")
    
    # Step 1: Fetch new data and train the model
    print("--- Step 1: Training Module ---")
    ret_code = subprocess.run(["python", str(project_root / "src" / "train_model.py")], cwd=project_root).returncode
    
    if ret_code != 0:
        print("Retraining failed at the training module.")
        return False
        
    print("--- Step 1 Complete ---")
    
    # Step 2: Validate through PyTest / Unittest
    print("--- Step 2: Validation via Tests ---")
    test_code = subprocess.run(["python", "-m", "unittest", "discover", "-s", "tests", "-p", "test_model.py"], cwd=project_root).returncode
    
    if test_code != 0:
        print("Validation tests failed. The newly trained model will NOT be deployed.")
        return False
        
    print("--- Step 2 Complete ---")
    print(f"[{datetime.now().isoformat()}] Automated Retraining Pipeline completed successfully.")
    print("New model serialized. Ready for CD deployment/restart.")
    return True

if __name__ == "__main__":
    run_retraining()
