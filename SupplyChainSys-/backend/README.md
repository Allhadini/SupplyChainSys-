# 🚀 Atlas-Logix — AI-Powered Smart Supply Chain Optimization Platform

> Production-grade backend for a scalable AI logistics platform.  
> Think **Uber Freight** × **Palantir Supply Intelligence**.

---

## 📐 Architecture

```
User → React Dashboard
         ↓
   API Gateway (Express)
         ↓
   ┌─────────────────────────────────────┐
   │  Shipment Service                   │
   │  AI Risk Service (→ Python FastAPI) │
   │  Optimization Service (→ Python)    │
   │  Alert Service                      │
   │  Stream Service (Kafka simulation)  │
   └─────────────────────────────────────┘
         ↓
   MongoDB  ·  Redis  ·  Kafka
```

---

## 📁 Project Structure

```
backend/
├── src/
│   ├── config/          # DB, Redis, Kafka connections
│   ├── controllers/     # Thin request handlers
│   ├── routes/          # Express route definitions
│   ├── models/          # Mongoose schemas
│   ├── services/        # Core business logic
│   ├── middleware/      # Auth, error handling, async wrapper
│   ├── utils/           # Logger, constants
│   └── server.js        # Entry point + bootstrap
├── .env.example
├── package.json
└── README.md
```

---

## ⚡ Quick Start

### 1. Prerequisites

| Dependency | Required | Notes |
|------------|----------|-------|
| **Node.js** | ✅ v18+ | Runtime |
| **MongoDB** | ✅ | Local or Atlas cloud |
| **Redis** | ⚠️ Optional | App degrades gracefully without it |
| **Kafka** | ⚠️ Optional | Simulated mode when unavailable |

### 2. Install Dependencies

```bash
cd backend
npm install
```

### 3. Configure Environment

```bash
cp .env.example .env
# Edit .env with your local connection strings
```

### 4. Start MongoDB

```bash
# Using mongod directly
mongod --dbpath /data/db

# Or using Docker
docker run -d -p 27017:27017 --name atlas-mongo mongo:7
```

### 5. Start Redis (Optional)

```bash
# Using Docker
docker run -d -p 6379:6379 --name atlas-redis redis:7-alpine
```

### 6. Run the Server

```bash
# Development (with hot reload)
npm run dev

# Production
npm start
```

You should see:

```
═══════════════════════════════════════════════
  🚀 Atlas-Logix API Gateway
  🌐 http://localhost:5000
  📡 Environment: development
  🔑 Dev token:   GET /api/auth/token
  💚 Health:      GET /api/health
═══════════════════════════════════════════════
```

---

## 🔐 Authentication

All API routes are protected with **JWT Bearer tokens**.

### Register a User

```
POST http://localhost:5000/api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securepassword",
  "role": "admin",
  "company": "Logix Corp"
}
```

### Login

```
POST http://localhost:5000/api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "securepassword"
}
```

Response includes the `token`.

### Get Profile

```
GET http://localhost:5000/api/auth/profile
Authorization: Bearer <your-token>
```

### Get a Dev Token (Convenience)

---

## 🧪 Postman Testing Guide

### Step 1 — Get Auth Token

```
GET http://localhost:5000/api/auth/token
```

Copy the `token` value from the response.

---

### Step 2 — Create a Shipment

```
POST http://localhost:5000/api/shipments/create
Content-Type: application/json
Authorization: Bearer <token>

{
  "origin": "Mumbai",
  "destination": "Dubai",
  "currentLocation": { "lat": 19.0760, "long": 72.8777 },
  "route": [
    { "name": "Mumbai Port", "lat": 19.0760, "long": 72.8777 },
    { "name": "Arabian Sea Waypoint", "lat": 20.5, "long": 65.0 },
    { "name": "Dubai Port", "lat": 25.2048, "long": 55.2708 }
  ]
}
```

**Expected Response** (201):
```json
{
  "success": true,
  "data": {
    "_id": "...",
    "origin": "Mumbai",
    "destination": "Dubai",
    "status": "pending",
    "riskScore": 0,
    "createdAt": "..."
  }
}
```

