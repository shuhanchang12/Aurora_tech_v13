import unittest
import os
import csv
from python.anomaly_detector import AnomalyDetector

class TestAnomalyDetector(unittest.TestCase):
    def setUp(self):
        self.detector = AnomalyDetector(threshold=0.05)
        # Construct path to mock data relative to this test file
        self.mock_data_path = os.path.join(os.path.dirname(__file__), "mock_data", "mock_fx_rates_with_spikes.csv")

    def test_mock_data_anomalies(self):
        """Validates that AnomalyDetector successfully catches the 5%+ deviations in our mock dataset."""
        self.assertTrue(os.path.exists(self.mock_data_path), f"Mock data not found at: {self.mock_data_path}")
        
        with open(self.mock_data_path, mode="r", encoding="utf-8") as f:
            reader = csv.DictReader(f)
            rows = list(reader)
            
        # Row 0 to 3: Normal fluctuation
        for i in range(4):
            row = rows[i]
            date = row['date']
            eur_usd = float(row['EUR_USD'])
            eur_usd_ma = float(row['EUR_USD_MA_7'])
            eur_twd = float(row['EUR_TWD'])
            eur_twd_ma = float(row['EUR_TWD_MA_7'])
            
            # Should not be anomalous
            self.assertFalse(
                self.detector.is_anomalous(eur_usd, eur_usd_ma), 
                f"False positive on date {date} for EUR_USD"
            )
            self.assertFalse(
                self.detector.is_anomalous(eur_twd, eur_twd_ma), 
                f"False positive on date {date} for EUR_TWD"
            )

        # Row 4 (2026-06-05): EUR_USD drop spike (0.9800 vs 1.0990 MA -> 10.8% drop)
        usd_row = rows[4]
        self.assertEqual(usd_row['date'], '2026-06-05')
        self.assertTrue(
            self.detector.is_anomalous(float(usd_row['EUR_USD']), float(usd_row['EUR_USD_MA_7'])),
            "Failed to catch EUR_USD drop anomaly on 2026-06-05"
        )
        
        # Row 5 (2026-06-06): EUR_TWD drop spike (30.2000 vs 34.4900 MA -> 12.4% drop)
        twd_row = rows[5]
        self.assertEqual(twd_row['date'], '2026-06-06')
        self.assertTrue(
            self.detector.is_anomalous(float(twd_row['EUR_TWD']), float(twd_row['EUR_TWD_MA_7'])),
            "Failed to catch EUR_TWD drop anomaly on 2026-06-06"
        )

if __name__ == '__main__':
    unittest.main()
