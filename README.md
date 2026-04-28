# Water Consumption Analytics Platform

> A cloud-native distributed system for utility data processing, IoT analytics, and water tanker marketplace operations.

---

## Table of Contents

1. [Overview](#overview)
2. [Architecture](#architecture)
   - [High-Level Deployment Diagram](#high-level-deployment-diagram)
   - [Microservices & Route Mapping](#microservices--route-mapping)
3. [Key Design Decisions](#key-design-decisions)
4. [Tech Stack](#tech-stack)
5. [Architectural Patterns Applied](#architectural-patterns-applied)
6. [Project Structure](#project-structure)
7. [Local Setup & Development Guide](#local-setup--development-guide)
   - [Prerequisites](#prerequisites)
   - [Step 1: Clone & Configure](#step-1-clone--configure)
   - [Step 2: Start All Backend Services](#step-2-start-all-backend-services)
   - [Step 3: Seed the Databases](#step-3-seed-the-databases)
   - [Step 4: Trigger Spark Analytics Run](#step-4-trigger-spark-analytics-run)
   - [Step 5: Start the Frontend](#step-5-start-the-frontend)
   - [Step 6: Access Services](#step-6-access-services)
   - [Step 7: Grafana Quick Guide](#step-7-grafana-quick-guide)
   - [Step 8: Tests & Quality Checks](#step-8-tests--quality-checks)
8. [CI/CD Pipeline — Jenkins + SonarQube](#cicd-pipeline--jenkins--sonarqube)
   - [Start the CI/CD Stack](#1-start-the-cicd-stack)
   - [Install Required Jenkins Plugins](#2-install-required-jenkins-plugins)
   - [Connect Jenkins to SonarQube](#3-connect-jenkins-to-sonarqube)
   - [Configure SonarQube Scanner Tool](#4-configure-sonarqube-scanner-tool)
   - [Create the Pipeline Job](#5-create-the-pipeline-job)
   - [Run the Pipeline](#6-run-the-pipeline)
   - [Verify SonarQube Results](#7-verify-sonarqube-results)
9. [Teardown](#teardown)
10. [Test Credentials](#test-credentials)

---

## Overview

The **Water Consumption Analytics Platform** is a cloud-native system built around two fundamentally different workload profiles:

- **Transactional workloads** — low-latency, user-facing operations: authentication, water tanker booking, Stripe payments, and a gamified eco-challenges community system.
- **Analytical workloads** — high-throughput, scheduled batch processing of IoT sensor data for per-unit consumption aggregation, anomaly detection, and conservation reporting.

The system was deliberately refactored from a monolith into **five independent Flask microservices** sitting behind an **Nginx API Gateway**. This separation ensures that a long-running Spark analytics job cannot degrade API response times, that individual services can be deployed and scaled independently, and that failures are blast-radius contained.

The platform additionally acts as a **marketplace layer** between water tanker operators (suppliers) and residential society administrators — handling real-money payment flows via Stripe and a full order lifecycle state machine.

---

## Architecture

### High-Level Deployment Diagram

```
                          +---------------------------+
                          |      User Browser         |
                          |   (React + Vite frontend) |
                          +-------------+-------------+
                                        | HTTPS
                                        v
                          +---------------------------+
                          |    Nginx API Gateway      |
                          |       Port :5001          |
                          |  (single public ingress)  |
                          +--+---+---+---+------------+
                             |   |   |   |
             +---------------+   |   |   +-------------------+
             |                   |   |                       |
             v                   v   v                       v
     +-------+------+   +--------+-+ +-+--------+  +--------+------+
     | Auth Service |   | Supplier | | Booking  |  | Gamification  |
     | :5002        |   | Service  | | Service  |  | Service :5005 |
     +-------+------+   | :5003    | | :5004    |  +--------+------+
             |          +----+-----+ +----+-----+           |
             |               |            |                 |
             +-------+-------+------------+-----------------+
                     |
                     v
          +----------+-----------+
          |   IoT Analytics Svc  |
          |       :5006          |
          +----------+-----------+
                     |
       +-------------+-------------+
       |                           |
       v                           v
+------+-------+        +----------+---------+
| PostgreSQL   |        |  Redis (shared)    |
| 5 logical    |        |  session + cache   |
| databases    |        +--------------------+
+--------------+
       ^
       |
+------+-------------------------------+
|  Apache Spark (ephemeral ECS Task)  |
|  Triggered by EventBridge (3x/day)  |
|  Reads: S3 / parquet                |
|  Writes: iot_db (PostgreSQL)        |
+-------------------------------------+
       ^
       |
+------+------+
| IoT Sensor  |
| Raw Data    |
| (S3/parquet)|
+-------------+

+-------------------+     +-----------------+
| Prometheus        |<----| Flask /metrics  |
| (+ redis metrics) |     | (all services)  |
+---------+---------+     +-----------------+
          |
          v
     +----+----+
     | Grafana |
     | :3000   |
     +---------+
```

**Data flow summary:**

1. IoT sensors write raw consumption records to S3 as Parquet files.
2. AWS EventBridge triggers the Spark ECS Task on a cron schedule (3× daily).
3. Spark reads from S3, aggregates consumption by unit/society/time window, and detects anomalies.
4. Aggregated results are written back to `iot_db` (PostgreSQL).
5. The IoT Analytics Service serves pre-aggregated data to the frontend — hot queries hit Redis with sub-millisecond latency.
6. All public traffic enters through the Nginx gateway, which routes by path prefix to the correct microservice.

---

### Microservices & Route Mapping

**1. Auth Service** (`/auth/*`) — Port 5002
- `GET  /` `GET /ping`
- `POST /register` `POST /login`
- `GET|PUT /profile`

**2. Supplier Service** (`/supplier/*`) — Port 5003
- `GET  /suppliers`
- `POST /tankers` `GET /tankers/owner` `PUT /tankers/<id>` `DELETE /tankers/<id>` `PATCH /tankers/<id>/status`
- `GET  /owner/dashboard` `GET /owner/earnings`

**3. Booking Service** (`/bookings/*`) — Port 5004
- `POST /book_tanker` `GET /track_order/<id>` `PUT /update_order/<id>`
- `POST /bookings` `GET /bookings/owner` `PATCH /bookings/<id>/status`
- `POST /society_bulk_order`
- `POST /create-payment-intent`

**4. IoT Analytics Service** (`/analytics/*`) — Port 5006
- `POST /log_reading`
- `GET  /consumption_report` `GET /society_dashboard` `GET /conservation_summary`

**5. Gamification Service** (`/gamification/*`) — Port 5005
- `GET  /conservation_tips` `GET /challenges`
- `POST /start_challenge/<id>` `GET /user_challenges` `PUT /update_challenge_progress/<id>`
- `GET|POST /community/broadcasts`
- `GET|POST /community/threads` `GET|POST /community/threads/<id>/comments`

---

## Key Design Decisions

These decisions are deliberate and defensible. Each one involves a trade-off worth understanding.

---

### Why microservices over a monolith?

The transactional API layer and the analytical batch layer have fundamentally opposing SLA requirements. The API must respond in milliseconds; Spark jobs process potentially millions of IoT records and run for minutes. A monolith would force them to share CPU, memory, and deployment lifecycle, risking latency spikes during batch runs.

Splitting into five services also enforces **domain ownership by capability**: auth, supplier management, booking/payments, gamification, and IoT analytics are each independently deployable. A bug in the gamification service cannot take down the booking flow. The blast radius of any failure is bounded.

The trade-off is operational overhead — more containers, more network calls between services, and distributed tracing complexity. At current scale, this is manageable; the isolation benefit outweighs the cost.

---

### Why an Nginx API Gateway over direct service exposure?

The gateway provides a **single public ingress** on port 5001 and handles path-based routing to the correct microservice. This means the frontend only ever talks to one host, regardless of how many services exist behind it.

Beyond routing, the gateway is the right place to add cross-cutting concerns: request correlation ID generation and propagation (`X-Correlation-ID`), rate limiting, SSL termination, and future authentication middleware — without modifying individual service code.

The alternative (exposing five service ports directly) would leak internal topology to the frontend, complicate CORS configuration, and make future service restructuring a breaking change for clients.

---

### Why a dedicated database per service?

Each service owns its own schema/database (`auth_db`, `supplier_db`, `booking_db`, `gamification_db`, `iot_db`). This is the foundational rule of microservice data ownership: no service reads another service's database directly.

Cross-service data requirements are resolved via **inter-service HTTP APIs**. This enforces explicit contracts, allows each service to evolve its schema independently, and prevents tight coupling through shared table references.

The trade-off is that joins across service boundaries become HTTP calls — adding latency and failure surface. For the current workload, these cross-service calls are infrequent enough that this is not a problem. At higher scale, introducing an event bus (Kafka) for asynchronous data propagation would be the natural evolution.

---

### Why Redis as a shared infrastructure service (not a sidecar)?

In an earlier monolith iteration, Redis ran as a sidecar container inside the same ECS Task as the Flask API, communicating over `localhost`. This eliminated inter-container network latency on the session cache hot path.

In the microservices architecture, a single Redis sidecar per service would create five isolated cache islands. Any cross-service session or shared data would require duplication or an extra HTTP call. Running Redis as a **shared infrastructure service** allows all five services to share session state, rate-limit counters, and hot query caches from a single well-managed instance.

The latency trade-off (a network hop vs. localhost) is minimal at intra-Docker-network speeds (~0.1ms), and the operational simplicity gain is significant.

---

### Why AWS ECS Fargate for container hosting?

Fargate was chosen over raw EC2 to eliminate instance provisioning and OS patching overhead, while retaining full container-level control. Lambda was ruled out because Spark jobs exceed Lambda's maximum execution duration and memory limits — Lambda is suited to stateless, sub-15-minute invocations.

Fargate provides the right middle ground: serverless infrastructure management with support for long-running, memory-intensive containers.

---

### Why ephemeral Spark over a persistent cluster?

Running a persistent Spark cluster 24/7 would be cost-prohibitive for batch workloads that only run three times a day. The right model is: spin up compute, process data, write results, terminate.

AWS EventBridge triggers the Spark ECS Task on a cron schedule. The container reads from S3, aggregates IoT readings, writes aggregated output to `iot_db`, and exits. Infrastructure cost is strictly proportional to actual processing time. A future evolution would trigger Spark on S3 event notifications (new file arrivals) rather than a fixed schedule, eliminating the latency between data arrival and analysis.

---

### Why PostgreSQL (RDS) as the primary store?

PostgreSQL offers ACID guarantees, strong ORM support via SQLAlchemy, and sufficient analytical query performance for current data volumes. The API services perform OLTP operations (point reads, small writes); the Spark job performs OLAP writes (bulk aggregated inserts).

Both workloads targeting the same RDS instance avoids maintaining a separate analytics store and simplifies the data model. The trade-off is query isolation — a heavy analytical write could compete with transactional reads. For current scale this is acceptable. The clear evolution path is read replicas for the API tier, or a dedicated data warehouse (Redshift) for heavier analytics.

---

### Why JWT for authentication?

JWT tokens are stateless — the server does not need to store session state to validate them. This means any instance of any service can validate a token without a database or session store lookup, which is essential for horizontal scaling. The trade-off is that token revocation requires a blocklist (or short expiry), which is an acceptable constraint for this use case.

---

## Tech Stack

| Layer | Technology | Rationale |
|---|---|---|
| Frontend | React + TypeScript + Vite | Fast dev server, type safety, zero-config bundling |
| API Gateway | Nginx | Path-based routing, single ingress, correlation ID injection |
| Microservices | Python / Flask (×5) | Lightweight, fits team familiarity, independently deployable |
| Auth | JWT (JSON Web Tokens) | Stateless — scales horizontally without session affinity |
| Payments | Stripe API | PCI compliance out of the box, fractional currency handling |
| Cache | Redis (shared infrastructure) | Sub-millisecond session and query caching across all services |
| Primary DB | PostgreSQL 13 (5 logical DBs) | ACID compliance, strong ORM support via SQLAlchemy |
| Batch Analytics | Apache Spark (PySpark) | Distributed processing for large IoT datasets |
| Containerization | Docker + Docker Compose | Environment parity between local dev and cloud |
| IaC | Terraform | Reproducible, version-controlled AWS infrastructure |
| CI/CD | Jenkins + SonarQube + Pytest | Automated test, quality gate, and security scan pipeline |
| Monitoring | Prometheus + Grafana | Real-time metrics and alerting across all services |

---

## Architectural Patterns Applied

**API Gateway Pattern** — Nginx acts as the single public ingress point. All client traffic enters on port 5001 and is routed by path prefix to the correct microservice. This decouples the frontend from internal service topology and provides a centralized location for cross-cutting concerns.

**Database per Service** — Each microservice owns its own PostgreSQL database. No service reads another's database directly. Cross-service data is accessed via explicit HTTP APIs, enforcing bounded context and preventing schema coupling.

**Shared Infrastructure for Cross-Cutting Services** — Redis runs as an independent shared service rather than per-service sidecars. This allows all microservices to share session state and cache without data duplication, while still being independently scalable from the application tier.

**Decoupled Compute** — The API services and the Spark analytics pipeline are entirely independent. A Spark job failure does not affect API availability. Neither workload can starve the other of CPU or memory.

**Ephemeral Batch Processing** — Spark compute is provisioned only when needed. EventBridge triggers the ECS Task on a cron schedule; the container exits after completion. Infrastructure costs remain proportional to actual workload.

**Correlation ID Propagation** — The Nginx gateway injects an `X-Correlation-ID` header on every inbound request, which services propagate to their own logs and to any inter-service HTTP calls. This enables end-to-end request tracing across service boundaries without a full distributed tracing system.

---

## Project Structure

```
.
├── README.md
├── docker-compose.yml               # Full local dev environment
├── docker-compose.cicd.yml          # Jenkins + SonarQube CI/CD stack
├── prometheus.yml                   # Prometheus scrape config
│
├── backend/
│   ├── api_gateway/
│   │   └── nginx.conf               # Path routing, correlation ID, upstream config
│   ├── auth_service/                # JWT auth, user registration, profile
│   ├── supplier_service/            # Tanker management, owner dashboard
│   ├── booking_service/             # Order lifecycle, Stripe payment intents
│   ├── gamification_service/        # Challenges, community broadcasts, threads
│   ├── iot_analytics_service/       # IoT reading ingestion, consumption reports
│   ├── db_init/
│   │   └── 01-create-databases.sql  # Creates 5 logical databases on first boot
│   ├── populate_db.py               # Seed script: users, societies, tankers, challenges
│   ├── Jenkinsfile                  # CI/CD pipeline definition
│   ├── sonar-project.properties     # SonarQube project config
│   └── tests/
│       ├── conftest.py
│       └── test_business_logic.py
│
├── analytics/
│   ├── Dockerfile
│   ├── process_data.py              # PySpark: read parquet, aggregate, write to iot_db
│   └── requirements.txt
│
├── frontend/                        # React + Vite client
│
├── grafana/
│   ├── dashboards/                  # Pre-built dashboard JSON
│   └── provisioning/                # Auto-provisioned datasources
│
├── data/                            # Shared volume: raw IoT parquet files
└── spark_libs/
    └── postgresql-42.7.8.jar        # JDBC driver for Spark → PostgreSQL writes
```

---

## Local Setup & Development Guide

### Prerequisites

- Docker + Docker Compose (daemon must be running)
- Python 3.11+
- Node.js 18+
- PowerShell 7+ (Windows) or Bash (Mac/Linux)

---

### Step 1: Clone & Configure

```bash
git clone <your-repo-url>
cd <your-repo-folder>
```

Create `backend/.env`:

```env
SECRET_KEY=change-me
JWT_SECRET_KEY=change-me-at-least-32-chars
STRIPE_SECRET_KEY=sk_test_your_stripe_test_key
INTERNAL_SERVICE_TOKEN=internal-dev-token
```

Create `frontend/.env`:

```env
VITE_API_BASE_URL=http://localhost:5001
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_your_key
```

---

### Step 2: Start All Backend Services

If you have data from an older monolith version, do a full reset first:

```bash
docker compose down -v
```

Then build and start:

```bash
docker compose up -d --build
docker ps    # verify all containers are healthy
```

This starts: PostgreSQL (with 5 logical DBs), Redis, all 5 Flask microservices, Nginx gateway, Spark Master + Worker, Prometheus, and Grafana.

---

### Step 3: Seed the Databases

> ⚠️ The old `docker exec -it water_mgmt_backend python populate_db.py` command no longer works — the monolith container does not exist. Use the dedicated seeder instead.

First run (or after code changes):

```bash
docker compose --profile tools run --rm --build db_seeder
```

Subsequent runs:

```bash
docker compose --profile tools run --rm db_seeder
```

This runs `backend/populate_db.py` inside an isolated seeder container and populates all five databases: `auth_db`, `supplier_db`, `booking_db`, `gamification_db`, and `iot_db`.

---

### Step 4: Trigger Spark Analytics Run

```bash
# Linux / Mac
docker exec -it spark_master /opt/spark/bin/spark-submit \
  --master spark://spark-master:7077 \
  --jars /opt/spark/jars_external/postgresql-42.7.8.jar \
  /opt/analytics/process_data.py

# Windows PowerShell
docker exec -it spark_master /opt/spark/bin/spark-submit `
  --master spark://spark-master:7077 `
  --jars /opt/spark/jars_external/postgresql-42.7.8.jar `
  /opt/analytics/process_data.py
```

This simulates the EventBridge-triggered batch job. Reads Parquet files from `data/raw/water_readings`, aggregates IoT metrics, and writes results to `iot_db`.

---

### Step 5: Start the Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend runs at `http://localhost:5173` by default and proxies API calls to the Nginx gateway at `http://localhost:5001`.

---

### Step 6: Access Services

| Service | URL | Notes |
|---|---|---|
| API Gateway | `http://localhost:5001` | All backend API routes |
| Prometheus | `http://localhost:9090` | Metrics scraping |
| Grafana | `http://localhost:3000` | Login: `admin` / `admin` |
| Spark UI | `http://localhost:8080` | Master dashboard |

---

### Step 7: Grafana Quick Guide

Grafana is **pre-provisioned** from `grafana/provisioning` and `grafana/dashboards` — no manual datasource setup required on first boot.

- Datasource: Prometheus at `http://prometheus:9090` (auto-configured)
- Default dashboard: **Water Platform — Microservices Overview** (auto-loaded)

For custom panels, useful PromQL queries:

```promql
# Request rate per service
sum by (job) (rate(flask_http_request_total[5m]))

# 95th percentile latency per service
histogram_quantile(0.95, sum by (le, job) (rate(flask_http_request_duration_seconds_bucket[5m])))

# Error rate per service
sum by (job) (rate(flask_http_request_exceptions_total[5m]))

# Total requests in last hour
sum(increase(flask_http_request_total[1h]))

# Redis memory and connections
redis_memory_used_bytes
redis_connected_clients
rate(redis_commands_processed_total[5m])
```

---

### Step 8: Tests & Quality Checks

**Backend:**

```bash
python -m pip install pytest
python -m pytest backend/tests -q

# Compile all 5 service packages (catches import errors)
python -m compileall backend/auth_service \
  backend/supplier_service \
  backend/booking_service \
  backend/gamification_service \
  backend/iot_analytics_service
```

**Frontend:**

```bash
cd frontend
npx tsc -p tsconfig.app.json --noEmit    # type-check
npm run build                             # production build check
```

**Linting & Security (backend):**

```bash
cd backend
pip install flake8 bandit pytest-cov
flake8 .                                                   # style and lint
bandit -r .                                                # security scan
pytest tests/ -v --cov=. --cov-report=xml                 # generates coverage.xml for SonarQube
```

---

## CI/CD Pipeline — Jenkins + SonarQube

The project ships with a fully containerized local CI/CD environment. On push, Jenkins uses `backend/Jenkinsfile` to: install dependencies per service, compile all 5 service packages, run the Pytest suite, and submit a `coverage.xml` report to SonarQube for quality gate evaluation.

---

### 1. Start the CI/CD Stack

```bash
docker compose -f docker-compose.cicd.yml up -d
```

| Service | URL |
|---|---|
| Jenkins | `http://localhost:8081` |
| SonarQube | `http://localhost:9000` |

---

### 2. Install Required Jenkins Plugins

On first boot, navigate to **Jenkins → Manage Jenkins → Plugins** and install:

- **Pipeline**
- **Git**
- **Docker Pipeline**
- **SonarQube Scanner**
- **Credentials Binding**

Unlock Jenkins on first run using the initial admin password:

```bash
docker exec -it water_cicd_jenkins cat /var/jenkins_home/secrets/initialAdminPassword
```

---

### 3. Connect Jenkins to SonarQube

**In SonarQube** (`http://localhost:9000`):

1. Log in (`admin` / `admin`).
2. Go to **My Account → Security → Generate Token**.
3. Copy the generated token.

**In Jenkins** (`http://localhost:8081`):

1. Go to **Manage Jenkins → Credentials → System → Global → Add Credentials**.
   - Kind: **Secret text**
   - Secret: *(paste Sonar token)*
   - ID: `sonar-token`
2. Go to **Manage Jenkins → System → SonarQube Servers → Add SonarQube**.
   - Name: `SonarQube`
   - Server URL: `http://host.docker.internal:9000`
   - Server authentication token: `sonar-token`

> `host.docker.internal` resolves to the Docker host from inside a container, bridging Jenkins to the SonarQube container on your machine.

---

### 4. Configure SonarQube Scanner Tool

Go to **Manage Jenkins → Tools → SonarQube Scanner installations → Add**:

- Name: `SonarQubeScanner`
- ✅ Install automatically — latest version

---

### 5. Create the Pipeline Job

1. **New Item → Pipeline**
2. Name: `water-platform-ci`
3. Under **Pipeline**:
   - Definition: **Pipeline script from SCM**
   - SCM: **Git**
   - Repository URL: *(your repo URL)*
   - Branch specifier: `*/main` (or your branch)
   - Script Path: `backend/Jenkinsfile`
4. **Save**

**Optional deploy stage:** To add deployment after tests pass, append a final stage to your `Jenkinsfile`:

```groovy
stage('Deploy') {
    steps {
        sh 'docker compose up -d --build'
        sh 'docker compose --profile tools run --rm db_seeder'
    }
}
```

---

### 6. Run the Pipeline

- Open the `water-platform-ci` job.
- Click **Build Now**.
- Open **Console Output** and verify:
  - All 5 service packages compile cleanly
  - Backend tests pass
  - Frontend TypeScript build passes
  - `sonar-scanner` executes and submits results

---

### 7. Verify SonarQube Results

In SonarQube (`http://localhost:9000`), open the `water-conservation-app` project and confirm:

- Latest analysis timestamp is updated
- Code smells, bugs, and vulnerability counts are visible
- Quality gate status is shown (pass/fail)

---

## Teardown

```bash
# Stop and remove containers (keep volumes)
docker compose down

# Full reset — wipe all data volumes
docker compose down -v

# Shut down CI/CD environment
docker compose -f docker-compose.cicd.yml down -v
```

---

## Test Credentials

**Resident User**

```
Username: john_1
Password: pass123
```

**Tanker Owner**

```
Username: owner_raj
Password: owner123
```