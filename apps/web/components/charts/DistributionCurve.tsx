"use client";

import type { MetricSummary } from "@la-mobility-atlas/contracts";
import * as d3 from "d3";
import { useEffect, useRef } from "react";

interface DistributionCurveProps {
  summary: MetricSummary;
  unit?: string;
  color?: string;
  height?: number;
}

export function DistributionCurve({
  summary,
  unit = "min",
  color = "#35d6e8",
  height = 140,
}: DistributionCurveProps) {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (
      !svgRef.current ||
      !summary ||
      !summary.bins ||
      summary.bins.length === 0
    )
      return;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const width = svgRef.current.clientWidth || 320;
    const margin = { top: 10, right: 15, bottom: 20, left: 35 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    const g = svg
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    const bins = summary.bins;
    const x = d3
      .scaleLinear()
      .domain([summary.min, summary.p99 || summary.max])
      .range([0, innerWidth]);

    const maxCount = d3.max(bins, (d) => d.count) || 1;
    const y = d3.scaleLinear().domain([0, maxCount]).range([innerHeight, 0]);

    // X Axis
    g.append("g")
      .attr("transform", `translate(0,${innerHeight})`)
      .call(
        d3
          .axisBottom(x)
          .ticks(5)
          .tickFormat((d) => `${d} ${unit}`),
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

    // Histogram bars
    const barWidth = innerWidth / bins.length;
    g.selectAll(".dist-bar")
      .data(bins)
      .enter()
      .append("rect")
      .attr("class", "dist-bar")
      .attr("x", (d, i) => i * barWidth)
      .attr("y", (d) => y(d.count))
      .attr("width", Math.max(1, barWidth - 1))
      .attr("height", (d) => innerHeight - y(d.count))
      .attr("fill", color)
      .attr("opacity", 0.65)
      .attr("rx", 1);

    // Median marker line (P50)
    const medX = x(summary.p50);
    if (medX >= 0 && medX <= innerWidth) {
      g.append("line")
        .attr("x1", medX)
        .attr("x2", medX)
        .attr("y1", 0)
        .attr("y2", innerHeight)
        .attr("stroke", "#ffc46b")
        .attr("stroke-width", 2)
        .attr("stroke-dasharray", "3 3");

      g.append("text")
        .attr("x", medX + 4)
        .attr("y", 10)
        .attr("fill", "#ffc46b")
        .attr("font-size", "9px")
        .attr("font-family", "monospace")
        .text(`P50: ${summary.p50} ${unit}`);
    }
  }, [summary, unit, color, height]);

  return (
    <div className="w-full">
      <svg ref={svgRef} className="w-full" style={{ height: `${height}px` }} />
    </div>
  );
}
