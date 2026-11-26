"use client";

import { Code, ExternalLink, Globe, Info, Shield } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="w-full h-full overflow-y-auto bg-[#080d14] p-8 text-xs select-none">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Brand identity header */}
        <div className="space-y-2">
          <div className="flex items-center space-x-2 text-xs font-mono text-[#35d6e8] uppercase tracking-wider">
            <Info className="w-3.5 h-3.5" />
            <span>Project Information</span>
          </div>
          <h1 className="text-3xl font-bold text-[#e6edf3] tracking-tight">
            LA Mobility Atlas
          </h1>
          <p className="text-sm font-medium text-[#35d6e8]">
            Explore the geography of movement.
          </p>
          <p className="text-xs text-[#94a5b8] max-w-2xl leading-relaxed mt-1">
            An open-source geospatial intelligence platform for investigating
            synthetic vehicle mobility patterns across metropolitan Los Angeles.
            Built for urban researchers, transportation planners, and
            computational geographers.
          </p>
        </div>

        {/* Technology Architecture */}
        <div className="surface-glass rounded-lg p-5 shadow-xl space-y-4">
          <div className="flex items-center space-x-2 text-xs font-semibold text-[#e6edf3]">
            <Code className="w-4 h-4 text-[#35d6e8]" />
            <span>Technology Stack</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="p-3 rounded bg-[#15212d] border border-[#22313f] space-y-1">
              <span className="font-mono text-[10px] text-[#35d6e8] uppercase block">
                Frontend & Rendering
              </span>
              <p className="text-[#e6edf3] font-semibold">Next.js & deck.gl</p>
              <p className="text-[11px] text-[#94a5b8]">
                MapLibre GL JS, React 19, TypeScript strict mode, Tailwind CSS,
                D3.js, Zustand, TanStack Query.
              </p>
            </div>

            <div className="p-3 rounded bg-[#15212d] border border-[#22313f] space-y-1">
              <span className="font-mono text-[10px] text-[#da5ff2] uppercase block">
                High-Performance Backend
              </span>
              <p className="text-[#e6edf3] font-semibold">Rust & Axum Worker</p>
              <p className="text-[11px] text-[#94a5b8]">
                WebAssembly-compiled Workers SDK, Axum router, Serde JSON
                zero-copy deserialization.
              </p>
            </div>

            <div className="p-3 rounded bg-[#15212d] border border-[#22313f] space-y-1">
              <span className="font-mono text-[10px] text-[#ffc46b] uppercase block">
                Data Engineering
              </span>
              <p className="text-[#e6edf3] font-semibold">
                Python & H3 Pipeline
              </p>
              <p className="text-[11px] text-[#94a5b8]">
                Polars, DuckDB, H3 spatial indexing, GeoParquet, analytical cube
                generation, temporal normalization.
              </p>
            </div>
          </div>
        </div>

        {/* Attribution & Open Source */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="surface-glass rounded-lg p-5 space-y-2">
            <div className="flex items-center space-x-2 text-xs font-semibold text-[#e6edf3]">
              <Globe className="w-4 h-4 text-[#35d6e8]" />
              <span>Dataset Attribution</span>
            </div>
            <p className="text-[11px] text-[#94a5b8] leading-relaxed">
              Based on the published research dataset:{" "}
              <em>
                "Synthetic vehicle trajectory dataset for the metropolitan city
                of Los Angeles using DDTG"
              </em>{" "}
              by Chrysovalantis Anastasiou, Seon Ho Kim, and Cyrus Shahabi.
            </p>
            <div className="pt-2">
              <a
                href="https://doi.org/10.5061/dryad.4j0zpc8gf"
                target="_blank"
                rel="noreferrer"
                className="text-xs text-[#35d6e8] hover:underline flex items-center space-x-1"
              >
                <span>Permanent DOI: 10.5061/dryad.4j0zpc8gf</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>

          <div className="surface-glass rounded-lg p-5 space-y-2">
            <div className="flex items-center space-x-2 text-xs font-semibold text-[#e6edf3]">
              <Shield className="w-4 h-4 text-[#8878ff]" />
              <span>Open Source Licensing</span>
            </div>
            <p className="text-[11px] text-[#94a5b8] leading-relaxed">
              LA Mobility Atlas is released under the permissive MIT License.
              Computational pipelines, analytical contracts, and interface
              components are freely redistributable for research, education, and
              municipal analysis.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
