class AnomalyDetector:
    """
    Enforces Data Quality rules for Project Atomic-Link.
    Specifically checks if a daily currency rate deviates from the 
    historical moving average by more than the defined threshold (default: 5%).
    """
    def __init__(self, threshold=0.05):
        self.threshold = threshold

    def is_anomalous(self, current_rate, moving_average):
        if moving_average <= 0:
            return False
            
        deviation = abs(current_rate - moving_average) / moving_average
        return deviation > self.threshold
