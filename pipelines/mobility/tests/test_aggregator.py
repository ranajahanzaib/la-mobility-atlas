import unittest
from mobility.aggregation.aggregator import MobilityAggregator, calculate_percentiles, compute_metric_summary

class TestAggregator(unittest.TestCase):
    def test_calculate_percentiles(self):
        values = list(range(1, 101)) # 1 to 100
        p = calculate_percentiles(values)
        self.assertAlmostEqual(p["p50"], 50.5, delta=1.0)
        self.assertAlmostEqual(p["p90"], 90.1, delta=1.0)

    def test_compute_metric_summary(self):
        values = [10.0, 20.0, 30.0, 40.0, 50.0]
        summary = compute_metric_summary(values, num_bins=5)
        self.assertEqual(summary["count"], 5)
        self.assertEqual(summary["mean"], 30.0)
        self.assertEqual(summary["min"], 10.0)
        self.assertEqual(summary["max"], 50.0)
        self.assertEqual(len(summary["bins"]), 5)

    def test_aggregator_workflow(self):
        agg = MobilityAggregator(resolution=7)
        meta = {
            "uuid": "u-001",
            "tuid": "t-0001",
            "origin_latitude": 34.0522,
            "origin_longitude": -118.2437,
            "destination_latitude": 34.0195,
            "destination_longitude": -118.4912,
            "departure_time": "2019-12-02T16:00:00Z",
            "travel_distance": 24000.0,
            "travel_time": 1800.0,
            "displacement": 21000.0,
            "count": 20,
        }
        agg.process_trajectory(meta)
        cells = agg.build_h3_cells()
        flows = agg.build_od_flows(min_trips=1)
        temporal = agg.build_temporal_summary()
        dists = agg.build_distributions()

        self.assertGreaterEqual(len(cells), 2)
        self.assertEqual(len(flows), 1)
        self.assertEqual(flows[0]["trip_count"], 1)
        self.assertEqual(len(temporal["hourly_profiles"]), 24)
        self.assertEqual(dists["duration"]["count"], 1)

if __name__ == "__main__":
    unittest.main()
