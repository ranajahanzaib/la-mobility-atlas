# Metric Definitions and Formulations

This document specifies the exact mathematical definitions, statistical formulations, and aggregation conventions used throughout the LA Mobility Atlas platform.

---

## 1. Spatial Units and Indexing

### 1.1 H3 Spatial Indexing
Hexagonal spatial units are indexed using the Uber H3 discrete global grid system. 
Each cell $c \in \mathcal{H}_r$ at resolution $r \in \{6, 7, 8\}$ corresponds to a unique 64-bit integer index (represented canonically as a 15-character lowercase hexadecimal string).

- **Resolution 6**: Regional mobility macro-corridors ($\approx 36\,\text{km}^2$ area, $\approx 3.7\,\text{km}$ edge length).
- **Resolution 7**: District-level urban mobility ($\approx 5.16\,\text{km}^2$ area, $\approx 1.4\,\text{km}$ edge length).
- **Resolution 8**: Neighborhood-level granular activity ($\approx 0.74\,\text{km}^2$ area, $\approx 0.53\,\text{km}$ edge length).

### 1.2 Cell Center Coordinate
The spatial reference point for a cell $c$ is its centroid $(\lambda_c, \phi_c)$, calculated using spherical geodesic projection from its hexagonal vertex boundaries:

$$\lambda_c = \frac{1}{6} \sum_{k=1}^6 \lambda_k, \quad \phi_c = \frac{1}{6} \sum_{k=1}^6 \phi_k$$

---

## 2. Trajectory Metrics

Let $T_i$ represent a vehicle trajectory comprising an ordered sequence of $m_i$ spatio-temporal observations:
$$T_i = \{(p_{i, 1}, t_{i, 1}), (p_{i, 2}, t_{i, 2}), \dots, (p_{i, m_i}, t_{i, m_i})\}$$
where $p_{i, j} = (\text{lat}_{i, j}, \text{lng}_{i, j})$ and $t_{i, j}$ is a UTC timestamp.

### 2.1 Trajectory Duration
The observed duration $D_{\text{obs}}(T_i)$ is the elapsed wall-clock time between the initial departure observation and terminal arrival observation:
$$D_{\text{obs}}(T_i) = t_{i, m_i} - t_{i, 1}$$

In the source metadata, `travel_time` ($D_{\text{meta}}(T_i)$) represents the simulator engine's synthesized transit time. The platform surfaces both values, flagging significant discrepancies where:
$$\left| D_{\text{obs}}(T_i) - D_{\text{meta}}(T_i) \right| > 300\,\text{seconds}$$

### 2.2 Trajectory Length (Cumulative Geodesic Distance)
Cumulative travel distance $S(T_i)$ is computed by summing the Haversine great-circle distances along consecutive waypoints:
$$S(T_i) = \sum_{j=1}^{m_i - 1} d_{\text{haversine}}(p_{i, j}, p_{i, j+1})$$

where the Haversine formula for coordinates $(\phi_1, \lambda_1)$ and $(\phi_2, \lambda_2)$ with mean Earth radius $R = 6,371,000\,\text{m}$ is:
$$\Delta\phi = \phi_2 - \phi_1, \quad \Delta\lambda = \lambda_2 - \lambda_1$$
$$a = \sin^2\left(\frac{\Delta\phi}{2}\right) + \cos(\phi_1)\cos(\phi_2)\sin^2\left(\frac{\Delta\lambda}{2}\right)$$
$$d_{\text{haversine}} = 2 R \arcsin\left(\sqrt{a}\right)$$

### 2.3 Euclidean Displacement
Net origin-to-destination displacement is the direct great-circle distance between the first and last observation:
$$L_{\text{net}}(T_i) = d_{\text{haversine}}(p_{i, 1}, p_{i, m_i})$$

### 2.4 Route Tortuosity Index (Circuity)
The spatial tortuosity $\tau(T_i)$ measures route detours relative to straight-line distance:
$$\tau(T_i) = \frac{S(T_i)}{L_{\text{net}}(T_i)}$$
For valid trajectories, $\tau(T_i) \ge 1.0$. Values approaching $1.0$ indicate direct arterial or highway travel, whereas values $\ge 1.8$ reflect local street routing or circuitous pathing.

