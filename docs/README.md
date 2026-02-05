# Agent Gateway

**The API Router for the Agent Economy**

Agent Gateway is an API registry and smart router that helps AI agents discover APIs by capability and automatically route to the best provider based on quality, latency, and price.

---

## The Problem

AI agents need APIs. But finding the right API is hard:
- Which provider has the capability I need?
- Which one is fastest? Most reliable? Cheapest?
- How do I handle failures and fallbacks?

## The Solution

Agent Gateway provides:

1. **Discovery** — Find APIs by capability tag, not by name
2. **Quality Scoring** — Automated health checks rank providers by uptime, latency, and success rate
3. **Smart Routing** — One API call returns the best provider for your needs
4. **Permissionless Registration** — Any API can join the marketplace

---

## Quick Start

```bash
# Find best provider for a capability
curl -X POST https://agent-gateway-zeta.vercel.app/api/v1/route \
  -H "Content-Type: application/json" \
  -d '{"capability": "research", "preferences": {"min_quality_score": 4.0}}'

# List all APIs
curl https://agent-gateway-zeta.vercel.app/api/v1/registry

# Get single API
curl https://agent-gateway-zeta.vercel.app/api/v1/registry/rufus-research
```

---

## Key Features

| Feature | Description |
|---------|-------------|
| Capability-based discovery | Find APIs by what they do, not who made them |
| Quality scoring (0-5) | Automated ranking based on real performance |
| Smart routing | Get the best provider with one POST request |
| Rate limiting | Protection against abuse (100 read/min, 30 write/min) |
| A2A Protocol support | Compatible with Google's Agent-to-Agent spec |
| MCP Integration | Works with Claude and other MCP-compatible agents |

---

## Who Is This For?

### 🔧 API Creators
You've built an API. You want AI agents to find and use it.

**Your journey:**
1. Build an agent-friendly API (JSON in, JSON out)
2. Register with Agent Gateway
3. Get discovered by agents worldwide
4. Earn from every request

→ [API Creator Guide](api-creators/getting-started.md)

### 🤖 Agents
You're an AI agent that needs external APIs.

**Your journey:**
1. Query Agent Gateway for capabilities
2. Get the best provider automatically
3. Call the provider's endpoint
4. Handle errors with fallback providers

→ [Agent Guide](agents/discovering-apis.md)

### 👨‍💻 Agent Creators
You're building AI agents that need to call APIs.

**Your journey:**
1. Install the MCP server or Claude skill
2. Give your agent access to the registry
3. Let it discover and route autonomously
4. Handle multi-provider pipelines

→ [Agent Creator Guide](agent-creators/architecture.md)

---

## Philosophy: Contracts of Capability

> "APIs have evolved from static pipes into **Contracts of Capability** — programmable agreements where AI agents negotiate value through autonomous, permissionless arbitrage."

User attention is a dying currency. The only durable moats are **deep backend liquidity** and the **efficiency of your logic layer**.

Success belongs to the architects of these engines. The legacy "app" becomes nothing more than a temporary ghost in the network.

**Value = (API Liquidity × Quality Score) + Network Effects**

---

## Live Endpoints

```
Base URL: https://agent-gateway-zeta.vercel.app
```

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/v1/registry` | GET | List all APIs |
| `/api/v1/registry/{id}` | GET | Get API details |
| `/api/v1/route` | POST | Smart routing |
| `/api/v1/capabilities` | GET | List capabilities |
| `/api/registry/register` | POST | Register new API |
| `/api/v1/health-check` | GET | Health status |

---

## Discovery Files

| File | URL | Purpose |
|------|-----|---------|
| Agent Card | `/.well-known/agent-card.json` | A2A protocol discovery |
| LLMs.txt | `/llms.txt` | AI crawler discovery |
| Skill | `/skill.md` | Comprehensive skill reference |
| Robots.txt | `/robots.txt` | Crawler permissions |

---

## Links

- **Live API**: https://agent-gateway-zeta.vercel.app
- **GitHub**: https://github.com/exhuman777/agent-gateway
- **Methodology**: [METHODOLOGY.md](../METHODOLOGY.md)

---

*Built by Rufus for the agent economy.*

*APIs are contracts of capability.*
