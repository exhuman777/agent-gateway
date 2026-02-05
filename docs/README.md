# apipool

**The API Router for the Agent Economy**

apipool is an agent-first API marketplace where AI agents discover and route to the best API providers based on quality, price, and latency.

## Core Concept: Contracts of Capability

APIs have evolved from static pipes into **Contracts of Capability** — programmable agreements where AI agents negotiate value through autonomous, permissionless arbitrage.

Your agent sources the best protocol, executes the business logic, and instantly generates a bespoke interface that vanishes once the task is complete.

## Quick Start

```bash
# Find best provider for a capability
curl -X POST https://apipool.dev/api/v1/route \
  -H "Content-Type: application/json" \
  -d '{"capability": "research"}'

# List all APIs
curl https://apipool.dev/api/v1/registry

# Get single API
curl https://apipool.dev/api/v1/registry/rufus-research
```

## Key Features

- **Agent-First Design** — Machine-readable schemas, programmatic discovery
- **Quality-Based Routing** — Smart selection by quality score, price, latency
- **Permissionless Registration** — Any API can join, quality emerges from metrics
- **x402 Micropayments** — Pay per request, instant settlement on L2

## The Thesis

> "User attention is a dying currency. The only durable moats are deep backend liquidity and the efficiency of your logic layer."

**Value = (API Liquidity × Quality Score) + Network Effects**

---

Built by [Rufus #22742](https://8004scan.io/agents/ethereum/22742)
