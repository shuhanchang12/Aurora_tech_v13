import unittest
import numpy as np
import pandas as pd
from sklearn.ensemble import RandomForestClassifier
from src.train_model import fetch_and_adapt_dataco

class TestModelTraining(unittest.TestCase):
    
    def setUp(self):
        self.df = fetch_and_adapt_dataco()
        
    def test_data_shape(self):
        """Test if the fetched data has the required columns and non-zero rows."""
        self.assertGreater(len(self.df), 0)
        expected_columns = [
            'Days for shipping (real)', 
            'Days for shipment (scheduled)', 
            'Shipping Mode', 
            'Order Item Total', 
            'EUR_USD_Rate',
            'Delay_Days',
            'Margin_Risk'
        ]
        for col in expected_columns:
            self.assertIn(col, self.df.columns)
            
    def test_model_inference_format(self):
        """Test model output dimension and binary format."""
        features = [
            'Days for shipping (real)', 
            'Days for shipment (scheduled)', 
            'Order Item Total', 
            'EUR_USD_Rate'
        ]
        X = self.df[features].head(10)
        y = self.df['Margin_Risk'].head(10)
        
        clf = RandomForestClassifier(n_estimators=10, random_state=42)
        clf.fit(X, y)
        
        # Test inference
        dummy_input = pd.DataFrame([{
            'Days for shipping (real)': 5,
            'Days for shipment (scheduled)': 5,
            'Order Item Total': 500.0,
            'EUR_USD_Rate': 1.10
        }])
        
        prediction = clf.predict(dummy_input)
        self.assertEqual(len(prediction), 1)
        self.assertIn(prediction[0], [0, 1])

if __name__ == "__main__":
    unittest.main()

