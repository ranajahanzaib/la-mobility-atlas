"use client";

import {
  DayTypeFilter,
  MetricType,
  useExplorationStore,
} from "@/stores/useExplorationStore";
import {
  Calendar,
  Coffee,
  Layers,
  Navigation,
  RotateCcw,
  Sliders,
  Sun,
  Sunset,
} from "lucide-react";

export function ExplorationPanel() {
  const {
    leftPanelOpen,
    metric,
    dayType,
    departureWindow,
    spatialResolution,
    layers,
    setMetric,
    setDayType,
    setDepartureWindow,
    setResolution,
    toggleLayer,
    applyPreset,
    resetFilters,
  } = useExplorationStore();

  if (!leftPanelOpen) return null;

  return (
    <aside className="w-72 h-[calc(100vh-3rem)] bg-[#101923]/95 backdrop-blur-md border-r border-[#22313f] flex flex-col z-20 select-none overflow-y-auto">
      {/* Panel Header */}
      <div className="p-3 border-b border-[#22313f] flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Sliders className="w-4 h-4 text-[#35d6e8]" />
          <span className="text-xs font-semibold text-[#e6edf3] tracking-wide">
            Exploration Controls
          </span>
        </div>
        <button
          onClick={resetFilters}
          className="p-1 rounded text-[#94a5b8] hover:text-[#e6edf3] hover:bg-[#15212d] transition-colors"
          title="Reset all filters"
        >
          <RotateCcw className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="p-3 space-y-4 text-xs">
        {/* Guided Presets */}
        <div>
          <label className="text-[11px] font-semibold text-[#94a5b8] uppercase tracking-wider block mb-2">
            Exploration Presets
          </label>
          <div className="grid grid-cols-2 gap-1.5">
            <button
              onClick={() => {
                applyPreset("downtown");
                setDepartureWindow([7, 9]);
                setDayType("weekday");
              }}
              className="flex items-center space-x-1.5 p-2 rounded bg-[#15212d] border border-[#22313f] hover:border-[#35d6e8]/50 text-[#e6edf3] text-left transition-colors"
            >
              <Sun className="w-3.5 h-3.5 text-[#ffc46b]" />
              <span className="text-[11px]">Morning Commute</span>
            </button>

            <button
              onClick={() => {
                applyPreset("overview");
                setDepartureWindow([16, 19]);
                setDayType("weekday");
              }}
              className="flex items-center space-x-1.5 p-2 rounded bg-[#15212d] border border-[#22313f] hover:border-[#35d6e8]/50 text-[#e6edf3] text-left transition-colors"
            >
              <Sunset className="w-3.5 h-3.5 text-[#f45b78]" />
              <span className="text-[11px]">Evening Rush</span>
            </button>

            <button
              onClick={() => {
                applyPreset("westside");
                setDayType("weekend");
                setDepartureWindow([11, 16]);
              }}
              className="flex items-center space-x-1.5 p-2 rounded bg-[#15212d] border border-[#22313f] hover:border-[#35d6e8]/50 text-[#e6edf3] text-left transition-colors"
            >
              <Coffee className="w-3.5 h-3.5 text-[#35d6e8]" />
              <span className="text-[11px]">Weekend Leisure</span>
            </button>

            <button
              onClick={() => {
                applyPreset("lax");
                setDepartureWindow([0, 24]);
              }}
              className="flex items-center space-x-1.5 p-2 rounded bg-[#15212d] border border-[#22313f] hover:border-[#35d6e8]/50 text-[#e6edf3] text-left transition-colors"
            >
              <Navigation className="w-3.5 h-3.5 text-[#8878ff]" />
              <span className="text-[11px]">Airport & Hubs</span>
            </button>
          </div>
        </div>

        {/* Metric Selector */}
        <div>
          <label className="text-[11px] font-semibold text-[#94a5b8] uppercase tracking-wider block mb-2">
            Analytical Metric
          </label>
          <div className="grid grid-cols-2 gap-1 bg-[#0b1420] p-1 rounded border border-[#22313f]">
            {[
              { id: "origin_count", label: "Trip Origins" },
              { id: "destination_count", label: "Destinations" },
              { id: "distinct_trajectories", label: "Distinct Trips" },
              { id: "observation_count", label: "GPS Points" },
            ].map((m) => (
              <button
                key={m.id}
                onClick={() => setMetric(m.id as MetricType)}
                className={`py-1 px-2 rounded text-[11px] font-medium transition-colors ${
                  metric === m.id
                    ? "bg-[#15212d] text-[#35d6e8] shadow-sm"
                    : "text-[#94a5b8] hover:text-[#e6edf3]"
                }`}
              >
                {m.label}
              </button>
            ))}
          </div>
        </div>

        {/* Day Type Filter */}
        <div>
          <label className="text-[11px] font-semibold text-[#94a5b8] uppercase tracking-wider block mb-2 flex items-center justify-between">
            <span>Day Classification</span>
            <Calendar className="w-3 h-3 text-[#607387]" />
          </label>
          <div className="grid grid-cols-3 gap-1 bg-[#0b1420] p-1 rounded border border-[#22313f]">
            {[
              { id: "all", label: "All Days" },
              { id: "weekday", label: "Weekday" },
              { id: "weekend", label: "Weekend" },
            ].map((d) => (
              <button
                key={d.id}
                onClick={() => setDayType(d.id as DayTypeFilter)}
                className={`py-1 px-2 rounded text-[11px] font-medium transition-colors ${
                  dayType === d.id
                    ? "bg-[#15212d] text-[#35d6e8]"
                    : "text-[#94a5b8] hover:text-[#e6edf3]"
                }`}
              >
                {d.label}
              </button>
            ))}
          </div>
        </div>

        {/* Departure Window */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-[11px] font-semibold text-[#94a5b8] uppercase tracking-wider">
              Departure Hour
            </label>
            <span className="font-mono text-[11px] text-[#35d6e8]">
              {String(departureWindow[0]).padStart(2, "0")}:00 –{" "}
              {String(departureWindow[1]).padStart(2, "0")}:00
            </span>
          </div>
          <div className="space-y-1">
            <input
              type="range"
              min="0"
              max="24"
              value={departureWindow[1]}
              onChange={(e) =>
                setDepartureWindow([
                  departureWindow[0],
                  parseInt(e.target.value),
                ])
              }
              className="w-full accent-[#35d6e8] h-1.5 bg-[#22313f] rounded cursor-pointer"
            />
          </div>
        </div>

        {/* Spatial Resolution */}
        <div>
          <label className="text-[11px] font-semibold text-[#94a5b8] uppercase tracking-wider block mb-2">
            H3 Spatial Resolution
          </label>
          <div className="grid grid-cols-3 gap-1 bg-[#0b1420] p-1 rounded border border-[#22313f]">
            {[
              { res: 6, label: "Res 6 (~36 km²)" },
              { res: 7, label: "Res 7 (~5.2 km²)" },
              { res: 8, label: "Res 8 (~0.7 km²)" },
            ].map((r) => (
              <button
                key={r.res}
                onClick={() => setResolution(r.res)}
                className={`py-1 px-1.5 rounded text-[10px] font-medium transition-colors ${
                  spatialResolution === r.res
                    ? "bg-[#15212d] text-[#35d6e8]"
                    : "text-[#94a5b8] hover:text-[#e6edf3]"
                }`}
              >
                {r.label}
              </button>
            ))}
          </div>
        </div>

        {/* Map Layers Toggle */}
        <div>
          <label className="text-[11px] font-semibold text-[#94a5b8] uppercase tracking-wider block mb-2 flex items-center justify-between">
            <span>Active Layers</span>
            <Layers className="w-3 h-3 text-[#607387]" />
          </label>
          <div className="space-y-1.5">
            {[
              { id: "arcs", label: "Origin-Destination Arcs" },
              { id: "densityHexagons", label: "H3 Spatial Columns" },
              { id: "trajectories", label: "Movement Trails" },
              { id: "hotspots", label: "Mobility Hubs" },
            ].map((layer) => (
              <label
                key={layer.id}
                className="flex items-center justify-between p-2 rounded bg-[#15212d]/60 border border-[#22313f] hover:bg-[#15212d] cursor-pointer"
              >
                <span className="text-[#e6edf3] text-xs">{layer.label}</span>
                <input
                  type="checkbox"
                  checked={layers[layer.id as keyof typeof layers]}
                  onChange={() => toggleLayer(layer.id as keyof typeof layers)}
                  className="accent-[#35d6e8] w-3.5 h-3.5 rounded cursor-pointer"
                />
              </label>
            ))}
          </div>
        </div>
      </div>
    </aside>
  );
}
