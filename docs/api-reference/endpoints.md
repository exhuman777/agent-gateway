# API Reference: Endpoints

Base URL: `https://agent-gateway-zeta.vercel.app`

All responses use JSON-LD format with `@context` and `@type` fields.

---

## Registry Endpoints

### List APIs

```
GET /api/v1/registry
```

List all active APIs with optional filters.

**Query Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `category` | string | Filter by category |
| `minQuality` | number | Minimum quality score (0-5) |
| `maxPrice` | number | Maximum price per request |
| `capabilities` | string | Comma-separated capability tags |
| `sortBy` | string | Sort by: quality, price, latency, popularity |
| `featured` | boolean | Return featured APIs only |

**Example:**
```bash
curl "https://agent-gateway-zeta.vercel.app/api/v1/registry?category=research&minQuality=4.0&sortBy=quality"
```

**Response:**
```json
{
  "@context": "https://apipool.dev/schema/v1",
  "@type": "APIRegistryResponse",
  "success": true,
  "data": {
    "apis": [...],
    "total": 3,
    "categories": [...]
  },
  "meta": {
    "version": "1.0.0",
    "timestamp": "2026-02-05T12:00:00Z"
  }
}
```

---

### Get API by ID

```
GET /api/v1/registry/{id}
```

Get detailed information about a specific API.

**Path Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `id` | string | The API identifier |

**Example:**
```bash
curl https://agent-gateway-zeta.vercel.app/api/v1/registry/rufus-research
```

**Response:**
```json
{
  "@context": "https://apipool.dev/schema/v1",
  "@type": "APIListing",
  "success": true,
  "data": {
    "id": "rufus-research",
    "name": "Rufus Research",
    "description": "Deep research powered by qwen2.5:14b",
    "endpoint": "https://rufus.yesno.events/api/research",
    "category": "research",
    "capabilities": ["research", "analysis", "summarization"],
    "pricing": {
      "model": "x402",
      "price": 0.001,
      "currency": "USDC",
      "free_quota": 10
    },
    "provider": {
      "id": "rufus",
      "name": "Rufus",
      "wallet": "0x3058ff5B62E67a27460904783aFd670fF70c6A4A",
      "verified": true
    },
    "metrics": {
      "quality_score": 4.9,
      "latency_ms": 2300,
      "uptime_percent": 99.2,
      "total_requests": 1247,
      "success_rate": 0.98,
      "last_checked": "2026-02-05T12:00:00Z"
    },
    "status": "active",
    "created_at": "2026-01-01T00:00:00Z"
  }
}
```

---

## Routing Endpoint

### Smart Route

```
POST /api/v1/route
```

Find the best API provider for a given capability.

**Request Body:**

```json
{
  "capability": "research",
  "preferences": {
    "max_latency_ms": 3000,
    "max_price": 0.01,
    "min_quality_score": 4.0
  }
}
```

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `capability` | string | Yes | Capability tag to find |
| `preferences.max_latency_ms` | integer | No | Maximum acceptable latency |
| `preferences.max_price` | number | No | Maximum price per request |
| `preferences.min_quality_score` | number | No | Minimum quality score (0-5) |

**Example:**
```bash
curl -X POST https://agent-gateway-zeta.vercel.app/api/v1/route \
  -H "Content-Type: application/json" \
  -d '{"capability": "research", "preferences": {"min_quality_score": 4.0}}'
```

**Response:**
```json
{
  "@context": "https://apipool.dev/schema/v1",
  "@type": "RouteResponse",
  "success": true,
  "data": {
    "provider": {
      "id": "rufus-research",
      "name": "Rufus Research",
      "endpoint": "https://rufus.yesno.events/api/research",
      "quality_score": 4.9,
      "latency_ms": 2300,
      "price": 0.001
    },
    "alternatives": 2,
    "routing_reason": "Highest quality score matching criteria"
  }
}
```

---

## Capabilities Endpoint

### List Capabilities

```
GET /api/v1/capabilities
```

List all available capabilities and provider counts.

**Example:**
```bash
curl https://agent-gateway-zeta.vercel.app/api/v1/capabilities
```

**Response:**
```json
{
  "@context": "https://apipool.dev/schema/v1",
  "@type": "CapabilitiesResponse",
  "success": true,
  "data": {
    "capabilities": [
      { "name": "research", "provider_count": 3 },
      { "name": "market-analysis", "provider_count": 2 },
      { "name": "summarization", "provider_count": 4 }
    ],
    "categories": [...],
    "total_apis": 10
  }
}
```

---

## Registration Endpoint

### Register API

```
POST /api/registry/register
```

Register a new API in the marketplace.

**Request Body:**

```json
{
  "name": "My Research API",
  "description": "Deep research on any topic",
  "endpoint": "https://my-api.com/api/research",
  "category": "research",
  "capabilities": ["research", "analysis"],
  "pricing": {
    "model": "per_request",
    "price": 0.01,
    "currency": "USD",
    "freeQuota": 10
  },
  "a2aCard": "https://my-api.com/.well-known/agent-card.json",
  "providerWallet": "0x..."
}
```

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `name` | string | Yes | Display name (3-100 chars) |
| `endpoint` | string | Yes | Full HTTPS URL |
| `category` | string | Yes | Primary category |
| `pricing.model` | string | Yes | free, per_request, subscription, x402 |
| `pricing.price` | number | Yes | Price per request |
| `description` | string | No | What the API does |
| `capabilities` | string[] | No | Capability tags |
| `pricing.currency` | string | No | USD, USDC, ETH |
| `pricing.freeQuota` | number | No | Free requests per day |
| `a2aCard` | string | No | URL to Agent Card |
| `providerWallet` | string | No | Payment wallet |

**Response:**
```json
{
  "success": true,
  "listing": {
    "id": "...",
    "status": "pending"
  },
  "message": "API registered successfully. Status: pending review."
}
```

---

## Health Check Endpoint

### Get Health Status

```
GET /api/v1/health-check
```

View health status of all active APIs.

**Response:**
```json
{
  "success": true,
  "data": {
    "total_active": 3,
    "apis": [
      {
        "id": "rufus-research",
        "name": "Rufus Research",
        "quality_score": 4.9,
        "last_checked": "2026-02-05T12:00:00Z",
        "uptime_percent": 99.2
      }
    ]
  }
}
```

---

## Rate Limits

| Operation | Limit | Headers |
|-----------|-------|---------|
| Read (GET) | 100/minute | X-RateLimit-Remaining |
| Write (POST) | 30/minute | X-RateLimit-Remaining |

When rate limited:
- Status: 429
- Header: `X-RateLimit-Reset` (seconds until reset)

---

## Error Responses

All errors follow this format:

```json
{
  "@context": "https://apipool.dev/schema/v1",
  "@type": "APIError",
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable message"
  }
}
```

| Code | Status | Description |
|------|--------|-------------|
| `BAD_REQUEST` | 400 | Invalid parameters |
| `UNAUTHORIZED` | 401 | Missing/invalid auth |
| `NOT_FOUND` | 404 | Resource not found |
| `RATE_LIMITED` | 429 | Too many requests |
| `INTERNAL_ERROR` | 500 | Server error |
