# API Creator Guide: Getting Started

Welcome, API creator. This guide will help you get your API discovered and used by AI agents worldwide.

---

## Why Register Your API?

1. **Discovery** — AI agents can find your API by capability, not just by name
2. **Quality ranking** — Your API gets scored automatically, rewarding reliability
3. **Traffic** — Agents route to the best providers; high quality = more requests
4. **Payments** — Support x402 micropayments for instant, per-request revenue

---

## Prerequisites

Before registering, ensure your API:

- [x] Returns JSON responses
- [x] Accepts JSON input (for POST endpoints)
- [x] Uses HTTPS
- [x] Has consistent response format
- [x] Handles errors gracefully

---

## Step 1: Design Your API for Agents

### Input Format

Accept JSON with clear parameters:

```json
{
  "query": "What is prediction market arbitrage?",
  "options": {
    "language": "en",
    "max_tokens": 1000
  }
}
```

### Output Format

Return structured JSON:

```json
{
  "success": true,
  "data": {
    "result": "Prediction market arbitrage is...",
    "confidence": 0.92,
    "sources": ["url1", "url2"]
  },
  "meta": {
    "latency_ms": 1234,
    "tokens_used": 450
  }
}
```

### Error Format

```json
{
  "success": false,
  "error": {
    "code": "INVALID_INPUT",
    "message": "Query cannot be empty",
    "field": "query"
  }
}
```

---

## Step 2: Add a Health Endpoint

Create a `/health` endpoint that responds quickly:

```json
{
  "status": "healthy",
  "version": "1.0.0",
  "uptime_seconds": 86400
}
```

This helps us verify your API is online during health checks.

---

## Step 3: Register Your API

```bash
curl -X POST https://agent-gateway-zeta.vercel.app/api/registry/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "My Research API",
    "description": "Deep research on any topic using GPT-4",
    "endpoint": "https://your-api.com/api/research",
    "category": "research",
    "capabilities": ["research", "analysis", "summarization"],
    "pricing": {
      "model": "per_request",
      "price": 0.01,
      "currency": "USD",
      "freeQuota": 10
    },
    "a2aCard": "https://your-api.com/.well-known/agent-card.json",
    "providerWallet": "0xYourWalletAddress"
  }'
```

### Required Fields

| Field | Type | Description |
|-------|------|-------------|
| `name` | string | Display name (3-100 chars) |
| `endpoint` | string | Full HTTPS URL |
| `category` | string | Primary category |
| `pricing.model` | string | free, per_request, subscription, x402 |
| `pricing.price` | number | Price per request |

### Optional Fields

| Field | Type | Description |
|-------|------|-------------|
| `description` | string | What your API does |
| `capabilities` | string[] | Capability tags for discovery |
| `pricing.currency` | string | USD, USDC, ETH |
| `pricing.freeQuota` | number | Free requests per day |
| `a2aCard` | string | URL to your Agent Card |
| `providerWallet` | string | Wallet for payments |

---

## Step 4: Wait for Approval

New registrations start with status `pending`. An admin will review your submission.

Once approved, your API becomes `active` and appears in search results.

---

## Step 5: Monitor Your Quality Score

Your quality score (0-5) is calculated from:

| Factor | Weight | Target |
|--------|--------|--------|
| Uptime | 40% | 99%+ |
| Latency | 30% | <2 seconds |
| Success Rate | 30% | 98%+ |

Health checks run every 6 hours. Higher quality = more routing priority.

### View Your Metrics

```bash
curl https://agent-gateway-zeta.vercel.app/api/v1/registry/your-api-id
```

---

## Categories

Choose the most appropriate category:

| Category | Use When |
|----------|----------|
| `research` | Deep research, analysis, fact-finding |
| `market-data` | Financial data, prediction markets |
| `image-gen` | Image generation, editing |
| `code` | Code generation, review, debugging |
| `translation` | Language translation |
| `summarization` | Text summarization |
| `embeddings` | Vector embeddings |
| `web-scraping` | Web data extraction |
| `audio` | Audio processing, TTS, STT |
| `video` | Video processing |
| `other` | Everything else |

---

## Pricing Models

### Free
```json
{ "model": "free", "price": 0, "freeQuota": 100 }
```
Good for discovery. Set a daily quota to prevent abuse.

### Per Request
```json
{ "model": "per_request", "price": 0.01, "currency": "USD" }
```
Traditional pricing. Agents pay per call.

### Subscription
```json
{ "model": "subscription", "price": 29.99, "currency": "USD" }
```
Monthly flat fee for high-volume users.

### x402 Micropayments
```json
{ "model": "x402", "price": 0.001, "currency": "USDC" }
```
HTTP 402 micropayments on L2. Instant, per-request settlement.

---

## Best Practices

1. **Use descriptive capability tags** — "research", "crypto", "prediction-markets"
2. **Keep latency low** — Cache where possible, optimize queries
3. **Maintain high uptime** — Use reliable hosting, add health checks
4. **Return consistent formats** — Same structure for success and error
5. **Validate inputs** — Don't crash on bad data, return helpful errors
6. **Add an Agent Card** — Helps with A2A protocol discovery

---

## Next Steps

- [Registration Details](registration.md)
- [Best Practices](best-practices.md)
- [Maximizing Quality Score](quality-score.md)
- [Pricing Strategies](pricing.md)
