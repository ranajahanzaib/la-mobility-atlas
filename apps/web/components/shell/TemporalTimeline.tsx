"use client";

import { useExplorationStore } from "@/stores/useExplorationStore";
import { Pause, Play, RotateCcw } from "lucide-react";

const SPEED_OPTIONS = [1, 10, 60, 300, 600];

export function TemporalTimeline() {
  const {
    isPlaying,
    currentTime,
    playbackSpeed,
    loop,
    selectedDate,
    togglePlayback,
    setCurrentTime,
    setPlaybackSpeed,
  } = useExplorationStore();

  // Format seconds into HH:MM:SS AM/PM local LA time
  const formatTime = (secs: number) => {
    const totalMins = Math.floor(secs / 60);
    const h = Math.floor(totalMins / 60) % 24;
    const m = totalMins % 60;
    const s = Math.floor(secs % 60);
    const ampm = h >= 12 ? "PM" : "AM";
    const displayHour = h % 12 === 0 ? 12 : h % 12;
    return `${String(displayHour).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")} ${ampm} PST`;
  };

  return (
    <div className="h-14 w-full bg-[#101923]/95 backdrop-blur-md border-t border-[#22313f] px-4 flex items-center justify-between z-20 select-none">
      {/* Play/Pause & Scrub Controls */}
      <div className="flex items-center space-x-3">
        <button
          onClick={togglePlayback}
          className={`p-2 rounded-full transition-colors flex items-center justify-center ${
            isPlaying
              ? "bg-[#f45b78] text-[#080d14] hover:bg-[#f45b78]/90"
              : "bg-[#35d6e8] text-[#080d14] hover:bg-[#35d6e8]/90"
          }`}
          title={isPlaying ? "Pause simulation" : "Start simulation"}
        >
          {isPlaying ? (
            <Pause className="w-4 h-4 fill-current" />
          ) : (
            <Play className="w-4 h-4 fill-current ml-0.5" />
          )}
        </button>

        <button
          onClick={() => setCurrentTime(0)}
          className="p-1.5 rounded text-[#94a5b8] hover:text-[#e6edf3] hover:bg-[#15212d] transition-colors"
          title="Restart timeline"
        >
          <RotateCcw className="w-4 h-4" />
        </button>

        <div className="flex flex-col">
          <div className="flex items-center space-x-2">
            <span className="font-mono text-xs font-semibold text-[#e6edf3]">
              {formatTime(currentTime)}
            </span>
            <span className="text-[10px] text-[#607387] font-mono">
              {selectedDate}
            </span>
          </div>
          <span className="text-[10px] text-[#94a5b8]">
            Simulated Los Angeles Time
          </span>
        </div>
      </div>

      {/* Scrubbable Timeline Track */}
      <div className="flex-1 max-w-2xl mx-6">
        <input
          type="range"
          min="0"
          max="86400"
          step="1"
          value={Math.floor(currentTime)}
          onChange={(e) => setCurrentTime(parseFloat(e.target.value))}
          className="w-full accent-[#35d6e8] h-2 bg-[#0b1420] rounded-full cursor-pointer border border-[#22313f]"
        />
        <div className="flex justify-between text-[9px] font-mono text-[#607387] mt-0.5">
          <span>12:00 AM</span>
          <span>06:00 AM (Morning Peak)</span>
          <span>12:00 PM</span>
          <span>05:00 PM (Evening Peak)</span>
          <span>11:59 PM</span>
        </div>
      </div>

      {/* Playback Speeds */}
      <div className="flex items-center space-x-1">
        <span className="text-[10px] text-[#94a5b8] mr-1.5 hidden sm:inline">
          Speed:
        </span>
        {SPEED_OPTIONS.map((spd) => (
          <button
            key={spd}
            onClick={() => setPlaybackSpeed(spd)}
            className={`px-2 py-0.5 rounded font-mono text-[10px] transition-colors ${
              playbackSpeed === spd
                ? "bg-[#15212d] text-[#35d6e8] font-bold border border-[#35d6e8]/40"
                : "text-[#94a5b8] hover:text-[#e6edf3] hover:bg-[#15212d]/60"
            }`}
          >
            {spd}x
          </button>
        ))}
      </div>
    </div>
  );
}
