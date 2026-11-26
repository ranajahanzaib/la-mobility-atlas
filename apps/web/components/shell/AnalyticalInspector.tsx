"use client";

import { useExplorationStore } from "@/stores/useExplorationStore";
import {
  Activity,
  ArrowDownLeft,
  ArrowUpRight,
  Clock,
  MapPin,
  X,
} from "lucide-react";

export function AnalyticalInspector() {
  const {
    rightPanelOpen,
    selectedCell,
    selectedRegion,
    selectedFlow,
    setRightPanelOpen,
    selectCell,
    selectRegion,
    selectFlow,
  } = useExplorationStore();

  if (!rightPanelOpen || (!selectedCell && !selectedRegion && !selectedFlow)) {
    return null;
  }

  const handleClose = () => {
    setRightPanelOpen(false);
    selectCell(null);
    selectRegion(null);
    selectFlow(null);
  };

  return (
    <aside className="w-80 h-[calc(100vh-3rem)] bg-[#101923]/95 backdrop-blur-md border-l border-[#22313f] flex flex-col z-20 select-none overflow-y-auto">
      {/* Header */}
      <div className="p-3 border-b border-[#22313f] flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Activity className="w-4 h-4 text-[#35d6e8]" />
          <span className="text-xs font-semibold text-[#e6edf3] tracking-wide">
            Analytical Inspector
          </span>
        </div>
        <button
          onClick={handleClose}
          className="p-1 rounded text-[#94a5b8] hover:text-[#e6edf3] hover:bg-[#15212d] transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="p-3 space-y-4 text-xs">
        {/* Selected H3 Cell Inspector */}
        {selectedCell && (
          <div className="space-y-3">
            <div>
              <span className="text-[10px] font-mono text-[#35d6e8] uppercase tracking-wider block">
                H3 Hexagon Cell
              </span>
              <h3 className="text-sm font-mono font-semibold text-[#e6edf3]">
                {selectedCell.cell_id}
              </h3>
              <p className="text-[#94a5b8] text-[11px] mt-0.5">
                Center: {selectedCell.center_lat.toFixed(4)}°N,{" "}
                {selectedCell.center_lng.toFixed(4)}°W · Area:{" "}
                {selectedCell.area_km2.toFixed(1)} km²
              </p>
            </div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-2 gap-2">
              <div className="p-2.5 rounded bg-[#15212d] border border-[#22313f]">
                <div className="flex items-center space-x-1.5 text-[#94a5b8] text-[10px]">
                  <ArrowUpRight className="w-3 h-3 text-[#35d6e8]" />
                  <span>Trip Origins</span>
                </div>
                <div className="text-base font-semibold text-[#e6edf3] font-mono mt-1">
                  {selectedCell.origin_count.toLocaleString()}
                </div>
              </div>

              <div className="p-2.5 rounded bg-[#15212d] border border-[#22313f]">
                <div className="flex items-center space-x-1.5 text-[#94a5b8] text-[10px]">
                  <ArrowDownLeft className="w-3 h-3 text-[#da5ff2]" />
                  <span>Destinations</span>
                </div>
                <div className="text-base font-semibold text-[#e6edf3] font-mono mt-1">
                  {selectedCell.destination_count.toLocaleString()}
                </div>
              </div>

              <div className="p-2.5 rounded bg-[#15212d] border border-[#22313f]">
                <div className="flex items-center space-x-1.5 text-[#94a5b8] text-[10px]">
                  <Clock className="w-3 h-3 text-[#ffc46b]" />
                  <span>Median Duration</span>
                </div>
                <div className="text-base font-semibold text-[#e6edf3] font-mono mt-1">
                  {(selectedCell.median_duration / 60).toFixed(1)} min
                </div>
              </div>

              <div className="p-2.5 rounded bg-[#15212d] border border-[#22313f]">
                <div className="flex items-center space-x-1.5 text-[#94a5b8] text-[10px]">
                  <MapPin className="w-3 h-3 text-[#8878ff]" />
                  <span>Median Distance</span>
                </div>
                <div className="text-base font-semibold text-[#e6edf3] font-mono mt-1">
                  {(selectedCell.median_distance / 1000).toFixed(1)} km
                </div>
              </div>
            </div>

            <div className="p-2.5 rounded bg-[#0b1420] border border-[#22313f] space-y-1.5">
              <div className="flex justify-between text-[11px]">
                <span className="text-[#94a5b8]">
                  Distinct Synthetic Vehicles:
                </span>
                <span className="font-mono text-[#e6edf3] font-medium">
                  {selectedCell.distinct_trajectories.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between text-[11px]">
                <span className="text-[#94a5b8]">
                  Within-Cell Internal Trips:
                </span>
                <span className="font-mono text-[#e6edf3] font-medium">
                  {selectedCell.within_cell_trips.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between text-[11px]">
                <span className="text-[#94a5b8]">GPS Observation Samples:</span>
                <span className="font-mono text-[#e6edf3] font-medium">
                  {selectedCell.observation_count.toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Selected OD Flow Inspector */}
        {selectedFlow && (
          <div className="space-y-3">
            <div>
              <span className="text-[10px] font-mono text-[#da5ff2] uppercase tracking-wider block">
                Selected OD Flow Corridor
              </span>
              <h3 className="text-sm font-semibold text-[#e6edf3] mt-0.5">
                {selectedFlow.trip_count.toLocaleString()} Generated Trips
              </h3>
              <p className="text-[#94a5b8] text-[11px]">
                Share of all metropolitan flows:{" "}
                {(selectedFlow.share * 100).toFixed(2)}%
              </p>
            </div>

            <div className="space-y-2 p-2.5 rounded bg-[#15212d] border border-[#22313f]">
              <div className="flex items-start space-x-2">
                <span className="w-2 h-2 rounded-full bg-[#35d6e8] mt-1 shrink-0" />
                <div>
                  <span className="text-[10px] text-[#94a5b8] block">
                    Origin Cell
                  </span>
                  <span className="font-mono text-xs text-[#e6edf3]">
                    {selectedFlow.origin_cell}
                  </span>
                </div>
              </div>
              <div className="flex items-start space-x-2">
                <span className="w-2 h-2 rounded-full bg-[#da5ff2] mt-1 shrink-0" />
                <div>
                  <span className="text-[10px] text-[#94a5b8] block">
                    Destination Cell
                  </span>
                  <span className="font-mono text-xs text-[#e6edf3]">
                    {selectedFlow.destination_cell}
                  </span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div className="p-2.5 rounded bg-[#15212d] border border-[#22313f]">
                <span className="text-[10px] text-[#94a5b8] block">
                  Median Travel Time
                </span>
                <span className="text-sm font-mono text-[#e6edf3] font-semibold mt-0.5 block">
                  {(selectedFlow.median_duration / 60).toFixed(1)} min
                </span>
              </div>
              <div className="p-2.5 rounded bg-[#15212d] border border-[#22313f]">
                <span className="text-[10px] text-[#94a5b8] block">
                  Median Distance
                </span>
                <span className="text-sm font-mono text-[#e6edf3] font-semibold mt-0.5 block">
                  {(selectedFlow.median_distance / 1000).toFixed(1)} km
                </span>
              </div>
            </div>

            <div className="p-2.5 rounded bg-[#0b1420] border border-[#22313f]">
              <span className="text-[10px] text-[#94a5b8] block mb-1">
                Weekday vs Weekend Share
              </span>
              <div className="w-full h-2 rounded-full bg-[#22313f] flex overflow-hidden">
                <div
                  className="bg-[#35d6e8] h-full"
                  style={{ width: `${selectedFlow.weekday_share * 100}%` }}
                />
                <div
                  className="bg-[#ffc46b] h-full"
                  style={{ width: `${selectedFlow.weekend_share * 100}%` }}
                />
              </div>
              <div className="flex justify-between text-[10px] text-[#94a5b8] mt-1 font-mono">
                <span>
                  Weekday: {(selectedFlow.weekday_share * 100).toFixed(0)}%
                </span>
                <span>
                  Weekend: {(selectedFlow.weekend_share * 100).toFixed(0)}%
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Selected Region Inspector */}
        {selectedRegion && (
          <div className="space-y-3">
            <div>
              <span className="text-[10px] font-mono text-[#8878ff] uppercase tracking-wider block">
                Geographic Exploration Area
              </span>
              <h3 className="text-sm font-semibold text-[#e6edf3] mt-0.5">
                {selectedRegion.name}
              </h3>
              <p className="text-[#94a5b8] text-[11px] mt-0.5">
                {selectedRegion.description}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div className="p-2.5 rounded bg-[#15212d] border border-[#22313f]">
                <span className="text-[10px] text-[#94a5b8] block">
                  Total Origins
                </span>
                <span className="text-base font-mono text-[#e6edf3] font-semibold mt-0.5 block">
                  {selectedRegion.total_origins.toLocaleString()}
                </span>
              </div>
              <div className="p-2.5 rounded bg-[#15212d] border border-[#22313f]">
                <span className="text-[10px] text-[#94a5b8] block">
                  Total Destinations
                </span>
                <span className="text-base font-mono text-[#e6edf3] font-semibold mt-0.5 block">
                  {selectedRegion.total_destinations.toLocaleString()}
                </span>
              </div>
            </div>

            {selectedRegion.top_connected_regions &&
              selectedRegion.top_connected_regions.length > 0 && (
                <div>
                  <span className="text-[11px] font-semibold text-[#94a5b8] uppercase tracking-wider block mb-1.5">
                    Top Connected Regions
                  </span>
                  <div className="space-y-1">
                    {selectedRegion.top_connected_regions.map((conn) => (
                      <div
                        key={conn.region_id}
                        className="flex items-center justify-between p-1.5 rounded bg-[#15212d] border border-[#22313f]"
                      >
                        <span className="text-[#e6edf3]">{conn.name}</span>
                        <span className="font-mono text-[#35d6e8]">
                          {conn.trip_count} trips
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
          </div>
        )}
      </div>
    </aside>
  );
}
