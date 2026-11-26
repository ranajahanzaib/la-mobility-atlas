import type {
  H3CellActivity,
  ODFlow,
  RegionSummary,
} from "@la-mobility-atlas/contracts";
import { CAMERA_PRESETS } from "@la-mobility-atlas/design-tokens";
import { create } from "zustand";

export type DayTypeFilter = "all" | "weekday" | "weekend";
export type MetricType =
  | "origin_count"
  | "destination_count"
  | "distinct_trajectories"
  | "observation_count";

export interface ExplorationState {
  // Filters
  selectedDate: string;
  departureWindow: [number, number]; // [startHour, endHour] e.g. [0, 24]
  dayType: DayTypeFilter;
  metric: MetricType;
  spatialResolution: number; // 6, 7, 8

  // Selections
  selectedCell: H3CellActivity | null;
  selectedRegion: RegionSummary | null;
  selectedFlow: ODFlow | null;

  // Playback state
  isPlaying: boolean;
  currentTime: number; // seconds offset into the day (0..86400)
  playbackSpeed: number; // 1, 10, 60, 300, 600
  trailLength: number; // seconds (e.g. 120)
  loop: boolean;

  // Camera & view
  camera: {
    longitude: number;
    latitude: number;
    zoom: number;
    pitch: number;
    bearing: number;
  };
  is3D: boolean;
  basemapStyle: "dark" | "light" | "monochrome";

  // Layer visibility
  layers: {
    arcs: boolean;
    densityHexagons: boolean;
    trajectories: boolean;
    regions: boolean;
    hotspots: boolean;
  };

  // UI Panels
  leftPanelOpen: boolean;
  rightPanelOpen: boolean;
  commandPaletteOpen: boolean;

  // Actions
  setDate: (date: string) => void;
  setDepartureWindow: (window: [number, number]) => void;
  setDayType: (dayType: DayTypeFilter) => void;
  setMetric: (metric: MetricType) => void;
  setResolution: (res: number) => void;
  selectCell: (cell: H3CellActivity | null) => void;
  selectRegion: (region: RegionSummary | null) => void;
  selectFlow: (flow: ODFlow | null) => void;

  togglePlayback: () => void;
  setIsPlaying: (playing: boolean) => void;
  setCurrentTime: (time: number) => void;
  setPlaybackSpeed: (speed: number) => void;
  setTrailLength: (len: number) => void;

  setCamera: (camera: Partial<ExplorationState["camera"]>) => void;
  toggle3D: () => void;
  setBasemapStyle: (style: "dark" | "light" | "monochrome") => void;
  toggleLayer: (layer: keyof ExplorationState["layers"]) => void;
  setLeftPanelOpen: (open: boolean) => void;
  setRightPanelOpen: (open: boolean) => void;
  setCommandPaletteOpen: (open: boolean) => void;

  applyPreset: (presetKey: keyof typeof CAMERA_PRESETS) => void;
  resetFilters: () => void;
}

export const useExplorationStore = create<ExplorationState>((set) => ({
  selectedDate: "2019-12-02",
  departureWindow: [0, 24],
  dayType: "all",
  metric: "origin_count",
  spatialResolution: 7,

  selectedCell: null,
  selectedRegion: null,
  selectedFlow: null,

  isPlaying: false,
  currentTime: 28800, // 08:00 AM (8 * 3600)
  playbackSpeed: 60,
  trailLength: 180,
  loop: true,

  camera: {
    longitude: CAMERA_PRESETS.overview.longitude,
    latitude: CAMERA_PRESETS.overview.latitude,
    zoom: CAMERA_PRESETS.overview.zoom,
    pitch: CAMERA_PRESETS.overview.pitch,
    bearing: CAMERA_PRESETS.overview.bearing,
  },
  is3D: true,
  basemapStyle: "dark",

  layers: {
    arcs: true,
    densityHexagons: true,
    trajectories: true,
    regions: true,
    hotspots: true,
  },

  leftPanelOpen: true,
  rightPanelOpen: false,
  commandPaletteOpen: false,

  setDate: (date) => set({ selectedDate: date }),
  setDepartureWindow: (window) => set({ departureWindow: window }),
  setDayType: (dayType) => set({ dayType }),
  setMetric: (metric) => set({ metric }),
  setResolution: (res) => set({ spatialResolution: res }),
  selectCell: (cell) =>
    set({ selectedCell: cell, rightPanelOpen: cell !== null }),
  selectRegion: (region) =>
    set({ selectedRegion: region, rightPanelOpen: region !== null }),
  selectFlow: (flow) =>
    set({ selectedFlow: flow, rightPanelOpen: flow !== null }),

  togglePlayback: () => set((s) => ({ isPlaying: !s.isPlaying })),
  setIsPlaying: (playing) => set({ isPlaying: playing }),
  setCurrentTime: (time) => set({ currentTime: time }),
  setPlaybackSpeed: (speed) => set({ playbackSpeed: speed }),
  setTrailLength: (len) => set({ trailLength: len }),

  setCamera: (cam) => set((s) => ({ camera: { ...s.camera, ...cam } })),
  toggle3D: () =>
    set((s) => ({
      is3D: !s.is3D,
      camera: {
        ...s.camera,
        pitch: s.is3D ? 0 : 45,
      },
    })),
  setBasemapStyle: (style) => set({ basemapStyle: style }),
  toggleLayer: (layer) =>
    set((s) => ({
      layers: { ...s.layers, [layer]: !s.layers[layer] },
    })),
  setLeftPanelOpen: (open) => set({ leftPanelOpen: open }),
  setRightPanelOpen: (open) => set({ rightPanelOpen: open }),
  setCommandPaletteOpen: (open) => set({ commandPaletteOpen: open }),

  applyPreset: (presetKey) => {
    const preset = CAMERA_PRESETS[presetKey];
    if (preset) {
      set({
        camera: { ...preset },
        is3D: preset.pitch > 0,
      });
    }
  },

  resetFilters: () =>
    set({
      selectedDate: "2019-12-02",
      departureWindow: [0, 24],
      dayType: "all",
      metric: "origin_count",
      spatialResolution: 7,
      selectedCell: null,
      selectedRegion: null,
      selectedFlow: null,
      rightPanelOpen: false,
    }),
}));
