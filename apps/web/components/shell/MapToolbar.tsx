"use client";

import { useExplorationStore } from "@/stores/useExplorationStore";
import { Box, Compass, Maximize2, Minus, Moon, Plus, Sun } from "lucide-react";

export function MapToolbar() {
  const {
    camera,
    is3D,
    basemapStyle,
    setCamera,
    toggle3D,
    setBasemapStyle,
    applyPreset,
  } = useExplorationStore();

  const handleZoomIn = () => {
    setCamera({ zoom: Math.min(18, camera.zoom + 0.75) });
  };

  const handleZoomOut = () => {
    setCamera({ zoom: Math.max(8, camera.zoom - 0.75) });
  };

  const handleResetBearing = () => {
    setCamera({ bearing: 0, pitch: is3D ? 45 : 0 });
  };

  const handleToggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen().catch(() => {});
    }
  };

  return (
    <div className="absolute right-4 top-4 flex flex-col space-y-1.5 z-10 select-none">
      {/* Zoom controls */}
      <div className="bg-[#101923]/90 backdrop-blur-md border border-[#22313f] rounded flex flex-col overflow-hidden shadow-lg">
        <button
          onClick={handleZoomIn}
          className="p-2 text-[#94a5b8] hover:text-[#e6edf3] hover:bg-[#15212d] transition-colors"
          title="Zoom in"
        >
          <Plus className="w-4 h-4" />
        </button>
        <div className="h-px bg-[#22313f]" />
        <button
          onClick={handleZoomOut}
          className="p-2 text-[#94a5b8] hover:text-[#e6edf3] hover:bg-[#15212d] transition-colors"
          title="Zoom out"
        >
          <Minus className="w-4 h-4" />
        </button>
      </div>

      {/* 2D / 3D Mode Toggle */}
      <button
        onClick={toggle3D}
        className={`p-2 rounded bg-[#101923]/90 backdrop-blur-md border border-[#22313f] shadow-lg transition-colors flex items-center justify-center ${
          is3D
            ? "text-[#35d6e8] border-[#35d6e8]/40"
            : "text-[#94a5b8] hover:text-[#e6edf3]"
        }`}
        title={is3D ? "Switch to flat 2D view" : "Switch to tilted 3D view"}
      >
        <Box className="w-4 h-4" />
      </button>

      {/* Reset Bearing & Pitch */}
      <button
        onClick={handleResetBearing}
        className="p-2 rounded bg-[#101923]/90 backdrop-blur-md border border-[#22313f] shadow-lg text-[#94a5b8] hover:text-[#e6edf3] transition-colors flex items-center justify-center"
        title="Reset bearing to North"
      >
        <Compass
          className="w-4 h-4 transition-transform"
          style={{ transform: `rotate(${-camera.bearing}deg)` }}
        />
      </button>

      {/* Basemap Switcher */}
      <button
        onClick={() =>
          setBasemapStyle(basemapStyle === "dark" ? "light" : "dark")
        }
        className="p-2 rounded bg-[#101923]/90 backdrop-blur-md border border-[#22313f] shadow-lg text-[#94a5b8] hover:text-[#e6edf3] transition-colors flex items-center justify-center"
        title="Toggle basemap style"
      >
        {basemapStyle === "dark" ? (
          <Moon className="w-4 h-4 text-[#8878ff]" />
        ) : (
          <Sun className="w-4 h-4 text-[#ffc46b]" />
        )}
      </button>

      {/* Fullscreen */}
      <button
        onClick={handleToggleFullscreen}
        className="p-2 rounded bg-[#101923]/90 backdrop-blur-md border border-[#22313f] shadow-lg text-[#94a5b8] hover:text-[#e6edf3] transition-colors flex items-center justify-center"
        title="Toggle fullscreen"
      >
        <Maximize2 className="w-4 h-4" />
      </button>
    </div>
  );
}
