import unittest
from mobility.validation.validator import DatasetValidator
from mobility.spatial.h3_grid import LA_BBOX

class TestValidator(unittest.TestCase):
    def setUp(self):
        self.validator = DatasetValidator(bbox=LA_BBOX)

    def test_valid_metadata_row(self):
        valid_row = {
            "uuid": "u-0001",
            "tuid": "t-000001",
            "origin_latitude": 34.0522,
            "origin_longitude": -118.2437,
            "destination_latitude": 34.0195,
            "destination_longitude": -118.4912,
            "departure_time": "2019-12-02T08:30:00Z",
            "travel_distance": 25000.0,
            "travel_time": 1800.0,
            "displacement": 22000.0,
            "count": 25,
        }
        is_valid, err = self.validator.validate_metadata_row(valid_row)
        self.assertTrue(is_valid, err)

    def test_out_of_bounds_metadata_quarantined(self):
        invalid_row = {
            "uuid": "u-9999",
            "tuid": "t-999999",
            "origin_latitude": 37.7749, # San Francisco (out of bounds)
            "origin_longitude": -122.4194,
            "destination_latitude": 34.0195,
            "destination_longitude": -118.4912,
            "departure_time": "2019-12-02T08:30:00Z",
            "travel_distance": 500000.0,
            "travel_time": 20000.0,
            "displacement": 450000.0,
            "count": 25,
        }
        is_valid, err = self.validator.validate_metadata_row(invalid_row)
        self.assertFalse(is_valid)
        self.assertIn("out of LA coverage bounds", err)

    def test_valid_observation_row(self):
        valid_obs = {
            "uuid": "u-0001",
            "tuid": "t-000001",
            "latitude": 34.0522,
            "longitude": -118.2437,
            "accuracy": 0,
            "timestamp": "2019-12-02T08:30:05Z",
        }
        is_valid, err = self.validator.validate_observation_row(valid_obs)
        self.assertTrue(is_valid, err)

if __name__ == "__main__":
    unittest.main()
