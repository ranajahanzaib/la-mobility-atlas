"use client";

import {
  AlertTriangle,
  BookOpen,
  Cpu,
  Globe,
  Layers,
  Sliders,
} from "lucide-react";

export default function MethodologyPage() {
  return (
    <div className="w-full h-full overflow-y-auto bg-[#080d14] p-8 text-xs select-none">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div>
          <div className="flex items-center space-x-2 text-xs font-mono text-[#35d6e8] uppercase tracking-wider mb-1">
            <BookOpen className="w-3.5 h-3.5" />
            <span>Scientific Methodology</span>
          </div>
          <h1 className="text-2xl font-bold text-[#e6edf3]">
            Geospatial Analysis & Mathematical Framework
          </h1>
          <p className="text-xs text-[#94a5b8] mt-1 max-w-2xl leading-relaxed">
            Detailed scientific principles, spatial aggregation mathematics,
            temporal normalizations, and responsible data interpretation
            standards governing LA Mobility Atlas.
          </p>
        </div>

        {/* Scientific Limitations Warning Banner */}
        <div className="p-4 rounded-lg bg-[#15212d] border border-[#ffc46b]/40 space-y-2">
          <div className="flex items-center space-x-2 text-[#ffc46b] font-semibold text-xs">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span>
              Scientific Research Disclaimer & Responsible Interpretation
            </span>
          </div>
          <p className="text-[11px] text-[#94a5b8] leading-relaxed">
            The vehicle trajectories analyzed in this atlas were synthetically
            generated using the DDTG (Data-Driven Trajectory Generator)
            simulation model developed by Anastasiou, Kim, and Shahabi. They are
            not physical GPS feeds from individual vehicles, live traffic sensor
            feeds, or individual commuter travel diaries. They must not be used
            to infer individual residential locations, commuter identities,
            socioeconomic demographics, or real-time road congestion.
          </p>
        </div>

        {/* Methodology Sections */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="surface-glass rounded-lg p-5 space-y-2.5">
            <div className="flex items-center space-x-2 text-[#35d6e8]">
              <Cpu className="w-4 h-4" />
              <h3 className="text-sm font-semibold text-[#e6edf3]">
                1. DDTG Synthetic Generation
              </h3>
            </div>
            <p className="text-[11px] text-[#94a5b8] leading-relaxed">
              DDTG utilizes traffic count sensors and highway network topologies
              across Greater Los Angeles to synthesize plausible vehicle
              trajectories that respect road speed limits, arterial capacities,
              and turning restrictions over the 2-week period of December 2019.
            </p>
          </div>

          <div className="surface-glass rounded-lg p-5 space-y-2.5">
            <div className="flex items-center space-x-2 text-[#da5ff2]">
              <Globe className="w-4 h-4" />
              <h3 className="text-sm font-semibold text-[#e6edf3]">
                2. H3 Spatial Hexagonal Binning
              </h3>
            </div>
            <p className="text-[11px] text-[#94a5b8] leading-relaxed">
              Spatial discretization relies on the H3 hierarchical hexagonal
              spatial index. At resolution 7 (average cell area ~5.16 km²),
              hexagons minimize edge-effect distortion and offer equal-distance
              adjacency compared to rectangular grid bins.
            </p>
          </div>

          <div className="surface-glass rounded-lg p-5 space-y-2.5">
            <div className="flex items-center space-x-2 text-[#ffc46b]">
              <Sliders className="w-4 h-4" />
              <h3 className="text-sm font-semibold text-[#e6edf3]">
                3. Normalized Daily Trips
              </h3>
            </div>
            <p className="text-[11px] text-[#94a5b8] leading-relaxed">
              To compare weekday and weekend mobility legitimately, raw trip
              volumes are normalized by the exact number of calendar days
              observed (10 weekdays vs. 4 weekend days across the 14-day study
              window), preventing distorted 5:2 ratio comparisons.
            </p>
          </div>

          <div className="surface-glass rounded-lg p-5 space-y-2.5">
            <div className="flex items-center space-x-2 text-[#8878ff]">
              <Layers className="w-4 h-4" />
              <h3 className="text-sm font-semibold text-[#e6edf3]">
                4. GPU Playback & Simplification
              </h3>
            </div>
            <p className="text-[11px] text-[#94a5b8] leading-relaxed">
              Trajectory coordinate streams are temporally indexed as
              [longitude, latitude, timestamp_offset] tuples. Geometry is
              simplified using a modified 3D Ramer-Douglas-Peucker algorithm,
              preserving critical turning waypoints and timestamps while
              enabling 60 FPS GPU rendering.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
