from pathlib import Path
import pandas as pd

root = Path(__file__).resolve().parent / "dataset"
laptops = pd.read_csv(root / "laptop_price.csv")
sales = pd.read_csv(root / "electronic_sales.csv")

print(f"laptops={len(laptops)}")
print(f"sales={len(sales)}")
print("shipping_mix=" + str(sales["Shipping Type"].value_counts().to_dict()))
