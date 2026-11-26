"use client";

import { GeospatialCanvas } from "@/components/map/GeospatialCanvas";
import { AnalyticalInspector } from "@/components/shell/AnalyticalInspector";
import { ExplorationPanel } from "@/components/shell/ExplorationPanel";
import { MapLegend } from "@/components/shell/MapLegend";
import { MapToolbar } from "@/components/shell/MapToolbar";
import { useCellsQuery, useRegionsQuery } from "@/hooks/useMobilityData";
import { useExplorationStore } from "@/stores/useExplorationStore";
import { Box, Trophy } from "lucide-react";

export default function DensityPage() {
  const { data: cells = [] } = useCellsQuery();
  const { data: regions = [] } = useRegionsQuery();
  const { metric, setMetric, is3D, toggle3D, selectCell } =
    useExplorationStore();

  const sortedCells = [...cells].sort(
    (a, b) => ((b[metric] as number) || 0) - ((a[metric] as number) || 0),
  );

  return (
    <div className="relative w-full h-full flex overflow-hidden">
      <ExplorationPanel />

      <div className="relative flex-1 h-full flex flex-col overflow-hidden">
        {/* Metric Selector and Hotspots Quick Overlay */}
        <div className="absolute top-4 left-4 z-10 flex flex-wrap gap-2 pointer-events-auto select-none">
          <div className="bg-[#101923]/90 backdrop-blur-md border border-[#22313f] rounded p-1 flex space-x-1 shadow-xl">
            {[
              { id: "origin_count", label: "Origin Density" },
              { id: "destination_count", label: "Destination Density" },
              { id: "distinct_trajectories", label: "Distinct Vehicles" },
              { id: "observation_count", label: "GPS Points" },
            ].map((m) => (
              <button
                key={m.id}
                onClick={() => setMetric(m.id as any)}
                className={`px-3 py-1.5 rounded text-xs font-medium transition-colors ${
                  metric === m.id
                    ? "bg-[#15212d] text-[#35d6e8]"
                    : "text-[#94a5b8] hover:text-[#e6edf3]"
                }`}
              >
                {m.label}
              </button>
            ))}
          </div>

          <button
            onClick={toggle3D}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded text-xs font-medium border shadow-xl transition-colors ${
              is3D
                ? "bg-[#15212d] border-[#35d6e8]/40 text-[#35d6e8]"
                : "bg-[#101923]/90 border-[#22313f] text-[#94a5b8]"
            }`}
          >
            <Box className="w-3.5 h-3.5" />
            <span>{is3D ? "3D Extruded Columns" : "Flat Choropleth"}</span>
          </button>
        </div>

        {/* Top Activity Hotspot Drawer */}
        <div className="absolute bottom-4 right-4 z-10 hidden md:block select-none">
          <div className="surface-glass rounded p-3 w-64 shadow-xl">
            <div className="flex items-center space-x-1.5 text-xs font-semibold text-[#e6edf3] mb-2">
              <Trophy className="w-3.5 h-3.5 text-[#ffc46b]" />
              <span>Top Activity Cells</span>
            </div>
            <div className="space-y-1.5">
              {sortedCells.slice(0, 5).map((c, i) => (
                <button
                  key={c.cell_id}
                  onClick={() => selectCell(c)}
                  className="w-full flex items-center justify-between p-1.5 rounded bg-[#15212d] hover:bg-[#22313f] text-left transition-colors"
                >
                  <div className="flex items-center space-x-2">
                    <span className="font-mono text-[10px] text-[#607387]">
                      #{i + 1}
                    </span>
                    <span className="font-mono text-xs text-[#e6edf3]">
                      {c.cell_id.slice(0, 8)}...
                    </span>
                  </div>
                  <span className="font-mono text-xs text-[#35d6e8] font-semibold">
                    {Number(c[metric]).toLocaleString()}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="flex-1 w-full h-full relative">
          <GeospatialCanvas cells={cells} regions={regions} />
          <MapToolbar />
          <MapLegend />
        </div>
      </div>

      <AnalyticalInspector />
    </div>
  );
}
