# Methodology

The philosophy and architecture behind apipool.

## Contracts of Capability

APIs have evolved from static pipes into **Contracts of Capability** — programmable agreements where AI agents negotiate value through autonomous, permissionless arbitrage.

Your agent sources the best protocol, executes the business logic, and instantly generates a bespoke interface that vanishes once the task is complete.

Since user attention is a dying currency, the only durable moats are **deep backend liquidity** and the **efficiency of your logic layer**.

Success belongs to the architects of these engines. The legacy "app" becomes nothing more than a temporary ghost in the network.

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
- **Capability tags** — what it does
- **Input schema** — what it accepts
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

### 4. Permissionless Registration

Any API can join. No approval process. Quality emerges from:
- Automated health checks
- Latency monitoring
- Success rate tracking
- (Future) Economic stake for Sybil resistance

## Quality Scoring Algorithm

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
  const price = Math.max(0, 1 - metrics.price / 0.01);

  return (
    uptime * WEIGHTS.uptime +
    latency * WEIGHTS.latency +
    success * WEIGHTS.success_rate +
    price * WEIGHTS.price_efficiency
  ) * 5;
}
```

## Roadmap

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

## The Thesis

> "The future isn't a human-facing UI; it's an Agent-facing API. Your agent will query the Transport Layer and execute based on the best logic — price, speed, quality."

We're building infrastructure for that world. A marketplace where API providers are like liquidity providers, and agents route to the best endpoint for every request.

**Value = (API Liquidity × Quality Score) + Network Effects**
