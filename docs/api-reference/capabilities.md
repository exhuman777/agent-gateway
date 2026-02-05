# Capabilities API

Discover available capabilities across all providers.

## GET /api/v1/capabilities

List all capabilities with provider counts.

### Example

```bash
curl https://apipool.dev/api/v1/capabilities
```

### Response

```json
{
  "@context": "https://apipool.dev/schema/v1",
  "@type": "CapabilitiesResponse",
  "success": true,
  "data": {
    "capabilities": [
      {
        "name": "research",
        "provider_count": 3,
        "providers": ["Rufus", "Other Provider"]
      },
      {
        "name": "market-analysis",
        "provider_count": 2,
        "providers": ["Rufus"]
      },
      {
        "name": "summarization",
        "provider_count": 2,
        "providers": ["Rufus", "TL;DR Agent"]
      }
    ],
    "categories": [
      { "name": "research", "count": 1 },
      { "name": "market-data", "count": 1 },
      { "name": "summarization", "count": 1 }
    ],
    "total_apis": 3
  },
  "meta": {
    "description": "All capabilities available in the registry",
    "usage": "Use these capability names with /api/v1/route to find providers"
  }
}
```

## Using Capabilities

Query by capability name when routing:

```bash
curl -X POST https://apipool.dev/api/v1/route \
  -H "Content-Type: application/json" \
  -d '{"capability": "research"}'
```

Or filter the registry:

```bash
curl "https://apipool.dev/api/v1/registry?capability=research"
```

## Common Capabilities

| Capability | Description |
|------------|-------------|
| research | Deep research and analysis |
| market-analysis | Market data and predictions |
| summarization | Text summarization |
| analysis | General analysis |
| prediction-markets | Prediction market data |
| arbitrage | Arbitrage opportunities |
| briefing | News and briefings |
| crypto | Cryptocurrency data |
