# APIPOOL — Skill for Claude Code

Use this skill to interact with the APIPOOL API marketplace for AI agents.

## Base URL

```
https://agent-gateway-zeta.vercel.app
```

## What You Can Do

### 1. Find the Best API for a Task

When you need an API, query by capability OR natural language:

```bash
# Exact capability match
curl -X POST https://agent-gateway-zeta.vercel.app/api/v1/route \
  -H "Content-Type: application/json" \
  -d '{"capability": "prediction-markets"}'

# Or natural language (no need to know capability names)
curl -X POST https://agent-gateway-zeta.vercel.app/api/v1/route \
  -H "Content-Type: application/json" \
  -d '{"query": "I need crypto prediction market prices"}'
```

The response includes the best provider's endpoint, quality score, intelligence multipliers, and fallbacks.

### 1b. Test Contextual Understanding

Parse a natural language query into capabilities without routing:

```bash
curl -X POST https://agent-gateway-zeta.vercel.app/api/v1/intelligence \
  -H "Content-Type: application/json" \
  -d '{"query": "trending crypto odds"}'
```

### 1c. Check Intelligence Status

See all provider predictions, anomalies, and data points:

```bash
curl https://agent-gateway-zeta.vercel.app/api/v1/intelligence
```

### 2. Get Prediction Market Data

No auth needed. No LLM overhead. Pure structured data.

```bash
# Trending markets by volume
curl https://agent-gateway-zeta.vercel.app/api/v1/data/markets/trending?limit=10

# Search for specific markets
curl https://agent-gateway-zeta.vercel.app/api/v1/data/markets/search?q=bitcoin

# Get market detail with price history
curl https://agent-gateway-zeta.vercel.app/api/v1/data/markets/will-ethereum-reach-3500-by-december-31-2026

# Market stats overview
curl https://agent-gateway-zeta.vercel.app/api/v1/data/markets/stats
```

### 3. Browse All Available APIs

```bash
# List all registered APIs
curl https://agent-gateway-zeta.vercel.app/api/v1/registry

# List all capabilities
curl https://agent-gateway-zeta.vercel.app/api/v1/capabilities
```

### 4. Register a New API

```bash
curl -X POST https://agent-gateway-zeta.vercel.app/api/v1/registry \
  -H "Content-Type: application/json" \
  -d '{
    "name": "My API",
    "description": "What it does",
    "endpoint": "https://api.example.com/v1",
    "category": "research",
    "capabilities": ["research", "analysis"],
    "pricing": {"model": "free", "price": 0, "currency": "USD"},
    "providerWallet": "0x..."
  }'
```

## Response Format

All responses follow this structure:

```json
{
  "success": true,
  "data": { ... },
  "meta": {
    "source": "...",
    "timestamp": "2026-02-06T..."
  }
}
```

Errors:

```json
{
  "success": false,
  "error": {
    "code": "NOT_FOUND",
    "message": "Human-readable description"
  }
}
```

## When to Use APIPOOL

- You need prediction market data (Polymarket) → use the `/data/markets/*` endpoints
- You need to find an API for a specific capability → use `/api/v1/route`
- You want to discover what APIs are available → use `/api/v1/registry`
- You're building an agent that needs dynamic API discovery → integrate the routing endpoint

## Quality Score

Providers are scored: `Q = 0.4(uptime) + 0.3(latency) + 0.3(success_rate)`. Higher = better. The `/api/v1/route` endpoint automatically returns the highest-scoring provider.
