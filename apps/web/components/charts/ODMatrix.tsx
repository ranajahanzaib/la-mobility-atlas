"use client";

import type { RegionSummary } from "@la-mobility-atlas/contracts";

interface ODMatrixProps {
  regions: RegionSummary[];
  onCellSelect?: (r1: string, r2: string) => void;
}

export function ODMatrix({ regions, onCellSelect }: ODMatrixProps) {
  if (!regions || regions.length === 0) return null;

  return (
    <div className="w-full overflow-x-auto select-none">
      <table className="text-xs border-collapse font-mono">
        <thead>
          <tr>
            <th className="p-1.5 text-left text-[10px] text-[#607387] border border-[#22313f]">
              Origin \ Dest
            </th>
            {regions.map((r) => (
              <th
                key={r.region_id}
                className="p-1.5 text-center text-[10px] text-[#94a5b8] border border-[#22313f] max-w-[70px] truncate"
                title={r.name}
              >
                {r.name.slice(0, 4)}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {regions.map((r1) => (
            <tr key={r1.region_id}>
              <td className="p-1.5 text-[10px] text-[#94a5b8] font-medium border border-[#22313f] whitespace-nowrap">
                {r1.name.slice(0, 10)}
              </td>
              {regions.map((r2) => {
                const isDiag = r1.region_id === r2.region_id;
                // Look up connected volume
                const conn = r1.top_connected_regions?.find(
                  (c) => c.region_id === r2.region_id,
                );
                const trips = isDiag
                  ? r1.internal_trips
                  : conn?.trip_count || 0;

                return (
                  <td
                    key={r2.region_id}
                    onClick={() =>
                      onCellSelect && onCellSelect(r1.region_id, r2.region_id)
                    }
                    className={`p-1.5 text-center border border-[#22313f] cursor-pointer hover:bg-[#35d6e8]/20 transition-colors ${
                      trips > 0
                        ? "text-[#e6edf3] font-semibold"
                        : "text-[#607387]"
                    } ${isDiag ? "bg-[#15212d]/70" : ""}`}
                    title={`${r1.name} → ${r2.name}: ${trips} trips`}
                  >
                    {trips > 0 ? trips : "·"}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
