import type { StyleSpecification } from "maplibre-gl";

export const DARK_BASEMAP_STYLE: StyleSpecification = {
  version: 8,
  sources: {
    esri_dark: {
      type: "raster",
      tiles: [
        "https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}",
      ],
      tileSize: 256,
      attribution:
        '&copy; <a href="https://www.esri.com/">Esri</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    },
  },
  layers: [
    {
      id: "esri_dark_layer",
      type: "raster",
      source: "esri_dark",
      minzoom: 0,
      maxzoom: 16,
    },
  ],
};

export const LIGHT_BASEMAP_STYLE: StyleSpecification = {
  version: 8,
  sources: {
    esri_light: {
      type: "raster",
      tiles: [
        "https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}",
      ],
      tileSize: 256,
      attribution:
        '&copy; <a href="https://www.esri.com/">Esri</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    },
  },
  layers: [
    {
      id: "esri_light_layer",
      type: "raster",
      source: "esri_light",
      minzoom: 0,
      maxzoom: 16,
    },
  ],
};

export const MONOCHROME_BASEMAP_STYLE: StyleSpecification = {
  version: 8,
  sources: {
    esri_mono: {
      type: "raster",
      tiles: [
        "https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}",
      ],
      tileSize: 256,
      attribution:
        '&copy; <a href="https://www.esri.com/">Esri</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    },
  },
  layers: [
    {
      id: "esri_mono_layer",
      type: "raster",
      source: "esri_mono",
      minzoom: 0,
      maxzoom: 16,
    },
  ],
};
