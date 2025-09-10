# Vehicle Telemetry System 

> telemetry platform that collects car signals on an **STM32**, relays them via **Raspberry Pi 5**, **LTE Module **, persists on a server‑side database, and exposes data to a **frontend dashboard**.

---

## 0) Scope

**In‑scope (this document):** overall objectives, components, data flow, interfaces, environments, security/SLOs, and milestones.
**Out‑of‑scope (for now):** implementation code, config files, schemas, Docker/K8s manifests.

---

## Repo Map (current)

```
Telemetry-System-AAM/
├─ telemetry-backend/           # API + DB access (server writes/reads)
├─ telemetry_frontend/          # UI that fetches data from backend
├─ Server-side-fetch/           # Sync/commands between server ↔ Raspberry Pi
├─ assets _front/               # Frontend assets (suggest rename → assets_front)
├─ Graphes/                     # Legacy charts (suggest move → experiments/graphes)
├─ Temperature/                 # Legacy temp demo (suggest move → experiments/temperature)
├─ .gitattributes
└─ .gitignore
```

**Owner notes**

* *Server-side-fetch* is the service that pulls from the **server to the Raspberry Pi** (e.g., configs/commands) and can also be used for pushing buffered data upward.
* *telemetry-backend* and *telemetry\_frontend* together present data to users and read/write the database.

---

## 1) System Diagram

```mermaid
flowchart LR
  subgraph Vehicle
    MCU[STM32
(CAN/OBD‑II + Sensors)] -->|UART/CAN| RPI[Raspberry Pi 5
Edge Agent]
    GPS[GNSS] --> MCU
  end

  RPI -->|uplink (HTTPS/MQTT)| IN[Ingest Service]
  IN --> PROC[Processor / Normalizer]
  PROC --> DB[(Time‑Series DB)]
  PROC --> OBJ[(Object Store / Backups)]

  UI[Frontend Dashboard] <-- REST/SSE/WS --> API[Read API]
  API --> DB

  CTRL[Server‑Side Fetch/Control] <---> RPI
```

---

## 2) Objectives (Why this exists)

* Unified pipeline for **real‑time** and **historical** vehicle data.
* Clear interfaces between **firmware**, **edge**, **backend**, and **UI**.
* Production‑grade concerns: security, reliability, observability, maintainability.

---

## 3) Components & Responsibilities

### 3.1 STM32 (on‑vehicle acquisition)

* Read signals: **speed, fuel level, GPS, brakes, engine/motor health**, etc.
* Timestamp and package readings.
* Send frames to Raspberry Pi via **UART or CAN**.

### 3.2 Raspberry Pi 5 (edge agent)

* Ingest frames from STM32; basic validation and buffering.
* Uplink telemetry to server (store‑and‑forward when offline).
* Receive configs/commands from **Server‑side‑fetch** service (server→edge channel).

### 3.3 Server‑side‑fetch (control plane)

* Publishes configuration/OTA commands down to Pi.
* Optionally requests diagnostics or cached batches from edge.

### 3.4 Telemetry Backend (data plane)

* **Ingest**: authenticate, validate, and queue incoming batches.
* **Process**: normalize/enrich; persist to time‑series DB; archive raw.
* **Read API**: serve filtered queries and live streams to the frontend.

### 3.5 Frontend Dashboard (experience)

* Live tiles (Speed/RPM/Fuel/Brake), historical charts, trip map.
* Alerts and system health views.

---

## 4) High‑Level Data Flow

1. **Acquire**: STM32 samples signals at a fixed rate.
2. **Transfer**: Frames move to Raspberry Pi via UART/CAN.
3. **Edge Handling**: Pi validates, buffers if offline, and **uplinks** to server.
4. **Ingest → Process**: Server authenticates, normalizes, and writes to DB.
5. **Query/Stream**: Frontend fetches history and subscribes to live updates.
6. **Control**: Server‑side‑fetch delivers configs/commands to the Pi on demand.

---

## 5) Interfaces (no payloads yet; just contracts)

* **Edge Uplink Interface** → Endpoint/topic used by Pi to send batches to server.
* **Edge Control Interface** → Channel for server→Pi commands/config.
* **Read API** → Endpoints for dashboards to query metrics/time ranges and to subscribe to live updates.

> Final endpoint names and payload fields will be defined after signal list finalization.

---

## 6) Data Model (conceptual)

* **Vehicle**: id, vin, label.
* **Device**: id, type (stm32/pi), belongs\_to vehicle.
* **Telemetry Point**: vehicle\_id, timestamp, (speed, rpm, fuel, brake, gps, temps, voltages…).
* **Event/Alert**: vehicle\_id, timestamp, rule\_id, severity, message.
* **Trip**: vehicle\_id, start\_ts, end\_ts, summary stats.

> ERD and exact types to follow once signals are frozen.

---

## 7) Environments

* **Dev (local)**: single‑node DB + backend + UI.
* **Edge Lab**: Raspberry Pi in lab network for integration.
* **Prod**: cloud DB, horizontally scalable API, secured edge connectivity.

---

## 8) Security & Privacy (minimum bar)

* Mutual trust: device API keys/identities; rotate keys.
* Transport encryption end‑to‑end.
* Principle of least privilege for services and users.
* Data retention policy for raw vs. processed telemetry.

---

## 9) Reliability & Observability Targets

* **Ingest availability**: ≥ 99.9% (monthly).
* **End‑to‑end latency (edge→DB)**: p95 ≤ 5 s (online).
* **Backpressure handling**: store‑and‑forward with bounded buffers on Pi.
* **Visibility**: metrics for ingest success/failure, queue sizes, DB write rate; structured logs and trace IDs.

---

## 10) Milestones

* **M1 — Architecture Freeze**: finalize signals, interfaces, and ERD.
* **M2 — Vertical Slice**: one signal flows STM32 → Pi → DB → dashboard live tile.
* **M3 — Robust Edge**: offline buffering + retry + control channel verified.
* **M4 — Dashboards**: live map, charts, and alerting views.
* **M5 — Hardening**: security review, load test, backups, and SLO monitors.

---

## 11) Open Questions

* Exact **signal list & rates** per vehicle model?
* Preferred **uplink mode** (HTTPS batching vs. MQTT streaming) for prod?
* **Control payloads** (what configs/commands are needed day‑1)?
* Final **cloud provider** and DB choice (Timescale/Postgres vs. alternatives)?

---

### Next step from you

Share the definitive list of signals (names + units + expected ranges). I’ll update the diagram, interfaces, and the conceptual model to match, still without adding any code.
