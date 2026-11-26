"use client";

import React from "react";

interface DayHourHeatmapProps {
  matrix: number[][]; // 7 days x 24 hours
}

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export function DayHourHeatmap({ matrix }: DayHourHeatmapProps) {
  if (!matrix || matrix.length === 0) return null;

  let maxVal = 1;
  matrix.forEach((row) => {
    row.forEach((v) => {
      if (v > maxVal) maxVal = v;
    });
  });

  return (
    <div className="w-full select-none">
      <div className="grid grid-cols-[32px_repeat(24,1fr)] gap-0.5">
        {/* Hour Header */}
        <div />
        {Array.from({ length: 24 }).map((_, h) => (
          <div
            key={h}
            className="text-[8px] font-mono text-[#607387] text-center"
          >
            {h % 4 === 0 ? `${h}` : ""}
          </div>
        ))}

        {/* Days and cells */}
        {DAYS.map((day, dIdx) => (
          <React.Fragment key={day}>
            <div className="text-[9px] font-mono text-[#94a5b8] flex items-center">
              {day}
            </div>
            {Array.from({ length: 24 }).map((_, h) => {
              const val = matrix[dIdx]?.[h] || 0;
              const intensity = Math.sqrt(val / maxVal);
              return (
                <div
                  key={`${dIdx}-${h}`}
                  className="h-3.5 rounded-[1px] transition-transform hover:scale-125 hover:z-10"
                  style={{
                    backgroundColor:
                      val === 0
                        ? "#0b1420"
                        : `rgba(53, 214, 232, ${Math.max(0.15, intensity)})`,
                  }}
                  title={`${day} at ${h}:00 — ${val} trips`}
                />
              );
            })}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}
