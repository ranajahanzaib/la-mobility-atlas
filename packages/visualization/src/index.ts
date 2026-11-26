/**
 * @la-mobility-atlas/visualization
 * Shared mathematical, deck.gl, and D3-compatible visualization utilities
 */

import type {
  H3CellActivity,
  ODFlow,
  PlaybackTrajectory,
} from "@la-mobility-atlas/contracts";
import { PALETTES } from "@la-mobility-atlas/design-tokens";

/**
 * Maps a numeric value to an RGBA color array using a multi-stop color palette
 */
export function interpolateRgba(
  value: number,
  domain: [number, number],
  stops: [number, number, number, number][],
  scaleType: "linear" | "log" | "sqrt" = "linear",
): [number, number, number, number] {
  if (domain[1] <= domain[0]) {
    return stops[0];
  }

  // Normalize to 0..1
  let normalized: number;
  const clamped = Math.max(domain[0], Math.min(domain[1], value));

  if (scaleType === "log") {
    const minLog = Math.log(Math.max(1, domain[0]));
    const maxLog = Math.log(Math.max(2, domain[1]));
    const valLog = Math.log(Math.max(1, clamped));
    normalized = (valLog - minLog) / (maxLog - minLog || 1);
  } else if (scaleType === "sqrt") {
    normalized =
      Math.sqrt(clamped - domain[0]) / Math.sqrt(domain[1] - domain[0] || 1);
  } else {
    normalized = (clamped - domain[0]) / (domain[1] - domain[0]);
  }

  normalized = Math.max(0, Math.min(1, normalized));

  const numSegments = stops.length - 1;
  const segment = Math.min(
    numSegments - 1,
    Math.floor(normalized * numSegments),
  );
  const t = (normalized - segment / numSegments) * numSegments;

  const c0 = stops[segment];
  const c1 = stops[segment + 1];

  return [
    Math.round(c0[0] + (c1[0] - c0[0]) * t),
    Math.round(c0[1] + (c1[1] - c0[1]) * t),
    Math.round(c0[2] + (c1[2] - c0[2]) * t),
    Math.round(c0[3] + (c1[3] - c0[3]) * t),
  ];
}

/**
 * Creates Deck.gl ArcLayer data objects from ODFlow items
 */
export function formatArcData(
  flows: ODFlow[],
  maxTrips: number,
  options?: {
    scaleWidth?: (trips: number) => number;
  },
) {
  const getWidth =
    options?.scaleWidth ||
    ((trips: number) => {
      const norm = Math.log(trips + 1) / Math.log(maxTrips + 1);
      return Math.max(1.5, norm * 12);
    });

  return flows.map((f) => ({
    sourcePosition: f.origin_coords,
    targetPosition: f.destination_coords,
    sourceColor: [53, 214, 232, 220] as [number, number, number, number], // Cyan
    targetColor: [218, 95, 242, 240] as [number, number, number, number], // Flow magenta
    width: getWidth(f.trip_count),
    flow: f,
  }));
}

/**
 * Formats H3 cells for Deck.gl H3HexagonLayer or PolygonLayer
 */
export function formatH3CellData(
  cells: H3CellActivity[],
  metric: keyof Pick<
    H3CellActivity,
    | "origin_count"
    | "destination_count"
    | "distinct_trajectories"
    | "observation_count"
  >,
  elevationScale = 50,
) {
  const values = cells.map((c) => c[metric] as number);
  const maxVal = Math.max(...values, 1);
  const minVal = Math.min(...values, 0);

  return cells.map((cell) => {
    const val = cell[metric] as number;
    const color = interpolateRgba(
      val,
      [minVal, maxVal],
      PALETTES.tripDensity.rgbaStops,
      "sqrt",
    );
    const elevation = (val / maxVal) * elevationScale;

    return {
      hex: cell.cell_id,
      cell,
      value: val,
      color,
      elevation,
    };
  });
}

/**
 * Builds SVG path string for a sparkline chart
 */
export function generateSparklineSvg(
  values: number[],
  width = 120,
  height = 32,
): string {
  if (!values || values.length === 0) return "";
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min || 1;

  const points = values.map((val, idx) => {
    const x = (idx / (values.length - 1)) * width;
    const y = height - ((val - min) / range) * (height - 4) - 2;
    return `${x.toFixed(1)},${y.toFixed(1)}`;
  });

  return `M ${points.join(" L ")}`;
}

/**
 * Formats trajectory coordinates into Deck.gl TripsLayer format
 */
export function formatTripsLayerData(trajectories: PlaybackTrajectory[]) {
  return trajectories.map((traj) => ({
    path: traj.path.map((p) => [p[0], p[1]]),
    timestamps: traj.path.map((p) => p[2]),
    color:
      traj.color_category === "weekend"
        ? PALETTES.dayType.weekendRgb
        : PALETTES.dayType.weekdayRgb,
    id: traj.id,
    duration: traj.duration_seconds,
    distance: traj.distance_meters,
  }));
}

/**
 * Builds an N x N Origin-Destination flow matrix
 */
export function buildFlowMatrix(
  regions: string[],
  flows: Array<{ origin: string; destination: string; count: number }>,
): {
  matrix: number[][];
  rowTotals: number[];
  colTotals: number[];
  grandTotal: number;
} {
  const indexMap = new Map<string, number>();
  regions.forEach((r, i) => indexMap.set(r, i));

  const n = regions.length;
  const matrix: number[][] = Array.from({ length: n }, () => Array(n).fill(0));
  const rowTotals = Array(n).fill(0);
  const colTotals = Array(n).fill(0);
  let grandTotal = 0;

  flows.forEach((f) => {
    const rIdx = indexMap.get(f.origin);
    const cIdx = indexMap.get(f.destination);
    if (rIdx !== undefined && cIdx !== undefined) {
      matrix[rIdx][cIdx] += f.count;
      rowTotals[rIdx] += f.count;
      colTotals[cIdx] += f.count;
      grandTotal += f.count;
    }
  });

  return { matrix, rowTotals, colTotals, grandTotal };
}
