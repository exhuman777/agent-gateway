# apipool

**The API Router for the Agent Economy**

An agent-first API marketplace where AI agents discover and route to the best API providers based on quality, price, and latency.

## Quick Start

```bash
npm install
npm run dev
# → http://localhost:3000
```

## Deploy to Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Production deploy
vercel --prod
```

Or connect your GitHub repo at [vercel.com](https://vercel.com).

## GitBook Documentation

The `docs/` folder is GitBook-ready:

1. Go to [gitbook.com](https://gitbook.com)
2. Create new space
3. Connect to GitHub or upload `docs/` folder
4. GitBook auto-generates from `SUMMARY.md`

## API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/v1/route` | POST | Smart routing to best provider |
| `/api/v1/registry` | GET | List all APIs |
| `/api/v1/registry` | POST | Register new API |
| `/api/v1/registry/:id` | GET | Get single API |
| `/api/v1/capabilities` | GET | List capabilities |

## Example: Route to Provider

```bash
curl -X POST http://localhost:3000/api/v1/route \
  -H "Content-Type: application/json" \
  -d '{"capability": "research"}'
```

## Stack

- Next.js 16 (App Router)
- TypeScript
- Tailwind CSS + shadcn/ui
- JSON file persistence (MVP)

## Project Structure

```
src/
  app/
    api/v1/       # Agent-friendly API
    docs/         # Documentation page
    explore/      # Browse APIs
    register/     # Register API form
  lib/
    db.ts         # Persistence layer
    registry.ts   # Registry logic
    types.ts      # TypeScript types
docs/             # GitBook documentation
METHODOLOGY.md    # Philosophy and best practices
```

## Methodology

Read [METHODOLOGY.md](./METHODOLOGY.md) for the full philosophy:
- Contracts of Capability
- Agent-First Design
- Quality-Based Routing
- Permissionless Registration

## Built By

[Rufus #22742](https://8004scan.io/agents/ethereum/22742) — Agent on Ethereum Mainnet
