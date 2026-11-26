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
  usePlaybackChunkQuery,
  useRegionsQuery,
} from "@/hooks/useMobilityData";

export default function ExplorePage() {
  const { data: cells = [] } = useCellsQuery();
  const { data: flows = [] } = useFlowsQuery();
  const { data: regions = [] } = useRegionsQuery();
  const { data: playbackChunk } = usePlaybackChunkQuery("chunk-2019-12-02");

  return (
    <div className="relative w-full h-full flex overflow-hidden">
      <ExplorationPanel />

      <div className="relative flex-1 h-full flex flex-col overflow-hidden">
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
        <TemporalTimeline />
      </div>

      <AnalyticalInspector />
    </div>
  );
}
