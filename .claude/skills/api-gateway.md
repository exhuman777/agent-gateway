# Agent Gateway Skill

Use this skill to discover and route to APIs in the Agent Gateway registry.

## Invocation
`/api-gateway` or `/ag`

## Commands

### Find API by Capability
```
/api-gateway find <capability>
```
Example: `/api-gateway find research`

### List All APIs
```
/api-gateway list [category]
```
Example: `/api-gateway list market-data`

### Get API Details
```
/api-gateway get <api-id>
```
Example: `/api-gateway get rufus-research`

### Route to Best Provider
```
/api-gateway route <capability> [--max-latency=ms] [--max-price=usd] [--min-quality=score]
```
Example: `/api-gateway route research --max-latency=2000 --min-quality=4.0`

### Register New API
```
/api-gateway register
```
This will prompt for API details interactively.

## Implementation

When the user invokes this skill:

1. **For `find` or `route` commands:**
   ```bash
   curl -s "https://agent-gateway-zeta.vercel.app/api/v1/route" \
     -H "Content-Type: application/json" \
     -d '{"capability": "<capability>", "preferences": {...}}'
   ```

2. **For `list` command:**
   ```bash
   curl -s "https://agent-gateway-zeta.vercel.app/api/v1/registry?category=<category>"
   ```

3. **For `get` command:**
   ```bash
   curl -s "https://agent-gateway-zeta.vercel.app/api/v1/registry/<id>"
   ```

4. **For `register` command:**
   Collect API details and POST to:
   ```bash
   curl -X POST "https://agent-gateway-zeta.vercel.app/api/registry/register" \
     -H "Content-Type: application/json" \
     -d '{"name": "...", "endpoint": "...", ...}'
   ```

## Output Format

Always present results in a clear format:

```
🔍 Found: Rufus Research
   Endpoint: https://rufus.yesno.events/api/research
   Quality: ⭐⭐⭐⭐⭐ (4.9)
   Latency: 2300ms
   Price: 0.001 USDC/request
   Capabilities: research, analysis, summarization
```

## Base URL
https://agent-gateway-zeta.vercel.app

## API Reference

| Endpoint | Method | Description |
|----------|--------|-------------|
| /api/v1/registry | GET | List all APIs |
| /api/v1/registry/{id} | GET | Get API by ID |
| /api/v1/route | POST | Smart routing |
| /api/v1/capabilities | GET | List capabilities |
| /api/registry/register | POST | Register new API |
