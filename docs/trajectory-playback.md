# Trajectory Processing and 4D Playback Architecture

This document describes the trajectory simplification, temporal chunking, and GPU-accelerated animation pipeline utilized in the LA Mobility Atlas.

---

## 1. High-Performance GPU Playback via deck.gl TripsLayer

Rendering thousands of concurrent moving vehicle trajectories in real time at 60 FPS requires specialized GPU shader pipelines. 
LA Mobility Atlas uses the `TripsLayer` from **deck.gl**, which evaluates temporal interpolation directly inside WebGL vertex shaders:

```typescript
new TripsLayer({
  id: 'mobility-trips-playback',
  data: trajectoryPaths,
  getPath: (d) => d.path,       // Array of [longitude, latitude, timestamp_seconds]
  getTimestamps: (d) => d.timestamps,
  getColor: (d) => d.color,
  opacity: 0.8,
  widthMinPixels: 2.5,
  trailLength: 360,            // Trail persistence window (in seconds)
  currentTime: currentTimestampSeconds,
  shadowEnabled: false
})
```

---

## 2. 4D Coordinate Format

Each vehicle trajectory is transformed into a compact 3-element tuple stream:
$$\vec{w}_j = [\lambda_j, \phi_j, \Delta t_j]$$
where:
- $\lambda_j$: Geodetic longitude in WGS84 ($[-118.67, -118.18]$).
- $\phi_j$: Geodetic latitude in WGS84 ($[33.70, 34.34]$).
- $\Delta t_j$: Relative timestamp offset in seconds from the start of the daily 24-hour cycle ($[0, 86400)$).

This relative diurnal offset allows smooth looping playback across single 24-hour circadian cycles or continuous simulation timelines.

---

## 3. Trajectory Simplification (Ramer–Douglas–Peucker)

To optimize browser memory transfer and GPU vertex buffer allocation, raw trajectory observation streams are simplified using a 3D adaptation of the Ramer–Douglas–Peucker (RDP) algorithm:
- Points that deviate by less than $\epsilon = 0.00008^\circ$ ($\approx 8.8\,\text{meters}$) from the linear segment connecting their bounding waypoints are pruned.
- Cardinal turns, highway exits, and intersection halts are preserved.
- Reduction efficiency: Typically eliminates $40\% - 65\%$ of redundant colinear GPS observations while preserving path geometry.

---

## 4. Temporal Chunking and Playback Partitions

To avoid loading the entire multi-gigabyte trajectory set into client memory, trajectories are partitioned into hourly playback chunks:
- `trajectories_hour_00.json` through `trajectories_hour_23.json`
- Each partition contains trajectories that were active during that hour window.
- The web application lazily fetches the active hour chunk and pre-fetches the subsequent hour in background cache.
