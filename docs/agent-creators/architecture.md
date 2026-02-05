# Agent Creator Guide: Architecture Overview

You're building AI agents. This guide shows you how to integrate Agent Gateway so your agents can discover and use APIs autonomously.

---

## Architecture Options

### Option 1: Direct API Calls
Your agent calls Agent Gateway directly via HTTP.

```
Your Agent → Agent Gateway → Get Provider → Call Provider
```

Best for: Simple agents, any language.

### Option 2: MCP Server
Install our MCP (Model Context Protocol) server for Claude integration.

```
Claude → MCP Server → Agent Gateway → Provider
```

Best for: Claude-based agents, natural language API discovery.

### Option 3: Claude Code Skill
Add our skill file for Claude Code users.

```
User: "/api-gateway find research"
Claude Code → Skill → Agent Gateway
```

Best for: Developer productivity.

---

## Option 1: Direct API Integration

### Python SDK Pattern

```python
import requests
from typing import Optional, Dict, Any

class AgentGateway:
    BASE_URL = "https://agent-gateway-zeta.vercel.app"

    def __init__(self, cache_ttl: int = 300):
        self.cache = {}
        self.cache_ttl = cache_ttl

    def route(
        self,
        capability: str,
        max_latency_ms: Optional[int] = None,
        max_price: Optional[float] = None,
        min_quality: Optional[float] = None
    ) -> Dict[str, Any]:
        """Find the best provider for a capability."""
        preferences = {}
        if max_latency_ms:
            preferences["max_latency_ms"] = max_latency_ms
        if max_price:
            preferences["max_price"] = max_price
        if min_quality:
            preferences["min_quality_score"] = min_quality

        response = requests.post(
            f"{self.BASE_URL}/api/v1/route",
            json={
                "capability": capability,
                "preferences": preferences
            }
        )
        return response.json()["data"]["provider"]

    def search(
        self,
        category: Optional[str] = None,
        capabilities: Optional[list] = None,
        min_quality: Optional[float] = None,
        sort_by: str = "quality"
    ) -> list:
        """Search for APIs matching criteria."""
        params = {"sortBy": sort_by}
        if category:
            params["category"] = category
        if capabilities:
            params["capabilities"] = ",".join(capabilities)
        if min_quality:
            params["minQuality"] = min_quality

        response = requests.get(
            f"{self.BASE_URL}/api/v1/registry",
            params=params
        )
        return response.json()["data"]["apis"]

    def get_capabilities(self) -> list:
        """List all available capabilities."""
        response = requests.get(f"{self.BASE_URL}/api/v1/capabilities")
        return response.json()["data"]["capabilities"]

    def call_provider(self, endpoint: str, data: dict) -> dict:
        """Call a provider's endpoint."""
        response = requests.post(endpoint, json=data)
        return response.json()


# Usage in your agent
gateway = AgentGateway()

# Find and call best research provider
provider = gateway.route("research", min_quality=4.0)
result = gateway.call_provider(
    provider["endpoint"],
    {"query": "What is DeFi?"}
)
```

### TypeScript SDK Pattern

```typescript
interface Provider {
  id: string;
  name: string;
  endpoint: string;
  quality_score: number;
}

class AgentGateway {
  private baseUrl = "https://agent-gateway-zeta.vercel.app";

  async route(
    capability: string,
    preferences?: {
      max_latency_ms?: number;
      max_price?: number;
      min_quality_score?: number;
    }
  ): Promise<Provider> {
    const response = await fetch(`${this.baseUrl}/api/v1/route`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ capability, preferences }),
    });
    const data = await response.json();
    return data.data.provider;
  }

  async search(filters?: {
    category?: string;
    capabilities?: string[];
    minQuality?: number;
    sortBy?: "quality" | "price" | "latency";
  }): Promise<Provider[]> {
    const params = new URLSearchParams();
    if (filters?.category) params.set("category", filters.category);
    if (filters?.capabilities)
      params.set("capabilities", filters.capabilities.join(","));
    if (filters?.minQuality)
      params.set("minQuality", String(filters.minQuality));
    if (filters?.sortBy) params.set("sortBy", filters.sortBy);

    const response = await fetch(
      `${this.baseUrl}/api/v1/registry?${params}`
    );
    const data = await response.json();
    return data.data.apis;
  }

  async callProvider<T>(endpoint: string, data: object): Promise<T> {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    return response.json();
  }
}

// Usage
const gateway = new AgentGateway();

const provider = await gateway.route("research", {
  min_quality_score: 4.0,
});

const result = await gateway.callProvider(provider.endpoint, {
  query: "Explain smart contracts",
});
```

