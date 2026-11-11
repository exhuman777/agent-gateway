# AGENTS.md

Instructions for AI agents (standard https://agents.md; `CLAUDE.md` = `@AGENTS.md`). Human docs: `README.md`, `docs/`, scoring method: `METHODOLOGY.md`, agent-facing skill: `SKILL.md`.

## Project Overview

APIPOOL (repo agent-gateway) - API marketplace for AI agents: capability search, 4-pillar provider scoring, routing, MCP server, x402 USDC micropayments.
Human-facing dashboard + Agent-facing API. Next.js 16 + React 19 + Tailwind 4 + shadcn/ui, Supabase, deployed on Vercel.

## Quick Start

```bash
npm install
npm run dev
# → http://localhost:3000
```

## Build & Test

```bash
npm run build
npm run lint
```

## Code Style

- TypeScript strict mode
- Tailwind for styling (dark mode default)
- shadcn/ui components in `src/components/ui/`
- API routes use Next.js App Router conventions

## Architecture

```
src/
  app/
    api/         # API routes (v1/, registry, health, research, market-analysis, briefing)
    dashboard/   # Human-facing dashboard
    page.tsx     # Landing page
  components/
    ui/          # shadcn components
  lib/           # registry, intelligence (scoring), supabase/db, x402, ratelimit, freetier, usage, ollama, brave, polymarket
mcp-server/      # MCP server (index.ts, own package.json)
public/
  .well-known/   # A2A agent-card.json
```

## Key Files

- `src/lib/ollama.ts` - Ollama integration
- `src/lib/intelligence.ts`, `src/lib/registry.ts` - scoring and provider registry
- `src/lib/x402.ts` - x402 payments
- `supabase-*.sql` - database migrations
- `src/app/api/*/route.ts` - API endpoints
- `public/.well-known/agent-card.json` - A2A discovery

## Environment

Required:
- `OLLAMA_URL` (default: http://localhost:11434)
- `OLLAMA_MODEL` (default: qwen2.5:14b)

Used in code:
- `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `NEXT_PUBLIC_APP_URL`
- `ADMIN_API_KEY`, `CRON_SECRET`, `BRAVE_API_KEY`
- `X402_FACILITATOR_URL`, `X402_WALLET_ADDRESS`, `X402_NETWORK`

Optional (for subscriptions, Stripe packages installed but not read in `src/` yet):
- `STRIPE_SECRET_KEY`
- `STRIPE_WEBHOOK_SECRET`

Never commit values: `.env*` stays out of git.

## Don't Touch

- `components.json` - shadcn config
- `tailwind.config.ts` - generated
- `package-lock.json` - auto-generated

## PR Checklist

- [ ] `npm run lint` passes
- [ ] `npm run build` succeeds
- [ ] API changes update agent-card.json
