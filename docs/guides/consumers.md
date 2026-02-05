# Guide: For Consumers (Agents)

Best practices for agents consuming APIs through apipool.

## 1. Query by Capability, Not Name

Don't hardcode provider names. Query by capability for resilience:

```typescript
// Good
const provider = await apipool.route({ capability: "research" });

// Bad
const provider = await apipool.get("rufus-research");
```

If a provider goes down, the router automatically finds alternatives.

## 2. Set Preferences

Be explicit about your requirements:

```typescript
const provider = await apipool.route({
  capability: "research",
  preferences: {
    max_latency_ms: 2000,    // Fast responses
    max_price: 0.01,          // Budget constraint
    min_quality_score: 4.5    // High quality only
  }
});
```

## 3. Handle Fallbacks

Request fallback providers for resilience:

```typescript
const { data } = await fetch('/api/v1/route', {
  method: 'POST',
  body: JSON.stringify({
    capability: "research",
    fallback_count: 3
  })
}).then(r => r.json());

const providers = [data.provider, ...data.fallbacks];

for (const provider of providers) {
  try {
    return await callProvider(provider, input);
  } catch (error) {
    console.log(`Provider ${provider.name} failed, trying next...`);
    continue;
  }
}
throw new Error('All providers failed');
```

## 4. Cache Discovery

The registry changes slowly. Cache results:

```typescript
let cachedProviders: Map<string, Provider> = new Map();
let cacheTime = 0;
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

async function getProvider(capability: string) {
  const now = Date.now();

  if (now - cacheTime > CACHE_TTL) {
    const response = await fetch('/api/v1/registry');
    const { data } = await response.json();

    cachedProviders = new Map(
      data.apis.map(api => [api.id, api])
    );
    cacheTime = now;
  }

  // Find best provider for capability
  return Array.from(cachedProviders.values())
    .filter(p => p.capabilities.includes(capability))
    .sort((a, b) => b.metrics.quality_score - a.metrics.quality_score)[0];
}
```

## 5. Validate Before Calling

Check provider schemas match your expectations:

```typescript
const provider = await getProvider("research");

// Check A2A card if available
if (provider.a2a_card) {
  const card = await fetch(provider.a2a_card).then(r => r.json());

  // Validate input schema
  const inputSchema = card.capabilities?.research?.input_schema;
  if (!validateInput(myInput, inputSchema)) {
    throw new Error('Input does not match provider schema');
  }
}
```

## 6. Track Metrics

Monitor provider performance for your own analytics:

```typescript
async function callWithMetrics(provider, input) {
  const start = Date.now();

  try {
    const result = await callProvider(provider, input);

    metrics.record({
      provider: provider.id,
      latency_ms: Date.now() - start,
      success: true
    });

    return result;
  } catch (error) {
    metrics.record({
      provider: provider.id,
      latency_ms: Date.now() - start,
      success: false,
      error: error.message
    });

    throw error;
  }
}
```

## Example: Research Agent

Complete example of an agent using apipool:

```typescript
class ResearchAgent {
  private apipool: string;

  constructor(apipool = 'https://apipool.dev') {
    this.apipool = apipool;
  }

  async research(query: string): Promise<ResearchResult> {
    // 1. Find best provider
    const routeResponse = await fetch(`${this.apipool}/api/v1/route`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        capability: 'research',
        preferences: {
          max_latency_ms: 5000,
          min_quality_score: 4.0
        },
        fallback_count: 2
      })
    }).then(r => r.json());

    if (!routeResponse.success) {
      throw new Error(routeResponse.error.message);
    }

    const providers = [
      routeResponse.data.provider,
      ...routeResponse.data.fallbacks
    ];

    // 2. Try providers in order
    for (const provider of providers) {
      try {
        const result = await fetch(provider.endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ query })
        }).then(r => r.json());

        return {
          ...result,
          provider: provider.name,
          cost: provider.pricing.price
        };
      } catch (error) {
        console.log(`Provider ${provider.name} failed:`, error);
        continue;
      }
    }

    throw new Error('All providers failed');
  }
}
```
