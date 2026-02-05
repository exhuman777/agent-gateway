# Guide: For Providers

How to register and optimize your API for the apipool marketplace.

## 1. Register Your API

```bash
curl -X POST https://apipool.dev/api/v1/registry \
  -H "Content-Type: application/json" \
  -d '{
    "name": "My Research API",
    "description": "Deep research on any topic using GPT-4",
    "endpoint": "https://api.mycompany.com/v1/research",
    "category": "research",
    "capabilities": ["research", "analysis", "summarization"],
    "pricing": {
      "model": "x402",
      "price": 0.001,
      "currency": "USDC",
      "freeQuota": 10
    },
    "a2aCard": "https://api.mycompany.com/.well-known/agent-card.json",
    "providerWallet": "0xYourWalletAddress"
  }'
```

## 2. Expose Capability Tags

Don't just describe — declare. Use specific, searchable tags:

```json
{
  "capabilities": [
    "research",           // Primary capability
    "analysis",           // Secondary
    "summarization",      // Tertiary
    "crypto",             // Domain-specific
    "prediction-markets"  // Domain-specific
  ]
}
```

Common capability tags:
- research, analysis, summarization
- market-analysis, market-data, arbitrage
- image-gen, image-edit
- code, code-review, code-gen
- translation, transcription
- embeddings, rag

## 3. Provide JSON Schemas

Let agents validate before calling:

```json
{
  "input_schema": {
    "type": "object",
    "properties": {
      "query": {
        "type": "string",
        "minLength": 1,
        "maxLength": 10000,
        "description": "The research query"
      },
      "depth": {
        "type": "string",
        "enum": ["quick", "standard", "deep"],
        "default": "standard"
      }
    },
    "required": ["query"]
  },
  "output_schema": {
    "type": "object",
    "properties": {
      "summary": { "type": "string" },
      "confidence": { "type": "number" },
      "sources": {
        "type": "array",
        "items": { "type": "string" }
      }
    }
  }
}
```

## 4. Return Structured Data

Never return unstructured prose. Always:

```json
{
  "success": true,
  "data": {
    "summary": "Bitcoin sentiment is bullish...",
    "confidence": 0.92,
    "sources": [
      "https://example.com/article1",
      "https://example.com/article2"
    ],
    "metadata": {
      "tokens_used": 1234,
      "model": "gpt-4"
    }
  }
}
```

## 5. Handle Errors Gracefully

Return machine-parseable errors:

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

Standard error codes:
- INVALID_INPUT — Bad request data
- UNAUTHORIZED — Authentication required
- RATE_LIMITED — Too many requests
- INTERNAL_ERROR — Server error
- SERVICE_UNAVAILABLE — Temporary outage

## 6. Support Health Checks

Expose a `/health` endpoint:

```json
GET /health
{
  "status": "healthy",
  "latency_ms": 45,
  "version": "1.0.0",
  "uptime_seconds": 86400
}
```

apipool uses this for monitoring.

## 7. Create an A2A Agent Card

For full A2A protocol compatibility:

```json
// https://api.mycompany.com/.well-known/agent-card.json
{
  "name": "My Research API",
  "description": "Deep research on any topic",
  "url": "https://api.mycompany.com",
  "version": "0.3.0",
  "capabilities": {
    "research": {
      "description": "Research any topic",
      "input_schema": { ... },
      "output_schema": { ... }
    }
  },
  "authentication": {
    "type": "x402"
  }
}
```

## 8. Optimize for Quality Score

Your quality score is calculated from:

| Factor | Weight | How to Improve |
|--------|--------|----------------|
| Uptime | 30% | Use redundant infrastructure |
| Latency | 25% | Edge deployment, caching |
| Success Rate | 25% | Robust error handling |
| Price | 20% | Competitive pricing |

Tips:
- Monitor your endpoint 24/7
- Set up alerts for failures
- Cache common responses
- Use CDN for static assets

## 9. Pricing Strategy

### x402 (Recommended)
- Lowest friction for agents
- Instant settlement
- No account management

### Free Tier
- Good for discovery
- Limits prevent abuse
- Converts to paid users

### Subscription
- Best for high-volume consumers
- Predictable revenue
- Lower per-request cost

## Example: Complete Registration

```typescript
const registration = {
  // Identity
  name: "Polymarket Intel",
  description: "Real-time prediction market analysis and arbitrage opportunities",

  // Endpoint
  endpoint: "https://api.polymarketintel.com/v1/analyze",

  // Discovery
  category: "market-data",
  capabilities: [
    "market-analysis",
    "prediction-markets",
    "arbitrage",
    "real-time"
  ],

  // Pricing
  pricing: {
    model: "x402",
    price: 0.002,
    currency: "USDC",
    freeQuota: 5  // 5 free calls per day
  },

  // Integration
  a2aCard: "https://api.polymarketintel.com/.well-known/agent-card.json",
  providerWallet: "0x1234567890abcdef..."
};

// Register
const response = await fetch('https://apipool.dev/api/v1/registry', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(registration)
});

console.log(await response.json());
// { success: true, data: { id: "0x1234-1707123456", status: "pending" } }
```
