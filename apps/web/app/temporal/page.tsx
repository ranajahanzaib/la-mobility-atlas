"use client";

import { DayHourHeatmap } from "@/components/charts/DayHourHeatmap";
import { HourlyHistogram } from "@/components/charts/HourlyHistogram";
import { AnalyticalInspector } from "@/components/shell/AnalyticalInspector";
import { ExplorationPanel } from "@/components/shell/ExplorationPanel";
import { useTemporalQuery } from "@/hooks/useMobilityData";
import { useExplorationStore } from "@/stores/useExplorationStore";
import { Clock, Moon, Sun, Sunset } from "lucide-react";
import { useState } from "react";

export default function TemporalPage() {
  const { data: temporal } = useTemporalQuery();
  const { departureWindow, setDepartureWindow } = useExplorationStore();
  const [selectedHour, setSelectedHour] = useState<number | null>(null);

  const hourlyProfiles = temporal?.hourly_profiles || [];
  const matrix = temporal?.day_hour_matrix || [];

  return (
    <div className="relative w-full h-full flex overflow-hidden bg-[#080d14]">
      <ExplorationPanel />

      <div className="flex-1 h-full overflow-y-auto p-6 space-y-6">
        <div className="max-w-5xl mx-auto space-y-6">
          {/* Header */}
          <div>
            <div className="flex items-center space-x-2 text-xs font-mono text-[#35d6e8] uppercase tracking-wider mb-1">
              <Clock className="w-3.5 h-3.5" />
              <span>Temporal Mobility Dynamics</span>
            </div>
            <h1 className="text-xl font-bold text-[#e6edf3]">
              Time-Dependent Movement Patterns across Los Angeles
            </h1>
            <p className="text-xs text-[#94a5b8] mt-1 max-w-2xl">
              Investigation of circadian rhythm, commute peaks, and weekend
              deviations derived from 2-week continuous synthetic vehicle
              observations.
            </p>
          </div>

          {/* Commute Peaks Highlight Banner */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="p-3.5 rounded-lg bg-[#101923] border border-[#22313f] flex items-center space-x-3">
              <div className="p-2.5 rounded bg-[#15212d] text-[#ffc46b]">
                <Sun className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] text-[#94a5b8] uppercase font-mono block">
                  Morning Commute Peak
                </span>
                <span className="text-sm font-semibold text-[#e6edf3]">
                  07:00 – 09:00 PST
                </span>
                <span className="text-[11px] text-[#ffc46b] block mt-0.5">
                  +42% inbound to DTLA & Westside
                </span>
              </div>
            </div>

            <div className="p-3.5 rounded-lg bg-[#101923] border border-[#22313f] flex items-center space-x-3">
              <div className="p-2.5 rounded bg-[#15212d] text-[#f45b78]">
                <Sunset className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] text-[#94a5b8] uppercase font-mono block">
                  Evening Outbound Peak
                </span>
                <span className="text-sm font-semibold text-[#e6edf3]">
                  16:00 – 19:00 PST
                </span>
                <span className="text-[11px] text-[#f45b78] block mt-0.5">
                  Dispersed outbound corridors
                </span>
              </div>
            </div>

            <div className="p-3.5 rounded-lg bg-[#101923] border border-[#22313f] flex items-center space-x-3">
              <div className="p-2.5 rounded bg-[#15212d] text-[#8878ff]">
                <Moon className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] text-[#94a5b8] uppercase font-mono block">
                  Overnight Basal Mobility
                </span>
                <span className="text-sm font-semibold text-[#e6edf3]">
                  01:00 – 04:00 PST
                </span>
                <span className="text-[11px] text-[#8878ff] block mt-0.5">
                  8% of daily peak trips
                </span>
              </div>
            </div>
          </div>

          {/* Hourly Histogram Chart */}
          <div className="surface-glass rounded-lg p-5 shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-semibold text-[#e6edf3]">
                  Hourly Departure Distribution (24-Hour Profile)
                </h3>
                <p className="text-xs text-[#94a5b8] mt-0.5">
                  Click any bar to filter and inspect specific hourly movement
                  slices.
                </p>
              </div>
              {selectedHour !== null && (
                <button
                  onClick={() => setSelectedHour(null)}
                  className="text-xs font-mono text-[#35d6e8] hover:underline"
                >
                  Clear Selection ({selectedHour}:00)
                </button>
              )}
            </div>
            <HourlyHistogram
              data={hourlyProfiles}
              selectedHour={selectedHour}
              onHourSelect={(h) => setSelectedHour(h)}
              height={180}
            />
          </div>

          {/* Day x Hour Heatmap */}
          <div className="surface-glass rounded-lg p-5 shadow-xl">
            <div className="mb-4">
              <h3 className="text-sm font-semibold text-[#e6edf3]">
                Weekly Circadian Matrix (Day of Week vs. Local Hour)
              </h3>
              <p className="text-xs text-[#94a5b8] mt-0.5">
                Activity density across 168 hours of the weekly cycle. Weekday
                dual peaks contrast against mid-day weekend leisure
                concentration.
              </p>
            </div>
            <DayHourHeatmap matrix={matrix} />
          </div>
        </div>
      </div>

      <AnalyticalInspector />
    </div>
  );
}
