"use client";

import { CircularFlowDiagram } from "@/components/charts/CircularFlowDiagram";
import { ODMatrix } from "@/components/charts/ODMatrix";
import { GeospatialCanvas } from "@/components/map/GeospatialCanvas";
import { AnalyticalInspector } from "@/components/shell/AnalyticalInspector";
import { ExplorationPanel } from "@/components/shell/ExplorationPanel";
import { MapLegend } from "@/components/shell/MapLegend";
import { MapToolbar } from "@/components/shell/MapToolbar";
import {
  useCellsQuery,
  useFlowsQuery,
  useRegionsQuery,
} from "@/hooks/useMobilityData";
import { useExplorationStore } from "@/stores/useExplorationStore";
import { Disc, Grid, Layers } from "lucide-react";
import { useState } from "react";

export default function FlowsPage() {
  const [tab, setTab] = useState<"map" | "matrix" | "circular">("map");
  const { data: flows = [] } = useFlowsQuery();
  const { data: cells = [] } = useCellsQuery();
  const { data: regions = [] } = useRegionsQuery();
  const { selectFlow } = useExplorationStore();

  return (
    <div className="relative w-full h-full flex overflow-hidden">
      <ExplorationPanel />

      <div className="relative flex-1 h-full flex flex-col overflow-hidden">
        {/* Mode Switcher Header */}
        <div className="absolute top-4 left-4 z-10 flex space-x-2">
          <div className="bg-[#101923]/90 backdrop-blur-md border border-[#22313f] rounded p-1 flex space-x-1 shadow-xl">
            <button
              onClick={() => setTab("map")}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded text-xs font-medium transition-colors ${
                tab === "map"
                  ? "bg-[#15212d] text-[#35d6e8]"
                  : "text-[#94a5b8] hover:text-[#e6edf3]"
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>3D Flow Map</span>
            </button>
            <button
              onClick={() => setTab("circular")}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded text-xs font-medium transition-colors ${
                tab === "circular"
                  ? "bg-[#15212d] text-[#35d6e8]"
                  : "text-[#94a5b8] hover:text-[#e6edf3]"
              }`}
            >
              <Disc className="w-3.5 h-3.5" />
              <span>Circular Chord</span>
            </button>
            <button
              onClick={() => setTab("matrix")}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded text-xs font-medium transition-colors ${
                tab === "matrix"
                  ? "bg-[#15212d] text-[#35d6e8]"
                  : "text-[#94a5b8] hover:text-[#e6edf3]"
              }`}
            >
              <Grid className="w-3.5 h-3.5" />
              <span>OD Matrix</span>
            </button>
          </div>
        </div>

        {/* Content depending on tab */}
        {tab === "map" ? (
          <div className="flex-1 w-full h-full relative">
            <GeospatialCanvas flows={flows} cells={cells} regions={regions} />
            <MapToolbar />
            <MapLegend />
          </div>
        ) : tab === "circular" ? (
          <div className="flex-1 w-full h-full flex flex-col items-center justify-center p-6 bg-[#080d14] overflow-auto">
            <div className="max-w-2xl w-full surface-glass rounded-lg p-6 shadow-2xl flex flex-col items-center">
              <div className="mb-4 text-center">
                <h2 className="text-sm font-semibold text-[#e6edf3]">
                  Regional Mobility Flow Network
                </h2>
                <p className="text-xs text-[#94a5b8] mt-1">
                  Abstract chord network showing origin-destination connectivity
                  between major Los Angeles districts.
                </p>
              </div>
              <CircularFlowDiagram regions={regions} flows={flows} size={420} />
            </div>
          </div>
        ) : (
          <div className="flex-1 w-full h-full flex flex-col items-center justify-center p-6 bg-[#080d14] overflow-auto">
            <div className="max-w-4xl w-full surface-glass rounded-lg p-6 shadow-2xl">
              <div className="mb-4">
                <h2 className="text-sm font-semibold text-[#e6edf3]">
                  Origin–Destination Trip Volume Matrix
                </h2>
                <p className="text-xs text-[#94a5b8] mt-1">
                  Synthetic vehicle movements between major metropolitan
                  activity centers. Click cells to inspect flows.
                </p>
              </div>
              <ODMatrix regions={regions} />
            </div>
          </div>
        )}
      </div>

      <AnalyticalInspector />
    </div>
  );
}