---

## 3. Aggregate Cell Activity Metrics

For each cell $c \in \mathcal{H}_r$ over analysis window $\mathcal{W}$:

### 3.1 Trip Generation (Origins)
The count of trips departing from cell $c$:
$$O(c) = \sum_{T_i \in \mathcal{W}} \mathbb{I}\left(c(p_{i, 1}) = c\right)$$
where $\mathbb{I}(\cdot)$ is the indicator function and $c(p)$ maps a geographic coordinate to its containing H3 cell.

### 3.2 Trip Attraction (Destinations)
The count of trips terminating in cell $c$:
$$A(c) = \sum_{T_i \in \mathcal{W}} \mathbb{I}\left(c(p_{i, m_i}) = c\right)$$

### 3.3 Total Mobility Volume
Total volume reflects gross trip boundary activity:
$$V(c) = O(c) + A(c)$$

### 3.4 Net Flow Imbalance
The directional imbalance metric highlights net exporting versus net absorbing zones:
$$\Delta(c) = O(c) - A(c)$$
- $\Delta(c) > 0$: Net origin / trip-exporting zone (typical morning residential outflow).
- $\Delta(c) < 0$: Net destination / trip-attracting zone (typical employment center or commercial node).

---

## 4. Origin–Destination (OD) Flow Metrics

An OD pair $(c_o, c_d)$ represents directed movement from origin cell $c_o$ to destination cell $c_d$.

### 4.1 Flow Volume
The number of completed trips between $(c_o, c_d)$ within time period $\mathcal{W}$:
$$F(c_o, c_d) = \sum_{T_i \in \mathcal{W}} \mathbb{I}\left(c(p_{i, 1}) = c_o \land c(p_{i, m_i}) = c_d\right)$$

### 4.2 Average Flow Duration and Distance
$$\bar{D}(c_o, c_d) = \frac{1}{F(c_o, c_d)} \sum_{T_i \in \mathcal{W}_{c_o \to c_d}} D(T_i)$$
$$\bar{S}(c_o, c_d) = \frac{1}{F(c_o, c_d)} \sum_{T_i \in \mathcal{W}_{c_o \to c_d}} S(T_i)$$

---

## 5. Statistical Distributions and Percentiles

For a sample of continuous observations $X = \{x_1, x_2, \dots, x_N\}$ sorted in ascending order ($x_{(1)} \le x_{(2)} \le \dots \le x_{(N)}$):

### 5.1 Percentile Estimation (Linear Interpolation)
Percentiles $P_{10}, P_{25}, P_{50}, P_{75}, P_{90}, P_{95}, P_{99}$ are computed using NIST / NumPy linear interpolation (Type 7):
$$v = 1 + \frac{p}{100}(N - 1)$$
$$k = \lfloor v \rfloor, \quad f = v - k$$
$$P_p = (1 - f) x_{(k)} + f x_{(k+1)}$$

### 5.2 Mean and Standard Deviation
$$\mu = \frac{1}{N} \sum_{i=1}^N x_i, \quad \sigma = \sqrt{\frac{1}{N - 1} \sum_{i=1}^N (x_i - \mu)^2}$$

---

## 6. Temporal Conventions

### 6.1 Canonical Local Time
All source UTC timestamps $t_{\text{UTC}}$ are mapped to Pacific Local Time using the IANA timezone database (`America/Los_Angeles`):
$$t_{\text{local}} = \text{convert\_tz}(t_{\text{UTC}}, \text{"America/Los\_Angeles"})$$
During the December 2019 reference period, Pacific Standard Time (PST, UTC-8) applies uniformly across the dataset.

### 6.2 Hourly Buckets
Observations are assigned to 24 integer bins $h \in \{0, 1, \dots, 23\}$ corresponding to $[h:00:00, (h+1):00:00)$.

### 6.3 Day-of-Week Classification
- **Weekday**: Monday ($d=0$) through Friday ($d=4$).
- **Weekend**: Saturday ($d=5$) and Sunday ($d=6$).
