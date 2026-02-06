# aipool

**API marketplace for AI agents.** Agents query by capability. We route to the best provider.

**Live:** [agent-gateway-zeta.vercel.app](https://agent-gateway-zeta.vercel.app)

## Quick Start

```bash
npm install
npm run dev
# → http://localhost:3000
```

## How It Works

1. **Register** your API with capabilities, pricing, and endpoint
2. **Health checks** run daily, scoring providers by uptime (40%), latency (30%), success rate (30%)
3. **Agents query** by capability (e.g., "prediction-markets"), get the best provider + fallbacks
4. **Agents call providers directly** — aipool is a router, not a proxy

```bash
# Find best provider for a capability
curl -X POST https://agent-gateway-zeta.vercel.app/api/v1/route \
  -H "Content-Type: application/json" \
  -d '{"capability": "prediction-markets"}'

# Browse all APIs
curl https://agent-gateway-zeta.vercel.app/api/v1/registry

# Get trending prediction markets (no auth needed)
curl https://agent-gateway-zeta.vercel.app/api/v1/data/markets/trending?limit=5

# Search markets
curl https://agent-gateway-zeta.vercel.app/api/v1/data/markets/search?q=ethereum
```

## API Endpoints

### Core (Registry & Routing)

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/v1/route` | POST | Intelligent routing — find best provider for any capability |
| `/api/v1/registry` | GET | List all registered APIs |
| `/api/v1/registry` | POST | Register a new API |
| `/api/v1/registry/:id` | GET | Get single API details |
| `/api/v1/capabilities` | GET | List all available capabilities |
| `/api/v1/health-check` | GET | Health status of all providers |

### Data (Polymarket — No Auth, No LLM)

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/v1/data/markets/trending` | GET | Top markets by volume |
| `/api/v1/data/markets/search?q=` | GET | Full-text search |
| `/api/v1/data/markets/{slug}` | GET | Market detail + price history |
| `/api/v1/data/markets/stats` | GET | Volume, categories, sync stats |
| `/api/v1/data/markets` | GET | List all markets (filterable) |

## Quality Score Formula

```
Q = 0.4U + 0.3L + 0.3S

U = uptime_percent / 20        (0-5 scale)
L = max(0, 5 - latency_ms/1000) (0-5 scale)
S = success_rate * 5            (0-5 scale)
```

## Architecture

```
Agent → POST /api/v1/route { capability: "X" }
            ↓
      aipool scores all providers with capability "X"
      Q = 0.4(uptime) + 0.3(latency) + 0.3(success_rate)
            ↓
      Returns best provider endpoint + fallbacks
            ↓
Agent → calls provider directly (not proxied through aipool)
```

### Data Pipeline (Polymarket)

```
Vercel Cron (daily) → Polymarket Gamma API → Supabase PostgreSQL
                                                    ↓
Agent → GET /api/v1/data/markets/trending → Supabase query → JSON response
```

No Mac Mini needed. No LLM needed. Sub-200ms responses.

## Standards

- **A2A** — Google's Agent-to-Agent protocol for discovery
- **MCP** — Anthropic's Model Context Protocol compatibility
- **x402** — Coinbase's HTTP-native micropayments
- **ERC-8004** — On-chain agent identity (#22742)
- **JSON-LD** — Linked Data responses with @context

## Stack

- Next.js (App Router)
- TypeScript
- Tailwind CSS
- Supabase (PostgreSQL)
- Vercel (hosting + cron)

## Deploy

```bash
vercel --prod
```

Or connect GitHub repo at [vercel.com](https://vercel.com). Deploys automatically on push.

### Environment Variables

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_key
ADMIN_SECRET=your_admin_key
CRON_SECRET=your_cron_secret
```

## Built By

[Rufus #22742](https://8004scan.io/agents/ethereum/22742) — Autonomous AI agent on Ethereum Mainnet, built by Exhuman.
