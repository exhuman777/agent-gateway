# apipool Methodology

## Contracts of Capability

APIs have evolved from static pipes into **Contracts of Capability** — programmable agreements where AI agents negotiate value through autonomous, permissionless arbitrage.

Your agent sources the best protocol, executes the business logic, and instantly generates a bespoke interface that vanishes once the task is complete.

Since user attention is a dying currency, the only durable moats are **deep backend liquidity** and the **efficiency of your logic layer**.

Success belongs to the architects of these engines. The legacy "app" becomes nothing more than a temporary ghost in the network.

---

## Core Principles

### 1. Agent-First, Human-Second

Every design decision optimizes for agent consumers:

| Traditional API | Agent-First API |
|-----------------|-----------------|
| Human-readable docs | Machine-readable schemas |
| Interactive dashboards | Programmatic discovery |
| Manual registration | Self-describing endpoints |
| Session-based auth | Per-request micropayments |

### 2. Capability Discovery

Agents must answer one question instantly: **"Can this API do what I need?"**

Every endpoint exposes:
- **Capability tags** — what it does (`research`, `market-data`, `image-gen`)
- **Input schema** — what it accepts (JSON Schema)
- **Output schema** — what it returns
- **Quality metrics** — latency, uptime, success rate
- **Cost** — per request, subscription, or free tier

### 3. Quality-Based Routing

The router selects providers using weighted scoring:

```
score = w1*uptime + w2*latency + w3*success_rate + w4*price
```

Default weights:
- Uptime: 30%
- Latency: 25%
- Success Rate: 25%
- Price: 20%

Agents can override weights per request based on their priorities.

### 4. Permissionless Registration

Any API can join. No approval process. Quality emerges from:
- Automated health checks
- Latency monitoring
- Success rate tracking
- (Future) Economic stake for Sybil resistance

---

## API Design Guidelines

### Endpoint Structure

```
GET  /api/v1/registry              # List all APIs
GET  /api/v1/registry/{id}         # Get single API
GET  /api/v1/registry/search       # Search with filters
POST /api/v1/registry/register     # Register new API
GET  /api/v1/capabilities          # List all capabilities
GET  /api/v1/route                 # Get best provider for capability
```

### Request Format

All requests use JSON. Agents include:

```json
{
  "capability": "research",
  "input": { "query": "prediction market arbitrage" },
  "preferences": {
    "max_latency_ms": 3000,
    "max_price_usd": 0.01,
    "min_quality_score": 4.0
  }
}
```

### Response Format

All responses are JSON-LD compatible:

```json
{
  "@context": "https://apipool.dev/schema/v1",
  "@type": "APIResponse",
  "success": true,
  "data": { ... },
  "meta": {
    "provider": "rufus",
    "latency_ms": 1234,
    "cost_usd": 0.001,
    "request_id": "uuid"
  }
}
```

### Error Format

```json
{
  "@context": "https://apipool.dev/schema/v1",
  "@type": "APIError",
  "success": false,
  "error": {
    "code": "RATE_LIMITED",
    "message": "Too many requests",
    "retry_after_ms": 60000
  }
}
```

---

## API Listing Schema

Every registered API must provide:

```typescript
interface APIListing {
  // Identity
  id: string;                      // Unique identifier
  name: string;                    // Human-readable name
  description: string;             // What it does

  // Endpoint
  endpoint: string;                // Base URL
  method: "GET" | "POST";          // HTTP method

  // Capability
  category: APICategory;           // Primary category
  capabilities: string[];          // Capability tags
  input_schema?: JSONSchema;       // Request body schema
  output_schema?: JSONSchema;      // Response body schema

  // Pricing
  pricing: {
    model: "per_request" | "subscription" | "free" | "x402";
    price: number;
    currency: "USD" | "USDC" | "ETH";
    free_quota?: number;           // Requests per day
  };

  // Provider
  provider: {
    id: string;
    name: string;
    wallet?: string;               // For payments
    erc8004_id?: number;           // On-chain identity
  };

  // Discovery
  a2a_card?: string;               // A2A Agent Card URL
  openapi?: string;                // OpenAPI spec URL

  // Metrics (system-managed)
  metrics: {
    quality_score: number;         // 0-5
    latency_ms: number;            // Average
    uptime_percent: number;        // Last 30 days
    total_requests: number;
    success_rate: number;          // 0-1
  };
}
```

---

## Payment Models

### x402 (Recommended)

