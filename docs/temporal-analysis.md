# Temporal Analysis and Circadian Dynamics

This document details the temporal modeling, timezone normalization, and circadian mobility profile extraction in the LA Mobility Atlas.

---

## 1. Temporal Reference and Normalization

### 1.1 Study Period
The underlying dataset spans the first two weeks of December 2019:
- **Start Time**: `2019-12-01T00:00:00Z`
- **End Time**: `2019-12-14T23:59:59Z`
- **Duration**: 14 continuous 24-hour cycles (336 hourly intervals).

### 1.2 Timezone Normalization
Raw vehicle timestamps are recorded in Coordinated Universal Time (UTC) or epoch seconds.
Because circadian travel behaviors (work commutes, school runs, dining trips) align with local solar and civil time, all timestamps are mapped to canonical Pacific Standard Time (`America/Los_Angeles`, UTC-8):

$$t_{\text{PST}} = t_{\text{UTC}} - 8 \times 3600\,\text{seconds}$$

All front-facing charts, filters, timeline sliders, and analytical tables display canonical local time.

---

## 2. Diurnal Activity Profiles

Aggregating trip generation by hour of day ($h \in [0, 23]$) reveals the characteristic bimodal circadian pattern of metropolitan mobility:

1. **Morning Commute Peak ($07:00 - 09:00$)**:
   - Outward flow from peripheral residential zones (San Fernando Valley, East LA, South LA) toward primary employment centers (Downtown LA, Century City, Westwood).
   - High positive net origin imbalance in suburban cells.
2. **Midday Stabilization ($11:00 - 14:00$)**:
   - Localized commercial, culinary, and intra-district errands.
   - Balanced origin-destination ratios in urban cores.
3. **Evening Return Peak ($16:00 - 19:00$)**:
   - Inward flow from commercial/business corridors back to residential neighborhoods.
   - Negative net flow in office submarkets; high destination volume in residential sectors.
4. **Nocturnal Trough ($01:00 - 05:00$)**:
   - Minimal activity volume, dominated by freight corridors and arterial connections to LAX and logistics depots.

---

## 3. Weekday vs. Weekend Comparative Analysis

Mobility patterns differ sharply between working weekdays and weekend days:

| Dimension | Weekday (Monday–Friday) | Weekend (Saturday–Sunday) |
|---|---|---|
| **Peak Structure** | Distinct bimodal morning & evening peaks | Single broad afternoon crest ($13:00 - 18:00$) |
| **Trip Distribution** | Radial commute corridors to job centers | Leisure and coastal flow (Santa Monica, Venice, Hollywood) |
| **Median Duration** | Longer average duration during congestion peaks | Shorter, more uniform travel durations |
| **Spatial Centroid** | Centered along I-10, I-405, and Downtown corridors | Dispersed along coastal and recreational corridors |

---

## 4. 24x7 Day-Hour Matrix

The temporal aggregation engine computes a $7 \times 24$ activity matrix representing all 168 hours of the weekly cycle:
$$M_{d, h} = \text{TripVolume}(\text{day}=d, \text{hour}=h)$$
where $d \in \{0 = \text{Mon}, 1 = \text{Tue}, \dots, 6 = \text{Sun}\}$ and $h \in \{0, \dots, 23\}$.

This matrix enables interactive cross-filtering on the `/temporal` route, allowing researchers to isolate specific anomaly windows or comparative time slices.
