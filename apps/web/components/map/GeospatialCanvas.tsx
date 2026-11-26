"use client";

import { useExplorationStore } from "@/stores/useExplorationStore";
import { MapboxOverlay } from "@deck.gl/mapbox";
import type {
  H3CellActivity,
  ODFlow,
  PlaybackTrajectory,
  RegionSummary,
} from "@la-mobility-atlas/contracts";
import * as maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { useEffect, useRef } from "react";
import {
  DARK_BASEMAP_STYLE,
  LIGHT_BASEMAP_STYLE,
  MONOCHROME_BASEMAP_STYLE,
} from "./BasemapStyles";
import { buildDeckLayers } from "./DeckLayers";

interface GeospatialCanvasProps {
  flows?: ODFlow[];
  cells?: H3CellActivity[];
  regions?: RegionSummary[];
  trajectories?: PlaybackTrajectory[];
  className?: string;
}

export function GeospatialCanvas({
  flows = [],
  cells = [],
  regions = [],
  trajectories = [],
  className = "",
}: GeospatialCanvasProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);
  const overlayRef = useRef<MapboxOverlay | null>(null);
  const animFrameRef = useRef<number | null>(null);

  const {
    camera,
    is3D,
    basemapStyle,
    layers,
    selectedCell,
    selectedFlow,
    metric,
    currentTime,
    trailLength,
    isPlaying,
    playbackSpeed,
    selectCell,
    selectFlow,
    setCurrentTime,
  } = useExplorationStore();

  // Initialize MapLibre Map
  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    try {
      const style =
        basemapStyle === "light"
          ? LIGHT_BASEMAP_STYLE
          : basemapStyle === "monochrome"
            ? MONOCHROME_BASEMAP_STYLE
            : DARK_BASEMAP_STYLE;

      const map = new maplibregl.Map({
        container: mapContainerRef.current,
        style: style,
        center: [camera.longitude, camera.latitude],
        zoom: camera.zoom,
        pitch: camera.pitch,
        bearing: camera.bearing,
        maxPitch: 75,
      });

      const overlay = new MapboxOverlay({
        interleaved: false,
        layers: [],
      });

      map.addControl(overlay as any);
      overlayRef.current = overlay;
      mapRef.current = map;
    } catch (err) {
      console.error("[GeospatialCanvas] Failed to initialize map:", err);
    }

    return () => {
      if (overlayRef.current) {
        overlayRef.current.finalize();
        overlayRef.current = null;
      }
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  // Sync Camera when store camera updates programmatically
  useEffect(() => {
    if (!mapRef.current) return;
    mapRef.current.easeTo({
      center: [camera.longitude, camera.latitude],
      zoom: camera.zoom,
      pitch: camera.pitch,
      bearing: camera.bearing,
      duration: 1200,
    });
  }, [
    camera.longitude,
    camera.latitude,
    camera.zoom,
    camera.pitch,
    camera.bearing,
  ]);

  // Update deck.gl layers
  useEffect(() => {
    if (!overlayRef.current) return;

    const deckLayers = buildDeckLayers({
      flows,
      cells,
      regions,
      trajectories,
      selectedCell,
      selectedFlow,
      metric,
      currentTime,
      trailLength,
      is3D,
      activeLayers: layers,
      onCellClick: (c) => selectCell(c),
      onFlowClick: (f) => selectFlow(f),
    });

    overlayRef.current.setProps({ layers: deckLayers });
  }, [
    flows,
    cells,
    regions,
    trajectories,
    selectedCell,
    selectedFlow,
    metric,
    currentTime,
    trailLength,
    is3D,
    layers,
  ]);

  // Animation frame loop for trajectory playback
  useEffect(() => {
    if (!isPlaying) {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      return;
    }

    let lastTimestamp = performance.now();

    const loop = (now: number) => {
      const deltaSec = (now - lastTimestamp) / 1000.0;
      lastTimestamp = now;

      const increment = deltaSec * playbackSpeed;
      setCurrentTime((currentTime + increment) % 86400);

      animFrameRef.current = requestAnimationFrame(loop);
    };

    animFrameRef.current = requestAnimationFrame(loop);

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [isPlaying, playbackSpeed, currentTime, setCurrentTime]);

  return (
    <div className={`relative w-full h-full overflow-hidden ${className}`}>
      <div ref={mapContainerRef} className="w-full h-full" />
    </div>
  );
}
