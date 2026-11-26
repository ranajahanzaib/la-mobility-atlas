import unittest
from mobility.spatial.h3_grid import latlng_to_cell, cell_to_latlng, cell_to_boundary, cell_area, LA_BBOX

class TestH3Grid(unittest.TestCase):
    def test_latlng_to_cell_format(self):
        lat = 34.0522
        lng = -118.2437
        cell = latlng_to_cell(lat, lng, resolution=7)
        self.assertTrue(isinstance(cell, str))
        self.assertTrue(len(cell) >= 15)
        self.assertEqual(cell[1], "7") # resolution 7

    def test_cell_to_latlng_roundtrip(self):
        orig_lat = 34.0522
        orig_lng = -118.2437
        cell = latlng_to_cell(orig_lat, orig_lng, resolution=7)
        c_lat, c_lng = cell_to_latlng(cell)
        self.assertAlmostEqual(c_lat, orig_lat, delta=0.03)
        self.assertAlmostEqual(c_lng, orig_lng, delta=0.03)

    def test_cell_to_boundary(self):
        cell = latlng_to_cell(34.0522, -118.2437, resolution=7)
        boundary = cell_to_boundary(cell)
        self.assertGreaterEqual(len(boundary), 6)
        # Check closed polygon
        self.assertEqual(boundary[0], boundary[-1])
        # Check coordinates in bounding box
        for lng, lat in boundary:
            self.assertGreaterEqual(lat, 33.5)
            self.assertLessEqual(lat, 34.5)

    def test_cell_area(self):
        self.assertGreater(cell_area(6), cell_area(7))
        self.assertGreater(cell_area(7), cell_area(8))

if __name__ == "__main__":
    unittest.main()