HTTP 402 Payment Required. Agent pays per request via L2 micropayments.

```
Agent → Request → apipool → 402 Required → Agent pays → apipool → Provider
```

Benefits:
- No accounts needed
- Instant settlement
- Pay only for what you use

### Subscription

Monthly fee for unlimited access. Best for high-volume consumers.

### Free Tier

Limited requests per day. Good for discovery and testing.

---

## A2A Protocol Integration

apipool is compatible with Google's Agent-to-Agent protocol.

Every API can expose an Agent Card:

```json
{
  "name": "Rufus Research",
  "description": "Deep research powered by qwen2.5:14b",
  "url": "https://rufus.yesno.events",
  "version": "0.3.0",
  "capabilities": {
    "research": {
      "description": "Research any topic",
      "input_schema": { ... },
      "output_schema": { ... }
    }
  }
}
```

---

## ERC-8004 Integration

Providers can link their on-chain agent identity:

- **Agent ID** — Unique on-chain identifier
- **Wallet** — For receiving payments
- **Reputation** — On-chain task completion history

Verified ERC-8004 agents get a trust badge and priority in routing.

---

## Quality Scoring Algorithm

Quality score (0-5) is calculated from:

```typescript
const WEIGHTS = {
  uptime: 0.30,
  latency: 0.25,
  success_rate: 0.25,
  price_efficiency: 0.20
};

function calculateScore(metrics: APIMetrics): number {
  const uptime = metrics.uptime_percent / 100;
  const latency = Math.max(0, 1 - metrics.latency_ms / 10000);
  const success = metrics.success_rate;
  const price = Math.max(0, 1 - metrics.price / 0.01); // Cheaper = better

  return (
    uptime * WEIGHTS.uptime +
    latency * WEIGHTS.latency +
    success * WEIGHTS.success_rate +
    price * WEIGHTS.price_efficiency
  ) * 5;
}
```

---

## Best Practices for Providers

### 1. Expose Capability Tags

Don't just describe — declare:

```json
{
  "capabilities": ["research", "summarization", "crypto", "prediction-markets"]
}
```

### 2. Provide JSON Schemas

Let agents validate before calling:

```json
{
  "input_schema": {
    "type": "object",
    "properties": {
      "query": { "type": "string", "minLength": 1 }
    },
    "required": ["query"]
  }
}
```

### 3. Return Structured Data

Never return unstructured prose. Always:

```json
{
  "success": true,
  "data": {
    "summary": "...",
    "confidence": 0.92,
    "sources": ["url1", "url2"]
  }
}
```

### 4. Handle Failures Gracefully

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

### 5. Support Health Checks

Expose `/health` endpoint for monitoring:

```json
{
  "status": "healthy",
  "latency_ms": 45,
  "version": "1.0.0"
}
```

---

## Best Practices for Consumers (Agents)

### 1. Query by Capability, Not Name

```typescript
// Good
const provider = await apipool.route({ capability: "research" });

// Bad
const provider = await apipool.get("rufus-research");
```

### 2. Set Preferences

```typescript
const provider = await apipool.route({
  capability: "research",
  preferences: {
    max_latency_ms: 2000,
    min_quality_score: 4.5
  }
});
```

### 3. Handle Fallbacks

```typescript
const providers = await apipool.search({
  capability: "research",
  limit: 3
});

for (const provider of providers) {
  try {
    return await provider.call(input);
  } catch {
    continue; // Try next provider
  }
}
```

### 4. Cache Discovery

Registry changes slowly. Cache for 5-15 minutes:

```typescript
const registry = await apipool.registry({ cache_ttl_ms: 300000 });
```

---

## The Future

### Phase 1: Registry (Now)
- List and discover APIs
- Quality scoring
- Basic routing

### Phase 2: Payments
- x402 micropayments on Base
- Subscription management
- Revenue sharing

### Phase 3: Staking
- Provider stake for Sybil resistance
- Slashing for downtime/failures
- Quality incentives

### Phase 4: Autonomous Routing
- ML-based provider selection
- Predictive capacity management
- Cross-chain arbitrage

---

## The Thesis

> "The future isn't a human-facing UI; it's an Agent-facing API. Your agent will query the Transport Layer and execute based on the best logic — price, speed, quality."

We're building infrastructure for that world. A marketplace where API providers are like liquidity providers, and agents route to the best endpoint for every request.

**Value = (API Liquidity × Quality Score) + Network Effects**

---

*apipool — Contracts of Capability for the Agent Economy*
