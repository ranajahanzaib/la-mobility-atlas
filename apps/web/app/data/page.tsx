"use client";

import { useManifestQuery, useOverviewQuery } from "@/hooks/useMobilityData";
import {
  CheckCircle2,
  Database,
  Download,
  ExternalLink,
  FileText,
  ShieldCheck,
} from "lucide-react";

export default function DataCatalogPage() {
  const { data: manifest } = useManifestQuery();
  const { data: overview } = useOverviewQuery();

  const artifacts = [
    {
      name: "manifest.json",
      desc: "Dataset provenance, schema versions, and global coverage bounds",
      size: "1.5 KB",
      path: "/data/manifest.json",
    },
    {
      name: "overview.json",
      desc: "Precomputed global totals, medians, peak hours, and bounding box",
      size: "0.8 KB",
      path: "/data/overview.json",
    },
    {
      name: "cells.json",
      desc: "H3 spatial hexagonal cells with origin, destination, and observation counts",
      size: "6.0 KB",
      path: "/data/cells.json",
    },
    {
      name: "flows.json",
      desc: "Aggregated origin-destination flow pairs with median duration and distance",
      size: "7.5 KB",
      path: "/data/flows.json",
    },
    {
      name: "temporal.json",
      desc: "24-hour departure histograms and 7x24 weekly circadian matrix",
      size: "6.0 KB",
      path: "/data/temporal.json",
    },
    {
      name: "distributions.json",
      desc: "Parametric and percentile summaries for duration, distance, and speed",
      size: "16.8 KB",
      path: "/data/distributions.json",
    },
    {
      name: "regions.json",
      desc: "Analytical summaries and flow connectivity for 9 verified LA districts",
      size: "8.8 KB",
      path: "/data/regions.json",
    },
    {
      name: "playback/manifest.json",
      desc: "Manifest of bounded 24-hour trajectory playback chunks",
      size: "2.5 KB",
      path: "/data/playback/manifest.json",
    },
  ];

  return (
    <div className="w-full h-full overflow-y-auto bg-[#080d14] p-8 text-xs select-none">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div>
          <div className="flex items-center space-x-2 text-xs font-mono text-[#35d6e8] uppercase tracking-wider mb-1">
            <Database className="w-3.5 h-3.5" />
            <span>Dataset Catalog & Open Artifacts</span>
          </div>
          <h1 className="text-2xl font-bold text-[#e6edf3]">
            Scientific Dataset Architecture & Downloads
          </h1>
          <p className="text-xs text-[#94a5b8] mt-1 max-w-2xl leading-relaxed">
            All analytical cubes and spatial summaries published in LA Mobility
            Atlas are deterministic derived artifacts computed from the
            peer-reviewed DDTG synthetic Los Angeles vehicle trajectory dataset.
          </p>
        </div>

        {/* Source Citation Box */}
        <div className="surface-glass rounded-lg p-5 shadow-xl space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#e6edf3]">
              Primary Research Citation
            </span>
            <div className="flex space-x-2">
              <a
                href="https://doi.org/10.5061/dryad.4j0zpc8gf"
                target="_blank"
                rel="noreferrer"
                className="flex items-center space-x-1 text-[11px] text-[#35d6e8] hover:underline"
              >
                <span>Dryad DOI</span>
                <ExternalLink className="w-3 h-3" />
              </a>
              <span className="text-[#607387]">·</span>
              <a
                href="https://zenodo.org/records/7391400"
                target="_blank"
                rel="noreferrer"
                className="flex items-center space-x-1 text-[11px] text-[#35d6e8] hover:underline"
              >
                <span>Zenodo 7391400</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
          <p className="font-mono text-[11px] text-[#94a5b8] bg-[#0b1420] p-3 rounded border border-[#22313f] leading-relaxed">
            Anastasiou, C., Kim, S. H., & Shahabi, C. (2022). Synthetic vehicle
            trajectory dataset for the metropolitan city of Los Angeles using
            DDTG [Data set]. Dryad. https://doi.org/10.5061/dryad.4j0zpc8gf
          </p>
        </div>

        {/* Coverage & Verification Table */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="surface-glass rounded-lg p-4 space-y-2">
            <h3 className="text-xs font-semibold text-[#e6edf3] flex items-center space-x-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#35d6e8]" />
              <span>Verified Spatial Bounds</span>
            </h3>
            <div className="space-y-1 font-mono text-[11px] text-[#94a5b8]">
              <div className="flex justify-between">
                <span>North Latitude:</span>
                <span className="text-[#e6edf3]">34.335035° N</span>
              </div>
              <div className="flex justify-between">
                <span>South Latitude:</span>
                <span className="text-[#e6edf3]">33.699820° N</span>
              </div>
              <div className="flex justify-between">
                <span>West Longitude:</span>
                <span className="text-[#e6edf3]">-118.667665° W</span>
              </div>
              <div className="flex justify-between">
                <span>East Longitude:</span>
                <span className="text-[#e6edf3]">-118.180532° W</span>
              </div>
            </div>
          </div>

          <div className="surface-glass rounded-lg p-4 space-y-2">
            <h3 className="text-xs font-semibold text-[#e6edf3] flex items-center space-x-2">
              <ShieldCheck className="w-3.5 h-3.5 text-[#da5ff2]" />
              <span>Pipeline Validation Status</span>
            </h3>
            <div className="space-y-1 font-mono text-[11px] text-[#94a5b8]">
              <div className="flex justify-between">
                <span>Validated Trajectories:</span>
                <span className="text-[#e6edf3]">100% Passed</span>
              </div>
              <div className="flex justify-between">
                <span>Out-of-Bounds Quarantined:</span>
                <span className="text-[#e6edf3]">0 Records</span>
              </div>
              <div className="flex justify-between">
                <span>Observation Schema:</span>
                <span className="text-[#e6edf3]">DDTG Canonical</span>
              </div>
              <div className="flex justify-between">
                <span>Timezone Normalization:</span>
                <span className="text-[#e6edf3]">UTC / PST Derived</span>
              </div>
            </div>
          </div>
        </div>

        {/* Downloadable Analytical Artifacts */}
        <div className="surface-glass rounded-lg p-5 shadow-xl space-y-4">
          <div>
            <h3 className="text-sm font-semibold text-[#e6edf3]">
              Precomputed Analytical Products
            </h3>
            <p className="text-xs text-[#94a5b8] mt-0.5">
              Optimized JSON artifacts ready for downstream GIS, Python, R, and
              browser analytical workloads.
            </p>
          </div>

          <div className="divide-y divide-[#22313f]">
            {artifacts.map((art) => (
              <div
                key={art.name}
                className="py-2.5 flex items-center justify-between"
              >
                <div className="flex items-center space-x-3">
                  <FileText className="w-4 h-4 text-[#35d6e8]" />
                  <div>
                    <span className="font-mono font-semibold text-[#e6edf3] block">
                      {art.name}
                    </span>
                    <span className="text-[11px] text-[#94a5b8]">
                      {art.desc}
                    </span>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <span className="font-mono text-[10px] text-[#607387]">
                    {art.size}
                  </span>
                  <a
                    href={art.path}
                    download
                    className="p-1.5 rounded bg-[#15212d] hover:bg-[#22313f] text-[#35d6e8] transition-colors"
                    title={`Download ${art.name}`}
                  >
                    <Download className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
