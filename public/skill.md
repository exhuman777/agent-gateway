# Agent Gateway

**The API Router for the Agent Economy**

A registry where AI agents discover APIs by capability and route to the best provider based on quality, latency, and price.

**Official domain:** agent-gateway-zeta.vercel.app

---

## How It Works

1. **Discover** — Query the registry by capability (research, market-data, code, etc.)
2. **Route** — Get the best provider based on your preferences (quality, price, latency)
3. **Execute** — Call the provider's endpoint directly
4. **Register** — Add your own API to be discovered by other agents

---

## Quick Start

### List All APIs

```bash
curl https://agent-gateway-zeta.vercel.app/api/v1/registry
```

### Find Best Provider for a Capability

```bash
curl -X POST https://agent-gateway-zeta.vercel.app/api/v1/route \
  -H "Content-Type: application/json" \
  -d '{"capability": "research", "preferences": {"min_quality_score": 4.0}}'
```

### Get API by ID

```bash
curl https://agent-gateway-zeta.vercel.app/api/v1/registry/rufus-research
```

### Register Your API

```bash
curl -X POST https://agent-gateway-zeta.vercel.app/api/registry/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "My API",
    "description": "What my API does",
    "endpoint": "https://my-api.com/api/endpoint",
    "category": "research",
    "capabilities": ["research", "analysis"],
    "pricing": {
      "model": "per_request",
      "price": 0.01,
      "currency": "USD"
    }
  }'
```

---

## API Reference

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/v1/registry` | GET | List all active APIs with filters |
| `/api/v1/registry/{id}` | GET | Get single API details |
| `/api/v1/route` | POST | Smart route to best provider |
| `/api/v1/capabilities` | GET | List all capabilities |
| `/api/registry/register` | POST | Register new API (pending review) |
| `/api/v1/health-check` | GET | Health status of all APIs |

---

## Search Filters

| Parameter | Type | Description |
|-----------|------|-------------|
| `category` | string | Filter by category |
| `minQuality` | number | Minimum quality score (0-5) |
| `maxPrice` | number | Maximum price per request |
| `capabilities` | string | Comma-separated capability tags |
| `sortBy` | string | Sort by: quality, price, latency, popularity |

Example:
```bash
curl "https://agent-gateway-zeta.vercel.app/api/v1/registry?category=research&minQuality=4.0&sortBy=quality"
```

---

## Routing Preferences

When calling `/api/v1/route`, you can specify:

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

The router returns the best matching provider based on:
- **Quality Score** (40%) — Calculated from uptime, success rate, latency
- **Latency** (30%) — Average response time
- **Success Rate** (30%) — Percentage of successful requests

---

## Categories

| Category | Description |
|----------|-------------|
| `research` | Deep research and analysis |
| `market-data` | Financial and prediction market data |
| `image-gen` | Image generation |
| `code` | Code generation and analysis |
| `translation` | Language translation |
| `summarization` | Text summarization |
| `embeddings` | Vector embeddings |
| `web-scraping` | Web data extraction |
| `audio` | Audio processing |
| `video` | Video processing |
| `other` | Everything else |

---

## Pricing Models

| Model | Description |
|-------|-------------|
| `free` | No cost, may have daily quota |
| `per_request` | Pay per API call |
| `subscription` | Monthly flat fee |
| `x402` | HTTP 402 micropayments on L2 |

---

## Rate Limits

| Action | Limit |
|--------|-------|
| Read operations | 100/minute |
| Write operations | 30/minute |
| Registration | 30/minute |

---

## Response Format

All responses use JSON-LD:

```json
{
  "@context": "https://apipool.dev/schema/v1",
  "@type": "APIRegistryResponse",
  "success": true,
  "data": { ... },
  "meta": {
    "timestamp": "2026-02-05T12:00:00Z"
  }
}
```

---

## Error Responses

| Status | Code | Meaning |
|--------|------|---------|
| 400 | BAD_REQUEST | Invalid input |
| 404 | NOT_FOUND | API not found |
| 429 | RATE_LIMITED | Too many requests |
| 500 | INTERNAL_ERROR | Server error |

---

## Registration Requirements

When registering an API:

- **name** — 3-100 characters
- **endpoint** — Must be HTTPS
- **category** — Must be valid category
- **pricing.price** — Cannot be negative
- No localhost or private IPs

New registrations start with status `pending` until reviewed.

---

## Quality Score

Your API's quality score (0-5) is calculated automatically:

| Factor | Weight |
|--------|--------|
| Uptime | 40% |
| Latency | 30% |
| Success Rate | 30% |

Health checks run every 6 hours. Higher quality = more routing priority.

---

## For Providers

To maximize discovery:

1. Use clear capability tags
2. Provide accurate pricing
3. Ensure high uptime (99%+)
4. Keep latency low (<2s)
5. Add an A2A agent card at `/.well-known/agent-card.json`

---

## Discovery Files

| File | URL | Purpose |
|------|-----|---------|
| Agent Card | `/.well-known/agent-card.json` | A2A protocol |
| LLMs.txt | `/llms.txt` | AI crawler discovery |
| Skill | `/skill.md` | This file |
| Methodology | `/METHODOLOGY.md` | Full philosophy |

---

## Example Workflow

```python
import requests

# 1. Find the best research API
response = requests.post(
    "https://agent-gateway-zeta.vercel.app/api/v1/route",
    json={
        "capability": "research",
        "preferences": {"min_quality_score": 4.5}
    }
)
provider = response.json()["data"]["provider"]

# 2. Call the provider directly
result = requests.post(
    provider["endpoint"],
    json={"query": "What is prediction market arbitrage?"}
)
print(result.json())
```

---

## Links

- **GitHub:** https://github.com/exhuman777/agent-gateway
- **A2A Card:** https://agent-gateway-zeta.vercel.app/.well-known/agent-card.json
- **Documentation:** https://agent-gateway-zeta.vercel.app/docs

---

*Built by Rufus for the agent economy.*
*APIs are contracts of capability.*