---

### Step 3 — Get Enriched Shipment (Intelligent Workflow)

```
GET http://localhost:5000/api/shipments/<shipment_id>
Authorization: Bearer <token>
```

**Expected Enriched Response** (200):
```json
{
  "success": true,
  "data": {
    "shipment": { "...full shipment with updated risk..." },
    "riskScore": 0.82,
    "riskReason": "Weather disruption + congestion detected",
    "optimization": {
      "newRoute": ["..."],
      "cost": 1200,
      "delaySaved": "6 hours"
    },
    "alerts": [
      {
        "type": "risk_threshold",
        "severity": "high",
        "message": "Risk score 0.82 — Weather disruption..."
      }
    ]
  }
}
```

> **Note**: If `riskScore ≤ 0.7`, `optimization` will be `null` and `alerts` will be empty.

---

### Step 4 — Compute Standalone Risk Score

```
POST http://localhost:5000/api/ai/risk-score
Content-Type: application/json
Authorization: Bearer <token>

{
  "location": { "lat": 19.0760, "long": 72.8777 },
  "route": [
    { "name": "Mumbai Port" },
    { "name": "Dubai Port" }
  ]
}
```

---

### Step 5 — Optimize a Route

```
POST http://localhost:5000/api/optimize-route
Content-Type: application/json
Authorization: Bearer <token>

{
  "origin": "Mumbai",
  "destination": "Dubai",
  "currentRoute": [
    { "name": "Mumbai Port", "lat": 19.0760, "long": 72.8777 },
    { "name": "Dubai Port", "lat": 25.2048, "long": 55.2708 }
  ],
  "currentLocation": { "lat": 19.0760, "long": 72.8777 }
}
```

---

### Step 6 — List All Alerts

```
GET http://localhost:5000/api/alerts
Authorization: Bearer <token>
```

Supports query filters:
- `?shipmentId=<id>`
- `?severity=high`
- `?resolved=false`

---

### Step 7 — Create a Manual Alert

```
POST http://localhost:5000/api/alerts
Content-Type: application/json
Authorization: Bearer <token>

{
  "shipmentId": "<shipment_id>",
  "type": "weather",
  "severity": "critical",
  "message": "Cyclone warning in Arabian Sea corridor",
  "riskScore": 0.95
}
```

---

### Step 8 — Health Check (No Auth Required)

```
GET http://localhost:5000/api/health
```

---

## 🔄 Intelligent Workflow

When a shipment is fetched via `GET /api/shipments/:id`, the system automatically:

```
1. Fetch shipment from MongoDB
          ↓
2. Call AI Risk Service → compute riskScore
          ↓
3. Update shipment with risk data
          ↓
4. IF riskScore > 0.7:
   ├── Call Optimization Service → new route
   ├── Save optimized route to shipment
   └── Trigger alert (Redis pub/sub + Kafka)
          ↓
5. Return enriched response
```

---

## 🛠 Tech Stack

| Layer | Technology |
|-------|-----------|
| Runtime | Node.js (Express) |
| Database | MongoDB (Mongoose) |
| Cache | Redis (data + pub/sub) |
| Streaming | Kafka (KafkaJS) |
| Auth | JWT (jsonwebtoken) |
| Logging | Winston |
| AI Services | Python FastAPI (external) |
| HTTP Client | Axios |

---

## 📝 Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `PORT` | `5000` | Server port |
| `MONGO_URI` | `mongodb://localhost:27017/atlas_logix` | MongoDB connection |
| `REDIS_URL` | `redis://localhost:6379` | Redis connection |
| `KAFKA_BROKER` | `localhost:9092` | Kafka broker |
| `JWT_SECRET` | `supersecret` | JWT signing secret |
| `JWT_EXPIRES_IN` | `7d` | Token expiry |
| `AI_SERVICE_URL` | `http://localhost:8000` | Python AI service |
| `OPTIMIZATION_SERVICE_URL` | `http://localhost:9000` | Python optimizer |
| `RISK_THRESHOLD` | `0.7` | Auto-optimize threshold |

---

## 📄 License

MIT © Atlas-Logix Team
