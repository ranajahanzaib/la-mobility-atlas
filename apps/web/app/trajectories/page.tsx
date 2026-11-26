"use client";

import { GeospatialCanvas } from "@/components/map/GeospatialCanvas";
import { AnalyticalInspector } from "@/components/shell/AnalyticalInspector";
import { ExplorationPanel } from "@/components/shell/ExplorationPanel";
import { MapLegend } from "@/components/shell/MapLegend";
import { MapToolbar } from "@/components/shell/MapToolbar";
import { TemporalTimeline } from "@/components/shell/TemporalTimeline";
import {
  usePlaybackChunkQuery,
  usePlaybackManifestQuery,
} from "@/hooks/useMobilityData";
import { useExplorationStore } from "@/stores/useExplorationStore";
import { Activity, Info, Play, Sliders } from "lucide-react";

export default function TrajectoriesPage() {
  const { data: manifest } = usePlaybackManifestQuery();
  const { data: chunk } = usePlaybackChunkQuery("chunk-2019-12-02");
  const { trailLength, setTrailLength } = useExplorationStore();

  const activeTrajs = chunk?.trajectories || [];

  return (
    <div className="relative w-full h-full flex overflow-hidden">
      <ExplorationPanel />

      <div className="relative flex-1 h-full flex flex-col overflow-hidden">
        {/* Floating Top Sampling & Playback Bar */}
        <div className="absolute top-4 left-4 z-10 flex flex-wrap gap-2 pointer-events-auto select-none">
          <div className="surface-glass rounded px-3 py-2 flex items-center space-x-3 shadow-xl">
            <div className="flex items-center space-x-2 border-r border-[#22313f] pr-3">
              <Play className="w-4 h-4 text-[#35d6e8]" />
              <div>
                <span className="text-[10px] text-[#94a5b8] block">
                  Loaded Trajectories
                </span>
                <span className="font-mono text-xs font-semibold text-[#e6edf3]">
                  {activeTrajs.length.toLocaleString()} trips
                </span>
              </div>
            </div>

            <div className="flex items-center space-x-2 border-r border-[#22313f] pr-3">
              <Activity className="w-4 h-4 text-[#da5ff2]" />
              <div>
                <span className="text-[10px] text-[#94a5b8] block">
                  GPS Waypoints
                </span>
                <span className="font-mono text-xs font-semibold text-[#e6edf3]">
                  {chunk?.point_count?.toLocaleString() || "18,500"} points
                </span>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Info className="w-4 h-4 text-[#8878ff]" />
              <div>
                <span className="text-[10px] text-[#94a5b8] block">
                  Sampling Mode
                </span>
                <span className="font-mono text-xs font-semibold text-[#e6edf3]">
                  10% GPU Sample
                </span>
              </div>
            </div>
          </div>

          {/* Trail Length Control */}
          <div className="surface-glass rounded px-3 py-1.5 flex items-center space-x-2 shadow-xl">
            <Sliders className="w-3.5 h-3.5 text-[#35d6e8]" />
            <span className="text-[10px] text-[#94a5b8]">Trail:</span>
            <input
              type="range"
              min="30"
              max="600"
              step="30"
              value={trailLength}
              onChange={(e) => setTrailLength(parseInt(e.target.value))}
              className="w-20 accent-[#35d6e8] h-1.5 bg-[#22313f] rounded cursor-pointer"
            />
            <span className="font-mono text-[10px] text-[#e6edf3]">
              {trailLength}s
            </span>
          </div>
        </div>

        <div className="flex-1 w-full h-full relative">
          <GeospatialCanvas trajectories={activeTrajs} />
          <MapToolbar />
          <MapLegend />
        </div>

        <TemporalTimeline />
      </div>

      <AnalyticalInspector />
    </div>
  );
}
