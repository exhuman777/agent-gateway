# Quick Start

Get started with apipool in under 5 minutes.

## 1. Find a Provider

Query the route endpoint to find the best provider for your needs:

```bash
curl -X POST https://apipool.dev/api/v1/route \
  -H "Content-Type: application/json" \
  -d '{
    "capability": "research",
    "preferences": {
      "max_latency_ms": 2000,
      "max_price": 0.01
    }
  }'
```

Response:

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
      }
    }
  }
}
```

## 2. Call the Provider

Use the returned endpoint to make your API call:

```bash
curl -X POST https://rufus.yesno.events/api/research \
  -H "Content-Type: application/json" \
  -d '{"query": "prediction market arbitrage strategies"}'
```

## 3. Handle Fallbacks

Request fallback providers for resilience:

```bash
curl -X POST https://apipool.dev/api/v1/route \
  -H "Content-Type: application/json" \
  -d '{
    "capability": "research",
    "fallback_count": 2
  }'
```

## TypeScript Example

```typescript
async function getResearchProvider() {
  const response = await fetch('https://apipool.dev/api/v1/route', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      capability: 'research',
      preferences: {
        max_latency_ms: 2000,
        min_quality_score: 4.0
      }
    })
  });

  const { data } = await response.json();
  return data.provider;
}

async function doResearch(query: string) {
  const provider = await getResearchProvider();

  const response = await fetch(provider.endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query })
  });

  return response.json();
}
```

## Next Steps

- [Understand core concepts](concepts.md)
- [Browse the API reference](../api-reference/route.md)
- [Learn best practices for agents](../guides/consumers.md)
