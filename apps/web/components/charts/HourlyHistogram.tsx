"use client";

import type { TemporalProfile } from "@la-mobility-atlas/contracts";
import * as d3 from "d3";
import { useEffect, useRef } from "react";

interface HourlyHistogramProps {
  data: TemporalProfile[];
  onHourSelect?: (hour: number) => void;
  selectedHour?: number | null;
  height?: number;
}

export function HourlyHistogram({
  data,
  onHourSelect,
  selectedHour = null,
  height = 140,
}: HourlyHistogramProps) {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current || !data || data.length === 0) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const width = svgRef.current.clientWidth || 320;
    const margin = { top: 10, right: 10, bottom: 20, left: 30 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    const g = svg
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    const x = d3
      .scaleBand()
      .domain(data.map((d) => String(d.hour)))
      .range([0, innerWidth])
      .padding(0.2);

    const maxVal =
      d3.max(data, (d) =>
        Math.max(d.weekday_count, d.weekend_count, d.departure_count),
      ) || 1;
    const y = d3.scaleLinear().domain([0, maxVal]).range([innerHeight, 0]);

    // X Axis
    g.append("g")
      .attr("transform", `translate(0,${innerHeight})`)
      .call(
        d3
          .axisBottom(x)
          .tickValues(["0", "4", "8", "12", "16", "20"])
          .tickFormat((d) => `${d}h`),
      )
      .attr("color", "#607387")
      .selectAll("text")
      .attr("font-size", "9px")
      .attr("font-family", "monospace");

    // Y Axis
    g.append("g")
      .call(d3.axisLeft(y).ticks(3))
      .attr("color", "#607387")
      .selectAll("text")
      .attr("font-size", "9px")
      .attr("font-family", "monospace");

    // Bars
    g.selectAll(".bar")
      .data(data)
      .enter()
      .append("rect")
      .attr("class", "bar")
      .attr("x", (d) => x(String(d.hour)) || 0)
      .attr("y", (d) => y(d.departure_count))
      .attr("width", x.bandwidth())
      .attr("height", (d) => innerHeight - y(d.departure_count))
      .attr("rx", 2)
      .attr("fill", (d) => (selectedHour === d.hour ? "#ffc46b" : "#35d6e8"))
      .attr("opacity", (d) =>
        selectedHour === null || selectedHour === d.hour ? 0.9 : 0.4,
      )
      .style("cursor", "pointer")
      .on("click", (_, d) => {
        if (onHourSelect) onHourSelect(d.hour);
      });
  }, [data, selectedHour, height]);

  return (
    <div className="w-full">
      <svg ref={svgRef} className="w-full" style={{ height: `${height}px` }} />
    </div>
  );
}
