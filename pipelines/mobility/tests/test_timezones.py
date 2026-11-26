import unittest
from datetime import datetime, timezone
from mobility.normalization.timezones import parse_timestamp_utc, to_la_local_time, extract_temporal_dimensions

class TestTimezones(unittest.TestCase):
    def test_parse_timestamp_utc(self):
        ts_str = "2019-12-02T16:00:00Z"
        dt = parse_timestamp_utc(ts_str)
        self.assertEqual(dt.year, 2019)
        self.assertEqual(dt.month, 12)
        self.assertEqual(dt.day, 2)
        self.assertEqual(dt.hour, 16)
        self.assertEqual(dt.tzinfo, timezone.utc)

    def test_utc_to_la_conversion(self):
        # 16:00 UTC in December (PST, UTC-8) is 08:00 AM local LA time
        dt_utc = datetime(2019, 12, 2, 16, 0, 0, tzinfo=timezone.utc)
        dt_la = to_la_local_time(dt_utc)
        self.assertEqual(dt_la.hour, 8)
        self.assertEqual(dt_la.day, 2)

    def test_extract_temporal_dimensions(self):
        # 2019-12-02 was a Monday
        dt_utc = datetime(2019, 12, 2, 16, 0, 0, tzinfo=timezone.utc)
        dim = extract_temporal_dimensions(dt_utc)
        self.assertEqual(dim["hour"], 8)
        self.assertEqual(dim["day_type"], "weekday")
        self.assertEqual(dim["day_name"], "Monday")

        # 2019-12-07 was a Saturday
        dt_sat = datetime(2019, 12, 7, 20, 0, 0, tzinfo=timezone.utc)
        dim_sat = extract_temporal_dimensions(dt_sat)
        self.assertEqual(dim_sat["hour"], 12)
        self.assertEqual(dim_sat["day_type"], "weekend")
        self.assertEqual(dim_sat["day_name"], "Saturday")

if __name__ == "__main__":
    unittest.main()
