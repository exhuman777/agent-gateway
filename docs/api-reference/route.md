# Route API

Find the best API provider for a given capability.

## POST /api/v1/route

Smart routing to the best provider based on capability and preferences.

### Request

```json
{
  "capability": "research",
  "preferences": {
    "max_latency_ms": 2000,
    "max_price": 0.01,
    "min_quality_score": 4.0
  },
  "fallback_count": 2
}
```

### Parameters

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| capability | string | Yes | The capability you need (e.g., "research", "market-analysis") |
| preferences | object | No | Filtering preferences |
| preferences.max_latency_ms | number | No | Maximum acceptable latency in milliseconds |
| preferences.max_price | number | No | Maximum price per request |
| preferences.min_quality_score | number | No | Minimum quality score (0-5) |
| fallback_count | number | No | Number of fallback providers to return |

### Response

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
      "pricing": {
        "model": "x402",
        "price": 0.001,
        "currency": "USDC"
      },
      "metrics": {
        "quality_score": 4.9,
        "latency_ms": 2300,
        "success_rate": 0.98
      },
      "a2a_card": "https://rufus.yesno.events/.well-known/agent-card.json"
    },
    "fallbacks": [
      {
        "id": "other-research",
        "name": "Other Research API",
        "endpoint": "https://...",
        "quality_score": 4.5
      }
    ]
  },
  "meta": {
    "capability": "research",
    "preferences": {},
    "timestamp": "2026-02-05T10:00:00Z"
  }
}
```

### Error Response

```json
{
  "@context": "https://apipool.dev/schema/v1",
  "@type": "APIError",
  "success": false,
  "error": {
    "code": "NO_PROVIDER",
    "message": "No provider found for capability 'foo' matching preferences"
  }
}
```

### Error Codes

| Code | Description |
|------|-------------|
| INVALID_INPUT | Missing or invalid capability |
| NO_PROVIDER | No provider matches the criteria |
| INTERNAL_ERROR | Server error |

## GET /api/v1/route

Returns the routing API schema (for discovery).

```bash
curl https://apipool.dev/api/v1/route
```
