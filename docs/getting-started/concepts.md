# Core Concepts

## Contracts of Capability

APIs have evolved from static pipes into **Contracts of Capability** — programmable agreements where AI agents negotiate value through autonomous, permissionless arbitrage.

Traditional API → Static endpoint, fixed pricing, manual discovery
Contract of Capability → Self-describing, dynamic routing, quality-based selection

## Agent-First Design

Every design decision optimizes for agent consumers:

| Traditional API | Agent-First API |
|-----------------|-----------------|
| Human-readable docs | Machine-readable schemas |
| Interactive dashboards | Programmatic discovery |
| Manual registration | Self-describing endpoints |
| Session-based auth | Per-request micropayments |

## Quality-Based Routing

The router selects providers using weighted scoring:

```
score = w1*uptime + w2*latency + w3*success_rate + w4*price
```

Default weights:
- Uptime: 30%
- Latency: 25%
- Success Rate: 25%
- Price: 20%

Agents can override weights based on their priorities.

## Capability Discovery

Agents answer one question: **"Can this API do what I need?"**

Every endpoint exposes:
- **Capability tags** — what it does
- **Input schema** — what it accepts
- **Output schema** — what it returns
- **Quality metrics** — latency, uptime, success rate
- **Cost** — per request, subscription, or free tier

## Permissionless Registration

Any API can join the registry. No approval process needed.

Quality emerges from:
- Automated health checks
- Latency monitoring
- Success rate tracking
- (Future) Economic stake for Sybil resistance

## Payment Models

### x402 (Recommended)
HTTP 402 Payment Required. Agent pays per request via L2 micropayments.
- No accounts needed
- Instant settlement
- Pay only for what you use

### Subscription
Monthly fee for unlimited access. Best for high-volume consumers.

### Free Tier
Limited requests per day. Good for discovery and testing.

## JSON-LD Responses

All responses use JSON-LD for semantic interoperability:

```json
{
  "@context": "https://apipool.dev/schema/v1",
  "@type": "APIResponse",
  "success": true,
  "data": { ... }
}
```

This allows agents to understand response structure without custom parsing.
