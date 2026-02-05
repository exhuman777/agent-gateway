# Registry API

List, search, and register APIs in the marketplace.

## GET /api/v1/registry

List and search all registered APIs.

### Query Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| capability | string | Filter by capability tag |
| category | string | Filter by category |
| min_quality | number | Minimum quality score (0-5) |
| max_price | number | Maximum price per request |
| max_latency | number | Maximum latency in milliseconds |
| sort | string | Sort by: quality, price, latency, popularity |
| limit | number | Limit number of results |

### Example

```bash
curl "https://apipool.dev/api/v1/registry?capability=research&min_quality=4.0&limit=10"
```

### Response

```json
{
  "@context": "https://apipool.dev/schema/v1",
  "@type": "APIRegistryResponse",
  "success": true,
  "data": {
    "apis": [
      {
        "@type": "APIListing",
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
          "erc8004_id": 22742,
          "verified": true
        },
        "metrics": {
          "quality_score": 4.9,
          "latency_ms": 2300,
          "uptime_percent": 99.2,
          "total_requests": 1247,
          "success_rate": 0.98
        },
        "a2a_card": "https://rufus.yesno.events/.well-known/agent-card.json",
        "status": "active"
      }
    ],
    "total": 1,
    "categories": [
      { "name": "research", "count": 1 }
    ]
  }
}
```

## GET /api/v1/registry/:id

Get detailed information about a specific API.

```bash
curl https://apipool.dev/api/v1/registry/rufus-research
```

## POST /api/v1/registry

Register a new API in the marketplace.

### Request

```json
{
  "name": "My Research API",
  "description": "Deep research on any topic",
  "endpoint": "https://api.example.com/research",
  "category": "research",
  "capabilities": ["research", "analysis"],
  "pricing": {
    "model": "x402",
    "price": 0.001,
    "currency": "USDC",
    "freeQuota": 10
  },
  "a2aCard": "https://api.example.com/.well-known/agent-card.json",
  "providerWallet": "0x..."
}
```

### Required Fields

| Field | Type | Description |
|-------|------|-------------|
| name | string | API display name |
| description | string | What the API does |
| endpoint | string | Full URL of the API endpoint |
| category | string | Primary category |
| pricing | object | Pricing information |
| pricing.model | string | per_request, subscription, free, x402 |
| pricing.price | number | Price per request |
| pricing.currency | string | USD, USDC, ETH |

### Optional Fields

| Field | Type | Description |
|-------|------|-------------|
| capabilities | string[] | Capability tags |
| pricing.freeQuota | number | Free requests per day |
| a2aCard | string | URL to A2A agent card |
| providerWallet | string | Wallet for receiving payments |

### Categories

- research
- market-data
- image-gen
- code
- translation
- summarization
- embeddings
- web-scraping
- audio
- video
- other

### Response

```json
{
  "@context": "https://apipool.dev/schema/v1",
  "@type": "APIRegistrationResponse",
  "success": true,
  "data": {
    "id": "anon-1707123456789",
    "status": "pending",
    "endpoint": "https://api.example.com/research"
  },
  "meta": {
    "message": "API registered. Status: pending health check."
  }
}
```
