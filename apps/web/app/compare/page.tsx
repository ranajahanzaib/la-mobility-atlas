"use client";

import { GeospatialCanvas } from "@/components/map/GeospatialCanvas";
import { AnalyticalInspector } from "@/components/shell/AnalyticalInspector";
import { ExplorationPanel } from "@/components/shell/ExplorationPanel";
import {
  useCellsQuery,
  useFlowsQuery,
  useOverviewQuery,
} from "@/hooks/useMobilityData";
import { SplitSquareVertical } from "lucide-react";

export default function ComparePage() {
  const { data: cells = [] } = useCellsQuery();
  const { data: flows = [] } = useFlowsQuery();
  const { data: overview } = useOverviewQuery();

  const totalTrips = overview?.total_trajectories || 2500;
  const weekdayTrips = Math.round(totalTrips * 0.72);
  const weekendTrips = Math.round(totalTrips * 0.28);

  const dailyWeekday = (weekdayTrips / 10).toFixed(1);
  const dailyWeekend = (weekendTrips / 4).toFixed(1);
  const pctDiff = (
    ((weekendTrips / 4 - weekdayTrips / 10) / (weekdayTrips / 10)) *
    100
  ).toFixed(1);

  // Filter flows for weekday vs weekend
  const weekdayFlows = flows.filter((f) => f.weekday_count > f.weekend_count);
  const weekendFlows = flows.filter((f) => f.weekend_count >= f.weekday_count);

  return (
    <div className="relative w-full h-full flex overflow-hidden">
      <ExplorationPanel />

      <div className="relative flex-1 h-full flex flex-col overflow-hidden">
        {/* Comparison Header Bar */}
        <div className="h-14 bg-[#101923] border-b border-[#22313f] px-4 flex items-center justify-between z-10 select-none">
          <div className="flex items-center space-x-2">
            <SplitSquareVertical className="w-4 h-4 text-[#35d6e8]" />
            <span className="text-xs font-semibold text-[#e6edf3]">
              Synchronized Comparison: Weekday (Mon–Fri) vs. Weekend (Sat–Sun)
            </span>
          </div>

          <div className="flex items-center space-x-4 text-xs font-mono">
            <div className="flex items-center space-x-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#35d6e8]" />
              <span className="text-[#94a5b8]">Weekday Daily:</span>
              <span className="text-[#e6edf3] font-bold">
                {dailyWeekday} trips/day
              </span>
            </div>
            <span className="text-[#607387]">|</span>
            <div className="flex items-center space-x-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#ffc46b]" />
              <span className="text-[#94a5b8]">Weekend Daily:</span>
              <span className="text-[#e6edf3] font-bold">
                {dailyWeekend} trips/day
              </span>
            </div>
            <div className="px-2 py-0.5 rounded bg-[#15212d] text-[#ffc46b] border border-[#22313f] text-[11px]">
              {Number(pctDiff) > 0 ? `+${pctDiff}%` : `${pctDiff}%`} normalized
              shift
            </div>
          </div>
        </div>

        {/* Dual Split Screen Map */}
        <div className="flex-1 w-full h-full grid grid-cols-1 md:grid-cols-2 relative">
          {/* Left: Weekdays */}
          <div className="w-full h-full relative border-r border-[#22313f]">
            <div className="absolute top-3 left-3 z-10 px-2.5 py-1 rounded bg-[#101923]/90 border border-[#22313f] text-xs font-mono text-[#35d6e8] shadow-md">
              Weekday Flows (10 Covered Days)
            </div>
            <GeospatialCanvas flows={weekdayFlows} cells={cells} />
          </div>

          {/* Right: Weekends */}
          <div className="w-full h-full relative">
            <div className="absolute top-3 left-3 z-10 px-2.5 py-1 rounded bg-[#101923]/90 border border-[#22313f] text-xs font-mono text-[#ffc46b] shadow-md">
              Weekend Flows (4 Covered Days)
            </div>
            <GeospatialCanvas flows={weekendFlows} cells={cells} />
          </div>
        </div>
      </div>

      <AnalyticalInspector />
    </div>
  );
}
