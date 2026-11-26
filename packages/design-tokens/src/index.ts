/**
 * @la-mobility-atlas/design-tokens
 * Design system tokens, color palettes, and theme definitions
 */

export interface ThemeColors {
  background: string;
  mapBackground: string;
  panelBackground: string;
  elevatedSurface: string;
  border: string;
  primaryText: string;
  secondaryText: string;
  mutedText: string;
  primaryAccent: string;
  secondaryAccent: string;
  flowMagenta: string;
  warmIntensity: string;
  highIntensity: string;
}

export const DARK_THEME: ThemeColors = {
  background: "#080D14",
  mapBackground: "#0B1420",
  panelBackground: "#101923",
  elevatedSurface: "#15212D",
  border: "#22313F",
  primaryText: "#E6EDF3",
  secondaryText: "#94A5B8",
  mutedText: "#607387",
  primaryAccent: "#35D6E8",
  secondaryAccent: "#8878FF",
  flowMagenta: "#DA5FF2",
  warmIntensity: "#FFC46B",
  highIntensity: "#F45B78",
};

export const LIGHT_THEME: ThemeColors = {
  background: "#F8FAFC",
  mapBackground: "#EEF2F6",
  panelBackground: "#FFFFFF",
  elevatedSurface: "#F1F5F9",
  border: "#CBD5E1",
  primaryText: "#0F172A",
  secondaryText: "#334155",
  mutedText: "#64748B",
  primaryAccent: "#0284C7",
  secondaryAccent: "#6366F1",
  flowMagenta: "#C026D3",
  warmIntensity: "#D97706",
  highIntensity: "#E11D48",
};

export const PALETTES = {
  // Origin-destination flow arcs: Cyan to violet to magenta
  odFlows: {
    origin: "#35D6E8", // Cyan
    destination: "#8878FF", // Violet
    highVolume: "#DA5FF2", // Flow Magenta
    stops: ["#35D6E8", "#8878FF", "#DA5FF2"],
  },

  // Trip density: Deep navy -> Blue -> Cyan -> Pale yellow
  tripDensity: {
    stops: ["#0B1420", "#1E40AF", "#35D6E8", "#FEF08A"],
    rgbaStops: [
      [11, 20, 32, 200],
      [30, 64, 175, 220],
      [53, 214, 232, 240],
      [254, 240, 138, 255],
    ] as [number, number, number, number][],
  },

  // Movement intensity: Dark purple -> Violet -> Magenta -> Orange -> Pale yellow
  movementIntensity: {
    stops: ["#2E1065", "#7C3AED", "#DA5FF2", "#F97316", "#FEF08A"],
    rgbaStops: [
      [46, 16, 101, 180],
      [124, 58, 237, 210],
      [218, 95, 242, 230],
      [249, 115, 22, 240],
      [254, 240, 138, 255],
    ] as [number, number, number, number][],
  },

  // Weekday vs Weekend: Weekday = Cyan, Weekend = Amber
  dayType: {
    weekday: "#35D6E8",
    weekend: "#FFC46B",
    weekdayRgb: [53, 214, 232] as [number, number, number],
    weekendRgb: [255, 196, 107] as [number, number, number],
  },

  // Signed differences (diverging palette centered at zero)
  diverging: {
    negative: "#3B82F6", // Blue for negative change
    neutral: "#607387", // Neutral gray
    positive: "#F45B78", // Red/Coral for positive change
    stops: ["#3B82F6", "#607387", "#F45B78"],
  },
};

export const TYPOGRAPHY = {
  fontSans:
    'Inter, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  fontMono: '"JetBrains Mono", "Fira Code", monospace',
};

export const CAMERA_PRESETS = {
  overview: {
    longitude: -118.32,
    latitude: 34.02,
    zoom: 10.5,
    pitch: 45,
    bearing: -15,
  },
  downtown: {
    longitude: -118.25,
    latitude: 34.05,
    zoom: 13.2,
    pitch: 52,
    bearing: 25,
  },
  hollywood: {
    longitude: -118.33,
    latitude: 34.1,
    zoom: 13.0,
    pitch: 40,
    bearing: 0,
  },
  westside: {
    longitude: -118.45,
    latitude: 34.03,
    zoom: 12.5,
    pitch: 48,
    bearing: -20,
  },
  lax: {
    longitude: -118.41,
    latitude: 33.94,
    zoom: 12.8,
    pitch: 45,
    bearing: 30,
  },
  valley: {
    longitude: -118.48,
    latitude: 34.2,
    zoom: 11.5,
    pitch: 35,
    bearing: 10,
  },
};
