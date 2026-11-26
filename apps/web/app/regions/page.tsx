"use client";

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
import { MapPin } from "lucide-react";

export default function RegionsPage() {
  const { data: regions = [] } = useRegionsQuery();
  const { data: cells = [] } = useCellsQuery();
  const { data: flows = [] } = useFlowsQuery();
  const { selectedRegion, selectRegion, setCamera } = useExplorationStore();

  const handleSelectRegion = (reg: any) => {
    selectRegion(reg);
    setCamera({
      longitude: reg.center[0],
      latitude: reg.center[1],
      zoom: 13.0,
      pitch: 45,
    });
  };

  return (
    <div className="relative w-full h-full flex overflow-hidden">
      <ExplorationPanel />

      <div className="relative flex-1 h-full flex flex-col overflow-hidden">
        {/* Region Selector Pills */}
        <div className="absolute top-4 left-4 z-10 flex flex-wrap gap-1.5 max-w-2xl pointer-events-auto select-none">
          {regions.map((reg) => {
            const isSelected = selectedRegion?.region_id === reg.region_id;
            return (
              <button
                key={reg.region_id}
                onClick={() => handleSelectRegion(reg)}
                className={`px-2.5 py-1 rounded-full text-xs font-medium border shadow-lg transition-colors flex items-center space-x-1.5 ${
                  isSelected
                    ? "bg-[#15212d] border-[#35d6e8] text-[#35d6e8]"
                    : "bg-[#101923]/90 border-[#22313f] text-[#94a5b8] hover:text-[#e6edf3]"
                }`}
              >
                <MapPin className="w-3 h-3 text-[#35d6e8]" />
                <span>{reg.name}</span>
              </button>
            );
          })}
        </div>

        <div className="flex-1 w-full h-full relative">
          <GeospatialCanvas cells={cells} regions={regions} flows={flows} />
          <MapToolbar />
          <MapLegend />
        </div>
      </div>

      <AnalyticalInspector />
    </div>
  );
}
