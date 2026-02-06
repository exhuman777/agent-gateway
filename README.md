# APIPOOL

**Intelligent API marketplace for AI agents.**

Agents query by capability — or plain English. APIPOOL scores providers using 4-pillar intelligence and routes to the best one. No hardcoded endpoints. No guessing.

**Live:** [agent-gateway-zeta.vercel.app](https://agent-gateway-zeta.vercel.app)

---

## What is APIPOOL?

APIPOOL is infrastructure for the AI agent economy. Instead of hardcoding API URLs into agent code, agents ask APIPOOL *what they need* and get routed to the best available provider based on real-time intelligent scoring.

```
Agent: "I need prediction market data"
  ↓
APIPOOL: scores all providers → picks best → returns endpoint + fallbacks
  ↓
Agent: calls provider directly (APIPOOL is a router, not a proxy)
```

Think of it as **DNS for AI services** — but with quality scoring, self-learning, anomaly detection, and natural language understanding built in.

---

## Quick Start

```bash
# Try it right now — no auth needed
curl https://agent-gateway-zeta.vercel.app/api/v1/data/markets/trending?limit=3

# Route to best provider using natural language
curl -X POST https://agent-gateway-zeta.vercel.app/api/v1/route \
  -H "Content-Type: application/json" \
  -d '{"query": "I need crypto prediction market prices"}'

# Or use exact capability matching
curl -X POST https://agent-gateway-zeta.vercel.app/api/v1/route \
  -H "Content-Type: application/json" \
  -d '{"capability": "prediction-markets"}'

# Test the contextual understanding engine
curl -X POST https://agent-gateway-zeta.vercel.app/api/v1/intelligence \
  -H "Content-Type: application/json" \
  -d '{"query": "trending crypto odds"}'
```

### Run Locally

```bash
npm install
npm run dev
# → http://localhost:3000
```

---

## 4 Pillars of Intelligent Routing

APIPOOL goes beyond static quality scores. Four real-time intelligence systems continuously adapt routing decisions:

### P1 — Self-Learning Routing
Every routing decision is recorded with its outcome. Providers that consistently deliver successful responses get boosted (up to 1.2x). Unreliable providers get penalized (down to 0.8x).

```
learning_multiplier = 1.0 + success_bonus + latency_bonus
  success_bonus = (success_rate - 0.7) × 0.5     // 100% → +0.15
  latency_bonus = clamp(-0.05, (1500-avg)/20000, +0.05)
```

### P2 — Predictive Orchestration
Health check data is analyzed for trends. If latency is rising or success rate is dropping, the provider is proactively demoted **before it fails**.

```
Split last 10 checks: recent (3) vs baseline (7)
  Both degrading → "failing"  → 0.7x multiplier
  One degrading  → "at_risk"  → 0.9x multiplier
  Stable         → "healthy"  → 1.0x multiplier
```

### P3 — Anomaly Detection
Unusual behavior is flagged in real-time. Latency spikes, error bursts, and downtime events directly reduce the effective score.

```
  latency_spike: recent > 2× baseline → -5% (medium) or -15% (high)
  error_burst:   2+ of 3 checks fail  → -5% to -15%
  downtime:      3/3 checks failed    → -15%
```

### P4 — Contextual Understanding
Agents don't need to know exact capability strings. Send natural language:

```json
// Instead of knowing the exact capability name:
{ "capability": "prediction-markets" }

// Just describe what you need:
{ "query": "I need crypto market prediction data" }
// → resolves to "prediction-markets" with confidence 0.5
```

### Master Formula

```
effective_score = base_quality × learning × predictive × anomaly

Where base_quality = 0.4(uptime/20) + 0.3(5-latency/1000) + 0.3(success×5)
```

---

## API Endpoints

### Core — Intelligent Routing

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/v1/route` | **Intelligent routing** — find best provider (supports `capability` or `query`) |
| `GET` | `/api/v1/registry` | Browse all registered APIs |
| `POST` | `/api/v1/registry` | Register a new API |
| `GET` | `/api/v1/capabilities` | List all available capabilities |
| `GET` | `/api/v1/intelligence` | Intelligence system status + provider predictions |
| `POST` | `/api/v1/intelligence` | Test contextual understanding (NL → capability) |
| `GET` | `/api/v1/health-check` | Provider health status |

### Data — Polymarket (No Auth, No LLM)

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/v1/data/markets/trending` | Top markets by trading volume |
| `GET` | `/api/v1/data/markets/search?q=` | Full-text search |
| `GET` | `/api/v1/data/markets/{slug}` | Market detail + price history |
| `GET` | `/api/v1/data/markets/stats` | Volume, categories, sync stats |
| `GET` | `/api/v1/data/markets` | All markets (filterable by category, active, sort) |

---

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     AGENT REQUEST                           │
│                                                             │
│   POST /api/v1/route                                        │
│   { "query": "crypto odds" }                                │
│   or { "capability": "prediction-markets" }                 │
│                                                             │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────┐
│                  APIPOOL INTELLIGENCE                        │
│                                                             │
│   P4: Parse NL query → capability                           │
│   P1: Apply learning multiplier (0.8-1.2x from history)     │
│   P2: Apply predictive multiplier (trend analysis)          │
│   P3: Apply anomaly multiplier (spike/burst detection)      │
│                                                             │
│   effective = base × learning × predictive × anomaly        │
│   Sort providers → return best + fallbacks                  │
│                                                             │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────┐
│                   AGENT RESPONSE                            │
│                                                             │
│   { provider: { endpoint, score, metrics },                 │
│     intelligence: { effective_score, multipliers },         │
│     fallbacks: [...] }                                      │
│                                                             │
│   Agent calls provider endpoint directly (not proxied)      │
└─────────────────────────────────────────────────────────────┘
```

### Data Pipeline (Offline-Proof)

```
Vercel Cron (daily) → Polymarket Gamma API → Supabase PostgreSQL
                                                    ↓
Agent → /api/v1/data/markets/* → Supabase query → <200ms JSON response

No Mac Mini needed. No LLM needed. 138 markets tracked. $17M+ volume indexed.
```

---

## What You Get

| Feature | Status |
|---------|--------|
| Intelligent routing (4 pillars) | Live |
| Natural language queries | Live |
| Polymarket data (138 markets) | Live |
| Quality scoring (Q formula) | Live |
| Provider health checks | Live (daily cron) |
| Self-learning from usage | Live |
| Predictive orchestration | Live |
| Anomaly detection | Live |
| JSON-LD responses | Live |
| A2A agent card | Live |
| x402 payment support | Ready |
| ERC-8004 on-chain identity | #22742 |
| About page | [/about](https://agent-gateway-zeta.vercel.app/about) |
| Full methodology | [/methodology](https://agent-gateway-zeta.vercel.app/methodology) |
| API docs | [/docs](https://agent-gateway-zeta.vercel.app/docs) |
| Explore APIs | [/explore](https://agent-gateway-zeta.vercel.app/explore) |
| Register API | [/register](https://agent-gateway-zeta.vercel.app/register) |

---

## Standards

| Protocol | Status | How APIPOOL Uses It |
|----------|--------|---------------------|
| **A2A** (Google) | Supported | Agent cards at `/.well-known/agent-card.json` for discovery |
| **MCP** (Anthropic) | Compatible | All data endpoints work as MCP data sources |
| **x402** (Coinbase) | Supported | Pay-per-request pricing for providers |
| **ERC-8004** | Active | On-chain identity #22742 on Ethereum |
| **JSON-LD** | Native | All responses include `@context` for machine semantics |

---

## Stack

- **Next.js** — App Router, TypeScript
- **Supabase** — PostgreSQL for markets + intelligence tracking
- **Vercel** — Hosting, cron jobs, edge functions
- **Tailwind CSS** — Monochrome design

---

## Deploy Your Own

```bash
# Clone
git clone https://github.com/exhuman777/agent-gateway.git
cd agent-gateway

# Install
npm install

# Set up Supabase
# 1. Create project at supabase.com
# 2. Run supabase-migration.sql in SQL Editor
# 3. Run supabase-intelligence.sql in SQL Editor

# Environment
cp .env.example .env.local
# Fill in: NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY, CRON_SECRET

# Run
npm run dev

# Deploy
vercel --prod
```

---

## File Structure

```
src/
  app/
    api/v1/
      route/         — Intelligent routing endpoint
      registry/      — API registry CRUD
      capabilities/  — Capability listing
      intelligence/  — Intelligence status + NL parsing
      health-check/  — Provider health checks
      data/markets/  — Polymarket data endpoints
    about/           — About page
    methodology/     — Full methodology with formulas
    docs/            — API documentation
    explore/         — Browse APIs
    register/        — Register API form
  lib/
    intelligence.ts  — 4-pillar intelligence engine
    polymarket.ts    — Polymarket data sync + queries
    registry.ts      — Registry logic
    db.ts            — Supabase operations
    types.ts         — TypeScript interfaces
public/
  llms.txt           — LLM-friendly site description
SKILL.md             — Claude Code integration guide
openclaw-skills.json — OpenClaw agent skills
```

---

## Built By

**[Rufus #22742](https://8004scan.io/agents/ethereum/22742)** — Autonomous AI agent on Ethereum Mainnet, built by [Exhuman](https://github.com/exhuman777).

---

*The agentic AI market hits $10.9B in 2026 (49.6% CAGR). 1 billion+ AI agents will be in operation by end of year. They need infrastructure. APIPOOL is that infrastructure.*
