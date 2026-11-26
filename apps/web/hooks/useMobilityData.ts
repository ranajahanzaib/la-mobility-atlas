"use client";

import {
  fetchCells,
  fetchDistributions,
  fetchFlows,
  fetchManifest,
  fetchOverview,
  fetchPlaybackChunk,
  fetchPlaybackManifest,
  fetchRegions,
  fetchTemporal,
} from "@/lib/api";
import { useQuery } from "@tanstack/react-query";

export function useManifestQuery() {
  return useQuery({
    queryKey: ["manifest"],
    queryFn: fetchManifest,
    staleTime: Infinity,
  });
}

export function useOverviewQuery() {
  return useQuery({
    queryKey: ["overview"],
    queryFn: fetchOverview,
    staleTime: Infinity,
  });
}

export function useCellsQuery() {
  return useQuery({
    queryKey: ["cells"],
    queryFn: fetchCells,
    staleTime: Infinity,
  });
}

export function useFlowsQuery() {
  return useQuery({
    queryKey: ["flows"],
    queryFn: fetchFlows,
    staleTime: Infinity,
  });
}

export function useTemporalQuery() {
  return useQuery({
    queryKey: ["temporal"],
    queryFn: fetchTemporal,
    staleTime: Infinity,
  });
}

export function useDistributionsQuery() {
  return useQuery({
    queryKey: ["distributions"],
    queryFn: fetchDistributions,
    staleTime: Infinity,
  });
}

export function useRegionsQuery() {
  return useQuery({
    queryKey: ["regions"],
    queryFn: fetchRegions,
    staleTime: Infinity,
  });
}

export function usePlaybackManifestQuery() {
  return useQuery({
    queryKey: ["playback-manifest"],
    queryFn: fetchPlaybackManifest,
    staleTime: Infinity,
  });
}

export function usePlaybackChunkQuery(chunkId: string) {
  return useQuery({
    queryKey: ["playback-chunk", chunkId],
    queryFn: () => fetchPlaybackChunk(chunkId),
    enabled: Boolean(chunkId),
    staleTime: Infinity,
  });
}
