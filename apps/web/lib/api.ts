import type {
  DatasetManifest,
  H3CellActivity,
  ODFlow,
  PlaybackChunk,
  RegionSummary,
  TemporalProfile,
  TripDistributions,
} from "@la-mobility-atlas/contracts";

const DATA_BASE_URL = process.env.NEXT_PUBLIC_DATA_URL || "/data";

async function fetchJson<T>(endpoint: string): Promise<T> {
  const url = `${DATA_BASE_URL}/${endpoint}`;
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Failed to fetch ${url}: status ${res.status}`);
  }
  return res.json();
}

export async function fetchManifest(): Promise<DatasetManifest> {
  return fetchJson<DatasetManifest>("manifest.json");
}

export async function fetchOverview(): Promise<any> {
  return fetchJson<any>("overview.json");
}

export async function fetchCells(): Promise<H3CellActivity[]> {
  return fetchJson<H3CellActivity[]>("cells.json");
}

export async function fetchFlows(): Promise<ODFlow[]> {
  return fetchJson<ODFlow[]>("flows.json");
}

export async function fetchTemporal(): Promise<{
  hourly_profiles: TemporalProfile[];
  day_hour_matrix: number[][];
}> {
  return fetchJson<any>("temporal.json");
}

export async function fetchDistributions(): Promise<TripDistributions> {
  return fetchJson<TripDistributions>("distributions.json");
}

export async function fetchRegions(): Promise<RegionSummary[]> {
  return fetchJson<RegionSummary[]>("regions.json");
}

export async function fetchPlaybackManifest(): Promise<any> {
  return fetchJson<any>("playback/manifest.json");
}

export async function fetchPlaybackChunk(
  chunkId: string,
): Promise<PlaybackChunk> {
  return fetchJson<PlaybackChunk>(`playback/${chunkId}.json`);
}
