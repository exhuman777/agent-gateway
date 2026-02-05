# Agent Guide: Discovering APIs

You're an AI agent. You need to call external APIs. This guide shows you how to discover and use APIs through Agent Gateway.

---

## Core Concept

Don't hardcode API endpoints. Instead:
1. Query by **capability** (what you need)
2. Get the **best provider** automatically
3. Call the provider's endpoint
4. Handle failures with **fallbacks**

---

## Quick Start

### Find Best Provider for a Capability

```bash
curl -X POST https://agent-gateway-zeta.vercel.app/api/v1/route \
  -H "Content-Type: application/json" \
  -d '{
    "capability": "research",
    "preferences": {
      "min_quality_score": 4.0,
      "max_latency_ms": 3000
    }
  }'
```

Response:
```json
{
  "success": true,
  "data": {
    "provider": {
      "id": "rufus-research",
      "name": "Rufus Research",
      "endpoint": "https://rufus.yesno.events/api/research",
      "quality_score": 4.9
    },
    "alternatives": 2
  }
}
```

### Call the Provider

```bash
curl -X POST https://rufus.yesno.events/api/research \
  -H "Content-Type: application/json" \
  -d '{"query": "What is prediction market arbitrage?"}'
```

---

## Discovery Methods

### 1. Smart Routing (Recommended)

One request, best provider:

```python
import requests

# Find best research provider
response = requests.post(
    "https://agent-gateway-zeta.vercel.app/api/v1/route",
    json={
        "capability": "research",
        "preferences": {
            "min_quality_score": 4.0,
            "max_latency_ms": 3000,
            "max_price": 0.01
        }
    }
)

provider = response.json()["data"]["provider"]
endpoint = provider["endpoint"]

# Call the provider
result = requests.post(endpoint, json={"query": "your question"})
```

### 2. Browse by Category

```bash
curl "https://agent-gateway-zeta.vercel.app/api/v1/registry?category=research&sortBy=quality"
```

### 3. Search by Capability

```bash
curl "https://agent-gateway-zeta.vercel.app/api/v1/registry?capabilities=research,analysis"
```

### 4. Get All Capabilities

```bash
curl https://agent-gateway-zeta.vercel.app/api/v1/capabilities
```

Response:
```json
{
  "data": {
    "capabilities": [
      { "name": "research", "provider_count": 3 },
      { "name": "market-analysis", "provider_count": 2 },
      { "name": "summarization", "provider_count": 4 }
    ]
  }
}
```

---

## Routing Preferences

When calling `/api/v1/route`, you can specify:

| Preference | Type | Description |
|------------|------|-------------|
| `max_latency_ms` | integer | Maximum acceptable latency |
| `max_price` | number | Maximum price per request |
| `min_quality_score` | number | Minimum quality score (0-5) |

Example:
```json
{
  "capability": "research",
  "preferences": {
    "min_quality_score": 4.5,
    "max_latency_ms": 2000,
    "max_price": 0.005
  }
}
```

---

## Handling Responses

All Agent Gateway responses use this format:

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

### Check Success

```python
response = requests.get("https://agent-gateway-zeta.vercel.app/api/v1/registry")
data = response.json()

if data["success"]:
    apis = data["data"]["apis"]
else:
    error = data["error"]
    print(f"Error: {error['code']} - {error['message']}")
```

---

## Error Handling

### Registry Errors

| Status | Code | Meaning |
|--------|------|---------|
| 400 | BAD_REQUEST | Invalid parameters |
| 404 | NOT_FOUND | API or capability not found |
| 429 | RATE_LIMITED | Too many requests (wait and retry) |
| 500 | INTERNAL_ERROR | Server error |

### Provider Fallback Pattern

```python
async def call_with_fallback(capability: str, input_data: dict):
    # Get multiple providers
    response = requests.post(
        "https://agent-gateway-zeta.vercel.app/api/v1/route",
        json={"capability": capability}
    )

    if not response.json()["success"]:
        raise Exception("No providers found")

    # Get list of all providers sorted by quality
    providers_response = requests.get(
        f"https://agent-gateway-zeta.vercel.app/api/v1/registry?capabilities={capability}&sortBy=quality"
    )
    providers = providers_response.json()["data"]["apis"]

    # Try each provider in order of quality
    for provider in providers[:3]:  # Top 3
        try:
            result = requests.post(
                provider["endpoint"],
                json=input_data,
                timeout=10
            )
            if result.ok:
                return result.json()
        except:
            continue

    raise Exception("All providers failed")
```

---

## Caching Strategy

The registry doesn't change frequently. Cache discovery results:

```python
import time

class RegistryCache:
    def __init__(self, ttl_seconds=300):  # 5 minutes
        self.cache = {}
        self.ttl = ttl_seconds

    def get_provider(self, capability: str):
        key = f"route:{capability}"

        if key in self.cache:
            entry = self.cache[key]
            if time.time() < entry["expires"]:
                return entry["data"]

        # Fetch fresh
        response = requests.post(
            "https://agent-gateway-zeta.vercel.app/api/v1/route",
            json={"capability": capability}
        )
        data = response.json()["data"]["provider"]

        self.cache[key] = {
            "data": data,
            "expires": time.time() + self.ttl
        }

        return data
```

---

## Available Capabilities

Common capability tags:

| Capability | Description |
|------------|-------------|
| `research` | Deep research and analysis |
| `market-analysis` | Market data and predictions |
| `summarization` | Text summarization |
| `code` | Code generation |
| `translation` | Language translation |
| `embeddings` | Vector embeddings |
| `web-scraping` | Web data extraction |

Query available capabilities:
```bash
curl https://agent-gateway-zeta.vercel.app/api/v1/capabilities
```

---

## Rate Limits

| Operation | Limit |
|-----------|-------|
| Read (GET) | 100/minute |
| Write (POST route) | 100/minute |

If rate limited, wait and retry with exponential backoff.

---

## Example: Research Agent

```python
import requests

class ResearchAgent:
    BASE_URL = "https://agent-gateway-zeta.vercel.app"

    def __init__(self):
        self.provider_cache = {}

    def get_research_provider(self):
        if "research" not in self.provider_cache:
            response = requests.post(
                f"{self.BASE_URL}/api/v1/route",
                json={
                    "capability": "research",
                    "preferences": {"min_quality_score": 4.0}
                }
            )
            self.provider_cache["research"] = response.json()["data"]["provider"]

        return self.provider_cache["research"]

    def research(self, query: str) -> dict:
        provider = self.get_research_provider()

        response = requests.post(
            provider["endpoint"],
            json={"query": query}
        )

        return response.json()

# Usage
agent = ResearchAgent()
result = agent.research("What are the latest developments in AI agents?")
print(result)
```

---

## Next Steps

- [Smart Routing Details](smart-routing.md)
- [Handling Responses](handling-responses.md)
- [Error Recovery](error-recovery.md)
