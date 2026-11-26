"use client";

import type { ODFlow, RegionSummary } from "@la-mobility-atlas/contracts";

interface CircularFlowDiagramProps {
  regions: RegionSummary[];
  flows: ODFlow[];
  size?: number;
}

export function CircularFlowDiagram({
  regions,
  flows,
  size = 320,
}: CircularFlowDiagramProps) {
  if (!regions || regions.length === 0) return null;

  const radius = size / 2 - 40;
  const center = size / 2;

  // Place regions evenly on circle perimeter
  const nodeAngle = (2 * Math.PI) / regions.length;
  const nodes = regions.map((reg, i) => {
    const angle = i * nodeAngle - Math.PI / 2;
    const x = center + radius * Math.cos(angle);
    const y = center + radius * Math.sin(angle);
    return { reg, x, y, angle };
  });

  return (
    <div className="flex flex-col items-center select-none">
      <svg width={size} height={size} className="overflow-visible">
        {/* Connection Curves */}
        {nodes.map((n1, i) =>
          nodes.map((n2, j) => {
            if (i >= j) return null;
            // Draw smooth quadratic bezier curve through center
            const pathData = `M ${n1.x} ${n1.y} Q ${center} ${center} ${n2.x} ${n2.y}`;
            return (
              <path
                key={`${i}-${j}`}
                d={pathData}
                fill="none"
                stroke="url(#flowGradient)"
                strokeWidth={1.5}
                strokeOpacity={0.4}
                className="hover:stroke-opacity-100 hover:stroke-[#35d6e8] transition-all cursor-pointer"
              />
            );
          }),
        )}

        {/* Nodes */}
        {nodes.map((n) => (
          <g key={n.reg.region_id} className="cursor-pointer group">
            <circle
              cx={n.x}
              cy={n.y}
              r={6}
              fill="#101923"
              stroke="#35d6e8"
              strokeWidth={2}
              className="group-hover:fill-[#35d6e8] transition-colors"
            />
            <text
              x={n.x + 10 * Math.cos(n.angle)}
              y={n.y + 10 * Math.sin(n.angle)}
              fill="#e6edf3"
              fontSize={9}
              fontFamily="sans-serif"
              textAnchor={Math.cos(n.angle) < -0.1 ? "end" : "start"}
              dominantBaseline="middle"
              className="group-hover:fill-[#35d6e8] transition-colors"
            >
              {n.reg.name}
            </text>
          </g>
        ))}

        <defs>
          <linearGradient id="flowGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#35d6e8" />
            <stop offset="100%" stopColor="#da5ff2" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
}
