# AGENTS.md

## Project Overview

Agent Gateway - A dual-interface platform exposing AI capabilities as APIs.
Human-facing dashboard + Agent-facing API. Next.js 15 + Tailwind + shadcn/ui.

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
    api/         # API routes (health, research, market-analysis, briefing)
    dashboard/   # Human-facing dashboard
    page.tsx     # Landing page
  components/
    ui/          # shadcn components
  lib/           # Utilities (ollama.ts, etc.)
public/
  .well-known/   # A2A agent-card.json
```

## Key Files

- `src/lib/ollama.ts` - Ollama integration
- `src/app/api/*/route.ts` - API endpoints
- `public/.well-known/agent-card.json` - A2A discovery

## Environment

Required:
- `OLLAMA_URL` (default: http://localhost:11434)
- `OLLAMA_MODEL` (default: qwen2.5:14b)

Optional (for subscriptions):
- `STRIPE_SECRET_KEY`
- `STRIPE_WEBHOOK_SECRET`

## Don't Touch

- `components.json` - shadcn config
- `tailwind.config.ts` - generated
- `package-lock.json` - auto-generated

## PR Checklist

- [ ] `npm run lint` passes
- [ ] `npm run build` succeeds
- [ ] API changes update agent-card.json
