# Multi-Tier Cache Observatory for a Live Product Catalog API

## Overview

This project demonstrates a production-inspired multi-tier caching architecture for a high-traffic product catalog API. The system uses:

* L1 In-Memory Cache (per application instance)
* L2 Distributed Redis Cache
* PostgreSQL Database
* Cache Stampede Protection
* Real-Time Observability Dashboard

The architecture simulates a distributed environment using two API instances behind a shared Redis cache and PostgreSQL database.

---

## Architecture

### Components

#### API Instances

* app-1
* app-2

Each instance maintains its own private L1 cache.

#### Redis (L2 Cache)

A shared distributed cache used by both API instances.

#### PostgreSQL

Primary persistent data store containing 50,000+ product records.

#### Frontend Dashboard

React-based observability dashboard displaying cache metrics and performance data.

---

## Request Flow

### Cache Miss Flow

1. Client requests a product.
2. API checks L1 cache.
3. If L1 miss, API checks Redis.
4. If Redis miss, API queries PostgreSQL.
5. Data is stored in Redis.
6. Data is stored in L1 cache.
7. Response is returned to the client.

### L2 Cache Hit Flow

1. Product requested from app-1.
2. Data stored in Redis.
3. Same product requested from app-2.
4. app-2 misses L1.
5. app-2 retrieves data from Redis.
6. Database is not queried.

---

## Cache Strategy

### L1 Cache

* In-memory cache
* Fastest access layer
* Private to each API instance
* Configurable TTL
* Configurable max size

### L2 Cache

* Redis distributed cache
* Shared across API instances
* Reduces database load
* Configurable TTL

### Database Layer

* PostgreSQL
* Stores product catalog
* Uses pg_stat_statements for query observability

---

## Cache Stampede Protection

A Redis-based mutex lock is used to prevent multiple concurrent requests from querying the database for the same uncached product.

### Process

1. First request acquires Redis lock.
2. Other requests wait.
3. First request fetches data from PostgreSQL.
4. Cache is populated.
5. Lock is released.
6. Waiting requests read from cache.

### Verification

A stampede simulation endpoint generates multiple concurrent requests and ensures only one database query occurs.

---

## Features

### Backend

* Express.js API
* PostgreSQL integration
* Redis integration
* L1 cache
* L2 cache
* Metrics collection
* Health checks
* Cache stampede protection

### Frontend

* React dashboard
* Live metrics polling
* L1 hit ratio chart
* L2 hit ratio chart
* Latency chart
* Request waterfall display

---

## API Endpoints

### Health Check

GET /health

Response:

```json
{
  "status": "healthy"
}
```

### Get Product

GET /api/products/:productId

### Metrics

GET /api/metrics

### Detailed Metrics

GET /api/metrics/detailed

### Stampede Simulation

POST /api/simulate/stampede

Request:

```json
{
  "productId": 500,
  "concurrentRequests": 50
}
```

---

## Metrics Collected

* total_requests
* l1_hits
* l1_misses
* l2_hits
* l2_misses
* db_queries
* average_latency
* recent_latencies

---

## Docker Services

### postgres-db

PostgreSQL database service.

### redis-cache

Redis cache service.

### app-1

API instance 1.

### app-2

API instance 2.

### frontend

React dashboard.

---

## Environment Variables

```env
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
POSTGRES_DB=product_catalog

DATABASE_URL=postgresql://postgres:postgres@db:5432/product_catalog

REDIS_HOST=cache
REDIS_PORT=6379

PORT=8000

L1_CACHE_TTL=60
L1_CACHE_MAX_SIZE=1000

L2_CACHE_TTL=300
```

---

## Setup

### Clone Repository

```bash
git clone <repository-url>
cd live-product-cache-observatory
```

### Start Application

```bash
docker-compose up --build -d
```

### Verify Containers

```bash
docker ps
```

### Open Dashboard

```text
http://localhost:3000
```

### API Endpoints

```text
http://localhost:8001
http://localhost:8002
```

---

## Database Seeding

The PostgreSQL database is automatically seeded during initialization.

Dataset size:

* 50,000+ products

---

## Validation Performed

* Docker services start successfully
* PostgreSQL seeded with 50,000+ records
* pg_stat_statements enabled
* Product endpoint operational
* Health endpoint operational
* Metrics endpoint operational
* L1 cache verified
* L2 cache verified
* Redis population verified
* Stampede protection verified
* Frontend dashboard operational
* Required testing attributes present

---

## Technologies Used

### Backend

* Node.js
* Express.js
* PostgreSQL
* Redis

### Frontend

* React
* Chart.js
* React ChartJS 2

### DevOps

* Docker
* Docker Compose

---
