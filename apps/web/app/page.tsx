"use client";

import { GeospatialCanvas } from "@/components/map/GeospatialCanvas";
import { AnalyticalInspector } from "@/components/shell/AnalyticalInspector";
import { ExplorationPanel } from "@/components/shell/ExplorationPanel";
import { MapLegend } from "@/components/shell/MapLegend";
import { MapToolbar } from "@/components/shell/MapToolbar";
import { TemporalTimeline } from "@/components/shell/TemporalTimeline";
import {
  useCellsQuery,
  useFlowsQuery,
  useOverviewQuery,
  usePlaybackChunkQuery,
  useRegionsQuery,
} from "@/hooks/useMobilityData";
import { Car, Clock, Compass, Navigation } from "lucide-react";

export default function OverviewPage() {
  const { data: overview } = useOverviewQuery();
  const { data: cells = [] } = useCellsQuery();
  const { data: flows = [] } = useFlowsQuery();
  const { data: regions = [] } = useRegionsQuery();
  const { data: playbackChunk } = usePlaybackChunkQuery("chunk-2019-12-02");

  return (
    <div className="relative w-full h-full flex overflow-hidden">
      {/* Exploration Controls Left Drawer */}
      <ExplorationPanel />

      {/* Main Map Visualization Canvas */}
      <div className="relative flex-1 h-full flex flex-col overflow-hidden">
        {/* Floating Top Summary Bar */}
        <div className="absolute top-4 left-4 z-10 flex flex-wrap gap-2 pointer-events-auto select-none">
          <div className="surface-glass rounded px-3 py-2 flex items-center space-x-3 shadow-xl">
            <div className="flex items-center space-x-2 border-r border-[#22313f] pr-3">
              <Car className="w-4 h-4 text-[#35d6e8]" />
              <div>
                <span className="text-[10px] text-[#94a5b8] block">
                  Synthetic Trips
                </span>
                <span className="font-mono text-xs font-semibold text-[#e6edf3]">
                  {overview?.total_trajectories?.toLocaleString() || "2,500"}
                </span>
              </div>
            </div>

            <div className="flex items-center space-x-2 border-r border-[#22313f] pr-3">
              <Navigation className="w-4 h-4 text-[#da5ff2]" />
              <div>
                <span className="text-[10px] text-[#94a5b8] block">
                  GPS Observations
                </span>
                <span className="font-mono text-xs font-semibold text-[#e6edf3]">
                  {overview?.total_observations?.toLocaleString() || "76,144"}
                </span>
              </div>
            </div>

            <div className="flex items-center space-x-2 border-r border-[#22313f] pr-3">
              <Clock className="w-4 h-4 text-[#ffc46b]" />
              <div>
                <span className="text-[10px] text-[#94a5b8] block">
                  Median Travel Time
                </span>
                <span className="font-mono text-xs font-semibold text-[#e6edf3]">
                  {overview?.median_duration_seconds
                    ? `${(overview.median_duration_seconds / 60).toFixed(1)} min`
                    : "21.5 min"}
                </span>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Compass className="w-4 h-4 text-[#8878ff]" />
              <div>
                <span className="text-[10px] text-[#94a5b8] block">
                  Study Period
                </span>
                <span className="font-mono text-xs font-semibold text-[#e6edf3]">
                  Dec 1–14, 2019
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Map Canvas */}
        <div className="flex-1 w-full h-full relative">
          <GeospatialCanvas
            flows={flows}
            cells={cells}
            regions={regions}
            trajectories={playbackChunk?.trajectories || []}
          />
          <MapToolbar />
          <MapLegend />
        </div>

        {/* Bottom Interactive Playback Timeline */}
        <TemporalTimeline />
      </div>

      {/* Analytical Contextual Inspector */}
      <AnalyticalInspector />
    </div>
  );
}