---

## Option 2: MCP Server

### Installation

```bash
# Clone the repo
git clone https://github.com/exhuman777/agent-gateway
cd agent-gateway/mcp-server

# Install dependencies
npm install
```

### Configuration

Add to your Claude config (`~/.claude/config.json`):

```json
{
  "mcpServers": {
    "agent-gateway": {
      "command": "npx",
      "args": ["tsx", "/path/to/mcp-server/index.ts"]
    }
  }
}
```

### Available Tools

Once configured, Claude can use these tools:

| Tool | Description |
|------|-------------|
| `list_apis` | List all APIs with optional filters |
| `get_api` | Get details of a specific API |
| `route_to_provider` | Find best provider for capability |
| `list_capabilities` | List all capabilities |
| `register_api` | Register a new API |

### Example Conversation

```
User: Find me the best research API with quality score over 4.5

Claude: [uses route_to_provider tool]
I found Rufus Research with a quality score of 4.9. It offers:
- Deep research on any topic
- Latency: 2300ms
- Price: 0.001 USDC per request
- Endpoint: https://rufus.yesno.events/api/research
```

---

## Option 3: Claude Code Skill

### Installation

Copy the skill file to your project:

```bash
mkdir -p .claude/skills
cp /path/to/agent-gateway/.claude/skills/api-gateway.md .claude/skills/
```

### Usage

In Claude Code:

```
/api-gateway find research
/api-gateway list market-data
/api-gateway route research --min-quality=4.5
```

---

## Building Agent Pipelines

### Multi-Capability Pipeline

```python
class ResearchPipeline:
    def __init__(self):
        self.gateway = AgentGateway()

    async def research_and_summarize(self, topic: str) -> dict:
        # Step 1: Deep research
        research_provider = self.gateway.route("research")
        research_result = self.gateway.call_provider(
            research_provider["endpoint"],
            {"query": topic}
        )

        # Step 2: Summarize the research
        summary_provider = self.gateway.route("summarization")
        summary_result = self.gateway.call_provider(
            summary_provider["endpoint"],
            {"text": research_result["data"]["result"]}
        )

        return {
            "research": research_result,
            "summary": summary_result
        }
```

### Parallel Provider Calls

```python
import asyncio
import aiohttp

async def call_multiple_capabilities(capabilities: list[str], data: dict):
    gateway = AgentGateway()
    tasks = []

    async with aiohttp.ClientSession() as session:
        for cap in capabilities:
            provider = gateway.route(cap)
            task = session.post(provider["endpoint"], json=data)
            tasks.append(task)

        responses = await asyncio.gather(*tasks)
        return [await r.json() for r in responses]
```

### Fallback Pattern

```python
async def call_with_fallback(capability: str, data: dict, max_retries: int = 3):
    gateway = AgentGateway()

    # Get top providers sorted by quality
    providers = gateway.search(capabilities=[capability], sort_by="quality")

    for i, provider in enumerate(providers[:max_retries]):
        try:
            result = gateway.call_provider(provider["endpoint"], data)
            if result.get("success"):
                return result
        except Exception as e:
            if i == max_retries - 1:
                raise
            continue

    raise Exception("All providers failed")
```

---

## Testing Your Integration

### Mock Server

For testing, use a local mock:

```python
from unittest.mock import Mock, patch

def test_research_agent():
    mock_provider = {
        "id": "test-provider",
        "endpoint": "http://localhost:8000/api/test",
        "quality_score": 5.0
    }

    with patch.object(AgentGateway, "route", return_value=mock_provider):
        gateway = AgentGateway()
        provider = gateway.route("research")
        assert provider["quality_score"] == 5.0
```

### Integration Tests

```python
def test_live_routing():
    gateway = AgentGateway()

    # Should return a provider
    provider = gateway.route("research")
    assert provider is not None
    assert "endpoint" in provider
    assert provider["quality_score"] > 0
```

---

## Best Practices

1. **Cache routing results** — The registry doesn't change frequently
2. **Implement fallbacks** — Always have backup providers
3. **Set quality thresholds** — Don't route to low-quality providers
4. **Handle rate limits** — Implement exponential backoff
5. **Log provider performance** — Track which providers work best for you

---

## Next Steps

- [MCP Integration](mcp-integration.md)
- [Claude Code Skill](claude-skill.md)
- [Building Agent Pipelines](pipelines.md)
