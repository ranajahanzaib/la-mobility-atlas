import { TripsLayer } from "@deck.gl/geo-layers";
import { ArcLayer, PolygonLayer, ScatterplotLayer } from "@deck.gl/layers";
import type {
  H3CellActivity,
  ODFlow,
  PlaybackTrajectory,
  RegionSummary,
} from "@la-mobility-atlas/contracts";
import {
  formatArcData,
  formatH3CellData,
  formatTripsLayerData,
} from "@la-mobility-atlas/visualization";

export interface CreateLayersOptions {
  flows?: ODFlow[];
  cells?: H3CellActivity[];
  regions?: RegionSummary[];
  trajectories?: PlaybackTrajectory[];
  selectedCell?: H3CellActivity | null;
  selectedFlow?: ODFlow | null;
  metric?:
    | "origin_count"
    | "destination_count"
    | "distinct_trajectories"
    | "observation_count";
  currentTime?: number;
  trailLength?: number;
  is3D?: boolean;
  activeLayers?: {
    arcs: boolean;
    densityHexagons: boolean;
    trajectories: boolean;
    regions: boolean;
    hotspots: boolean;
  };
  onCellClick?: (cell: H3CellActivity) => void;
  onFlowClick?: (flow: ODFlow) => void;
}

export function buildDeckLayers(options: CreateLayersOptions) {
  const {
    flows = [],
    cells = [],
    trajectories = [],
    selectedCell = null,
    selectedFlow = null,
    metric = "origin_count",
    currentTime = 28800,
    trailLength = 180,
    is3D = true,
    activeLayers = {
      arcs: true,
      densityHexagons: true,
      trajectories: true,
      regions: true,
      hotspots: true,
    },
    onCellClick,
    onFlowClick,
  } = options;

  const layers = [];

  // 1. Extruded H3 Hexagon Density Layer (PolygonLayer)
  if (activeLayers.densityHexagons && cells.length > 0) {
    const formattedCells = formatH3CellData(cells, metric, is3D ? 800 : 0);

    layers.push(
      new PolygonLayer({
        id: "h3-density-layer",
        data: formattedCells,
        pickable: true,
        stroked: true,
        filled: true,
        extruded: is3D,
        wireframe: false,
        getPolygon: (d: any) => d.cell.boundary || [],
        getFillColor: (d: any) => {
          if (selectedCell && d.cell.cell_id === selectedCell.cell_id) {
            return [255, 196, 107, 255]; // Highlight selected in amber
          }
          return d.color;
        },
        getLineColor: [34, 49, 63, 160],
        getLineWidth: 2,
        lineWidthUnits: "pixels",
        getElevation: (d: any) => d.elevation,
        elevationScale: is3D ? 1 : 0,
        onClick: (info: any) => {
          if (info.object && onCellClick) {
            onCellClick(info.object.cell);
          }
        },
        updateTriggers: {
          getFillColor: [selectedCell?.cell_id, metric],
          getElevation: [is3D, metric],
        },
      }),
    );
  }

  // 2. Origin-Destination Flow Arcs (ArcLayer)
  if (activeLayers.arcs && flows.length > 0) {
    const maxTrips = Math.max(...flows.map((f) => f.trip_count), 1);
    const visibleFlows = selectedCell
      ? flows.filter(
          (f) =>
            f.origin_cell === selectedCell.cell_id ||
            f.destination_cell === selectedCell.cell_id,
        )
      : flows.slice(0, 150); // limit to top 150 flows for 60fps fluidity

    const arcData = formatArcData(visibleFlows, maxTrips);

    layers.push(
      new ArcLayer({
        id: "od-flows-layer",
        data: arcData,
        pickable: true,
        getWidth: (d: any) => {
          if (selectedFlow && d.flow === selectedFlow) return d.width * 2.5;
          return d.width;
        },
        getSourcePosition: (d: any) => d.sourcePosition,
        getTargetPosition: (d: any) => d.targetPosition,
        getSourceColor: (d: any) => d.sourceColor,
        getTargetColor: (d: any) => d.targetColor,
        getHeight: (d: any) => (is3D ? 0.35 : 0.05),
        onClick: (info: any) => {
          if (info.object && onFlowClick) {
            onFlowClick(info.object.flow);
          }
        },
        updateTriggers: {
          getWidth: [selectedFlow],
          getHeight: [is3D],
        },
      }),
    );
  }

  // 3. Animated Trajectory Playback (TripsLayer)
  if (activeLayers.trajectories && trajectories.length > 0) {
    const tripsData = formatTripsLayerData(trajectories);

    layers.push(
      new TripsLayer({
        id: "trajectories-playback-layer",
        data: tripsData,
        getPath: (d: any) => d.path,
        getTimestamps: (d: any) => d.timestamps,
        getColor: (d: any) => d.color,
        opacity: 0.95,
        widthMinPixels: 2.5,
        rounded: true,
        trailLength: trailLength,
        currentTime: currentTime % 3600, // loop within hourly chunk
        shadowEnabled: false,
      }),
    );
  }

  // 4. Hotspot Centroid Points (ScatterplotLayer)
  if (activeLayers.hotspots && cells.length > 0) {
    const topCells = cells.slice(0, 25);
    layers.push(
      new ScatterplotLayer({
        id: "hotspot-points-layer",
        data: topCells,
        pickable: true,
        getPosition: (d: any) => [d.center_lng, d.center_lat],
        getFillColor: [53, 214, 232, 220],
        getRadius: (d: any) =>
          Math.sqrt(d.origin_count + d.destination_count) * 80,
        radiusMinPixels: 4,
        radiusMaxPixels: 24,
        stroked: true,
        getLineColor: [255, 255, 255, 180],
        getLineWidth: 1.5,
        lineWidthUnits: "pixels",
      }),
    );
  }

  return layers;
}
