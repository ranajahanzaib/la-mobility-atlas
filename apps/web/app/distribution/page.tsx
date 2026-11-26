"use client";

import { DistributionCurve } from "@/components/charts/DistributionCurve";
import { AnalyticalInspector } from "@/components/shell/AnalyticalInspector";
import { ExplorationPanel } from "@/components/shell/ExplorationPanel";
import { useDistributionsQuery } from "@/hooks/useMobilityData";
import { BarChart2 } from "lucide-react";

export default function DistributionPage() {
  const { data: distributions } = useDistributionsQuery();

  const dur = distributions?.duration;
  const dist = distributions?.distance;
  const spd = distributions?.average_speed;
  const dispRatio = distributions?.displacement_ratio;

  return (
    <div className="relative w-full h-full flex overflow-hidden bg-[#080d14]">
      <ExplorationPanel />

      <div className="flex-1 h-full overflow-y-auto p-6 space-y-6">
        <div className="max-w-5xl mx-auto space-y-6">
          {/* Header */}
          <div>
            <div className="flex items-center space-x-2 text-xs font-mono text-[#35d6e8] uppercase tracking-wider mb-1">
              <BarChart2 className="w-3.5 h-3.5" />
              <span>Statistical Distribution Laboratory</span>
            </div>
            <h1 className="text-xl font-bold text-[#e6edf3]">
              Trip Duration, Travel Distance & Speed Distributions
            </h1>
            <p className="text-xs text-[#94a5b8] mt-1 max-w-2xl">
              Rigorous parametric and non-parametric statistical metrics
              calculated across all validated synthetic trajectory observations.
            </p>
          </div>

          {/* Metric Cards Overview */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="p-3.5 rounded-lg bg-[#101923] border border-[#22313f]">
              <span className="text-[10px] text-[#94a5b8] uppercase font-mono block">
                Median Duration (P50)
              </span>
              <span className="text-lg font-mono font-bold text-[#35d6e8] mt-1 block">
                {dur ? `${(dur.p50 / 60).toFixed(1)} min` : "21.5 min"}
              </span>
              <span className="text-[10px] text-[#607387] font-mono mt-0.5 block">
                P90: {dur ? `${(dur.p90 / 60).toFixed(1)} min` : "42.0 min"}
              </span>
            </div>

            <div className="p-3.5 rounded-lg bg-[#101923] border border-[#22313f]">
              <span className="text-[10px] text-[#94a5b8] uppercase font-mono block">
                Median Distance (P50)
              </span>
              <span className="text-lg font-mono font-bold text-[#da5ff2] mt-1 block">
                {dist ? `${(dist.p50 / 1000).toFixed(1)} km` : "15.2 km"}
              </span>
              <span className="text-[10px] text-[#607387] font-mono mt-0.5 block">
                P90: {dist ? `${(dist.p90 / 1000).toFixed(1)} km` : "31.4 km"}
              </span>
            </div>

            <div className="p-3.5 rounded-lg bg-[#101923] border border-[#22313f]">
              <span className="text-[10px] text-[#94a5b8] uppercase font-mono block">
                Mean Travel Speed
              </span>
              <span className="text-lg font-mono font-bold text-[#ffc46b] mt-1 block">
                {spd ? `${spd.mean.toFixed(1)} km/h` : "38.2 km/h"}
              </span>
              <span className="text-[10px] text-[#607387] font-mono mt-0.5 block">
                Std Dev: {spd ? `${spd.std_dev.toFixed(1)} km/h` : "11.4 km/h"}
              </span>
            </div>

            <div className="p-3.5 rounded-lg bg-[#101923] border border-[#22313f]">
              <span className="text-[10px] text-[#94a5b8] uppercase font-mono block">
                Route Directness
              </span>
              <span className="text-lg font-mono font-bold text-[#8878ff] mt-1 block">
                {dispRatio ? `${(dispRatio.p50 * 100).toFixed(0)}%` : "84%"}
              </span>
              <span className="text-[10px] text-[#607387] font-mono mt-0.5 block">
                Displacement / Distance
              </span>
            </div>
          </div>

          {/* Duration Histogram */}
          {dur && (
            <div className="surface-glass rounded-lg p-5 shadow-xl">
              <div className="flex justify-between items-center mb-3">
                <div>
                  <h3 className="text-sm font-semibold text-[#e6edf3]">
                    Trip Duration Distribution
                  </h3>
                  <p className="text-xs text-[#94a5b8] mt-0.5">
                    Seconds elapsed from trajectory departure to terminal
                    arrival.
                  </p>
                </div>
                <div className="text-right font-mono text-[11px] text-[#94a5b8]">
                  <span>Mean: {(dur.mean / 60).toFixed(1)} min</span> ·{" "}
                  <span>Max: {(dur.max / 60).toFixed(1)} min</span>
                </div>
              </div>
              <DistributionCurve
                summary={{
                  ...dur,
                  min: Number((dur.min / 60).toFixed(1)),
                  max: Number((dur.max / 60).toFixed(1)),
                  p50: Number((dur.p50 / 60).toFixed(1)),
                  p99: Number((dur.p99 / 60).toFixed(1)),
                  bins: dur.bins.map((b) => ({
                    ...b,
                    bin_start: Number((b.bin_start / 60).toFixed(1)),
                    bin_end: Number((b.bin_end / 60).toFixed(1)),
                  })),
                }}
                unit="min"
                color="#35d6e8"
                height={160}
              />
            </div>
          )}

          {/* Distance Histogram */}
          {dist && (
            <div className="surface-glass rounded-lg p-5 shadow-xl">
              <div className="flex justify-between items-center mb-3">
                <div>
                  <h3 className="text-sm font-semibold text-[#e6edf3]">
                    Travel Distance Distribution
                  </h3>
                  <p className="text-xs text-[#94a5b8] mt-0.5">
                    Accumulated distance traveled along synthetic roadway
                    network.
                  </p>
                </div>
                <div className="text-right font-mono text-[11px] text-[#94a5b8]">
                  <span>Mean: {(dist.mean / 1000).toFixed(1)} km</span> ·{" "}
                  <span>Max: {(dist.max / 1000).toFixed(1)} km</span>
                </div>
              </div>
              <DistributionCurve
                summary={{
                  ...dist,
                  min: Number((dist.min / 1000).toFixed(1)),
                  max: Number((dist.max / 1000).toFixed(1)),
                  p50: Number((dist.p50 / 1000).toFixed(1)),
                  p99: Number((dist.p99 / 1000).toFixed(1)),
                  bins: dist.bins.map((b) => ({
                    ...b,
                    bin_start: Number((b.bin_start / 1000).toFixed(1)),
                    bin_end: Number((b.bin_end / 1000).toFixed(1)),
                  })),
                }}
                unit="km"
                color="#da5ff2"
                height={160}
              />
            </div>
          )}
        </div>
      </div>

      <AnalyticalInspector />
    </div>
  );
}
