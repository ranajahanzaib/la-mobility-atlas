"use client";

import { useExplorationStore } from "@/stores/useExplorationStore";
import { PALETTES } from "@la-mobility-atlas/design-tokens";

export function MapLegend() {
  const { metric, layers } = useExplorationStore();

  return (
    <div className="absolute left-4 bottom-4 bg-[#101923]/90 backdrop-blur-md border border-[#22313f] rounded p-2.5 shadow-xl z-10 text-xs select-none max-w-xs space-y-2">
      {/* Density gradient legend */}
      {layers.densityHexagons && (
        <div>
          <div className="flex justify-between items-center text-[10px] text-[#94a5b8] mb-1 font-medium">
            <span>Spatial Activity Density</span>
            <span className="font-mono text-[#607387]">sqrt-scale</span>
          </div>
          <div
            className="w-44 h-2.5 rounded-sm"
            style={{
              background: `linear-gradient(to right, ${PALETTES.tripDensity.stops.join(", ")})`,
            }}
          />
          <div className="flex justify-between text-[9px] font-mono text-[#94a5b8] mt-0.5">
            <span>Low</span>
            <span>Moderate</span>
            <span>Peak Hub</span>
          </div>
        </div>
      )}

      {/* OD Flow Arcs Legend */}
      {layers.arcs && (
        <div className="pt-1.5 border-t border-[#22313f]">
          <div className="text-[10px] text-[#94a5b8] mb-1 font-medium">
            Origin–Destination Flow
          </div>
          <div className="flex items-center space-x-2">
            <div className="flex items-center space-x-1">
              <span className="w-2 h-2 rounded-full bg-[#35d6e8]" />
              <span className="text-[10px] text-[#e6edf3]">Origin</span>
            </div>
            <span className="text-[#607387] text-[10px]">→</span>
            <div className="flex items-center space-x-1">
              <span className="w-2 h-2 rounded-full bg-[#da5ff2]" />
              <span className="text-[10px] text-[#e6edf3]">Destination</span>
            </div>
          </div>
        </div>
      )}

      {/* Playback trails */}
      {layers.trajectories && (
        <div className="pt-1.5 border-t border-[#22313f] flex items-center justify-between text-[10px]">
          <span className="text-[#94a5b8]">Vehicle Movement Trails</span>
          <div className="flex items-center space-x-1.5">
            <span className="w-2 h-2 rounded-full bg-[#35d6e8]" />
            <span className="text-[#e6edf3] font-mono">Weekday</span>
            <span className="w-2 h-2 rounded-full bg-[#ffc46b] ml-1" />
            <span className="text-[#e6edf3] font-mono">Weekend</span>
          </div>
        </div>
      )}
    </div>
  );
}
