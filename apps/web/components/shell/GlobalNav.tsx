"use client";

import { useExplorationStore } from "@/stores/useExplorationStore";
import {
  BarChart2,
  BookOpen,
  Clock,
  Compass,
  Database,
  GitCommit,
  Grid,
  Info,
  Layers,
  MapPin,
  Play,
  Search,
  Sliders,
  SplitSquareVertical,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_ITEMS = [
  { href: "/", label: "Overview", icon: Compass },
  { href: "/explore", label: "Explore", icon: Layers },
  { href: "/flows", label: "Flows", icon: GitCommit },
  { href: "/trajectories", label: "Playback", icon: Play },
  { href: "/density", label: "Density", icon: Grid },
  { href: "/temporal", label: "Temporal", icon: Clock },
  { href: "/compare", label: "Compare", icon: SplitSquareVertical },
  { href: "/regions", label: "Regions", icon: MapPin },
  { href: "/distribution", label: "Distributions", icon: BarChart2 },
  { href: "/data", label: "Data", icon: Database },
  { href: "/methodology", label: "Methodology", icon: BookOpen },
  { href: "/about", label: "About", icon: Info },
];

export function GlobalNav() {
  const pathname = usePathname();
  const { leftPanelOpen, setLeftPanelOpen, setCommandPaletteOpen } =
    useExplorationStore();

  return (
    <header className="h-12 w-full bg-[#101923] border-b border-[#22313f] flex items-center justify-between px-3 z-30 select-none">
      {/* Brand & Left Panel Toggle */}
      <div className="flex items-center space-x-3">
        <button
          onClick={() => setLeftPanelOpen(!leftPanelOpen)}
          className={`p-1.5 rounded text-sm transition-colors ${
            leftPanelOpen
              ? "bg-[#22313f] text-[#35d6e8]"
              : "text-[#94a5b8] hover:bg-[#15212d]"
          }`}
          title="Toggle exploration controls"
        >
          <Sliders className="w-4 h-4" />
        </button>

        <Link href="/" className="flex items-center space-x-2 group">
          <div className="w-6 h-6 rounded bg-gradient-to-tr from-[#35d6e8] via-[#8878ff] to-[#da5ff2] flex items-center justify-center p-[1.5px]">
            <div className="w-full h-full bg-[#080d14] rounded-sm flex items-center justify-center">
              <span className="text-[10px] font-bold text-[#35d6e8]">LA</span>
            </div>
          </div>
          <div className="flex flex-col">
            <span className="text-xs font-semibold tracking-wide text-[#e6edf3] group-hover:text-[#35d6e8] transition-colors">
              LA Mobility Atlas
            </span>
          </div>
        </Link>
      </div>

      {/* Primary Route Navigation */}
      <nav className="hidden lg:flex items-center space-x-1 overflow-x-auto">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center space-x-1.5 px-2.5 py-1 rounded text-xs transition-colors ${
                isActive
                  ? "bg-[#15212d] text-[#35d6e8] font-medium border border-[#22313f]"
                  : "text-[#94a5b8] hover:text-[#e6edf3] hover:bg-[#15212d]/60"
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Global Search & Research Badge */}
      <div className="flex items-center space-x-2">
        <button
          onClick={() => setCommandPaletteOpen(true)}
          className="flex items-center space-x-2 px-2.5 py-1 rounded bg-[#15212d] border border-[#22313f] text-xs text-[#94a5b8] hover:text-[#e6edf3] transition-colors"
        >
          <Search className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Search atlas...</span>
          <kbd className="hidden sm:inline px-1 py-0.5 text-[10px] bg-[#0b1420] text-[#607387] rounded border border-[#22313f]">
            ⌘K
          </kbd>
        </button>

        <div className="hidden md:flex items-center px-2 py-0.5 rounded bg-[#0b1420] border border-[#22313f] text-[10px] font-mono text-[#35d6e8]">
          <span className="w-1.5 h-1.5 rounded-full bg-[#35d6e8] animate-pulse mr-1.5" />
          DDTG SYNTHETIC
        </div>
      </div>
    </header>
  );
}
