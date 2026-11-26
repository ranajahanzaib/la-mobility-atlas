import unittest
from mobility.trajectories.chunks import simplify_path, PlaybackChunker

class TestTrajectories(unittest.TestCase):
    def test_simplify_path(self):
        # 3 collinear points: middle point should be eliminated
        points = [
            (-118.40, 34.00, 0.0),
            (-118.35, 34.00, 10.0),
            (-118.30, 34.00, 20.0),
        ]
        simplified = simplify_path(points, tolerance_deg=0.0001)
        self.assertEqual(len(simplified), 2)
        self.assertEqual(simplified[0], points[0])
        self.assertEqual(simplified[-1], points[-1])

    def test_playback_chunker(self):
        chunker = PlaybackChunker(target_sample_rate=0.10)
        observations = [
            {"latitude": 34.00, "longitude": -118.40, "timestamp": "2019-12-02T08:00:00Z"},
            {"latitude": 34.02, "longitude": -118.35, "timestamp": "2019-12-02T08:05:00Z"},
            {"latitude": 34.05, "longitude": -118.25, "timestamp": "2019-12-02T08:15:00Z"},
        ]
        chunker.add_trajectory(
            traj_id="u-001",
            tuid="t-0001",
            departure_time="2019-12-02T08:00:00Z",
            observations=observations,
            color_category="weekday"
        )
        chunks = chunker.export_chunks()
        self.assertEqual(len(chunks), 1)
        self.assertEqual(chunks[0]["chunk_id"], "chunk-2019-12-02")
        self.assertEqual(chunks[0]["trajectory_count"], 1)
        traj = chunks[0]["trajectories"][0]
        self.assertEqual(len(traj["path"]), 3)
        self.assertEqual(traj["path"][0][2], 0.0) # start relative offset
        self.assertEqual(traj["path"][-1][2], 900.0) # 15 minutes offset

if __name__ == "__main__":
    unittest.main()
