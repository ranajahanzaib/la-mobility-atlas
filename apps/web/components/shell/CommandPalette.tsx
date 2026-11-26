"use client";

import { useExplorationStore } from "@/stores/useExplorationStore";
import { Search, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export function CommandPalette() {
  const router = useRouter();
  const {
    commandPaletteOpen,
    setCommandPaletteOpen,
    applyPreset,
    selectRegion,
  } = useExplorationStore();
  const [query, setQuery] = useState("");

  // Handle Cmd+K keyboard shortcut
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setCommandPaletteOpen(!commandPaletteOpen);
      }
      if (e.key === "Escape") {
        setCommandPaletteOpen(false);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [commandPaletteOpen, setCommandPaletteOpen]);

  if (!commandPaletteOpen) return null;

  const quickRoutes = [
    {
      title: "Overview",
      href: "/",
      desc: "Cinematic 3D metropolitan mobility overview",
    },
    {
      title: "Origin–Destination Flows",
      href: "/flows",
      desc: "Flow matrices, 3D arcs, and spider maps",
    },
    {
      title: "Trajectory Playback",
      href: "/trajectories",
      desc: "Animated vehicle trajectory simulation",
    },
    {
      title: "Spatial Density",
      href: "/density",
      desc: "H3 hexagonal columns and activity choropleths",
    },
    {
      title: "Temporal Patterns",
      href: "/temporal",
      desc: "Hourly histograms and day-by-hour matrices",
    },
    {
      title: "Weekday vs Weekend",
      href: "/compare",
      desc: "Synchronized split-screen comparison",
    },
    {
      title: "Geographic Regions",
      href: "/regions",
      desc: "Exploration profiles for 9 LA regions",
    },
    {
      title: "Trip Distributions",
      href: "/distribution",
      desc: "Duration and distance distributions",
    },
    {
      title: "Scientific Data Catalog",
      href: "/data",
      desc: "Dataset specifications, schemas, downloads",
    },
    {
      title: "Methodology",
      href: "/methodology",
      desc: "Synthetic DDTG model and spatial calculations",
    },
  ];

  const filteredRoutes = quickRoutes.filter(
    (r) =>
      r.title.toLowerCase().includes(query.toLowerCase()) ||
      r.desc.toLowerCase().includes(query.toLowerCase()),
  );

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-start justify-center pt-20 px-4">
      <div className="w-full max-w-lg bg-[#101923] border border-[#22313f] rounded-lg shadow-2xl overflow-hidden text-xs">
        {/* Input header */}
        <div className="p-3 border-b border-[#22313f] flex items-center space-x-2">
          <Search className="w-4 h-4 text-[#35d6e8]" />
          <input
            type="text"
            placeholder="Type a route, region, or exploration preset..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-transparent text-[#e6edf3] placeholder-[#607387] outline-none text-xs"
            autoFocus
          />
          <button
            onClick={() => setCommandPaletteOpen(false)}
            className="p-1 rounded text-[#94a5b8] hover:text-[#e6edf3]"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Results */}
        <div className="max-h-80 overflow-y-auto p-2 space-y-1">
          <div className="text-[10px] font-semibold text-[#607387] uppercase tracking-wider px-2 py-1">
            Application Routes
          </div>
          {filteredRoutes.map((item) => (
            <button
              key={item.href}
              onClick={() => {
                setCommandPaletteOpen(false);
                router.push(item.href);
              }}
              className="w-full text-left p-2 rounded hover:bg-[#15212d] flex items-center justify-between text-[#e6edf3] transition-colors"
            >
              <div>
                <span className="font-medium">{item.title}</span>
                <p className="text-[11px] text-[#94a5b8] mt-0.5">{item.desc}</p>
              </div>
              <span className="text-[10px] font-mono text-[#35d6e8]">
                Open ↵
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
