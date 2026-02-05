# Build Your Own Agent-Ready API

This guide shows you how to build an API that AI agents will love to use.

## Quick Start

### 1. Your API Must Return JSON

```javascript
// Good - structured response
{
  "success": true,
  "data": {
    "result": "Your API output here",
    "confidence": 0.95
  }
}

// Bad - unstructured text
"Here's the result of your query..."
```

### 2. Accept JSON Input

```javascript
// Endpoint: POST /api/your-capability
// Content-Type: application/json

{
  "query": "What is the capital of France?",
  "options": {
    "language": "en",
    "format": "concise"
  }
}
```

### 3. Return Errors as JSON

```javascript
{
  "success": false,
  "error": {
    "code": "INVALID_INPUT",
    "message": "Query cannot be empty",
    "field": "query"
  }
}
```

## Full Implementation Example (Node.js)

```javascript
// api/research.js
import express from 'express';

const app = express();
app.use(express.json());

app.post('/api/research', async (req, res) => {
  const startTime = Date.now();

  try {
    const { query, context } = req.body;

    // Validate input
    if (!query || query.trim().length === 0) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'INVALID_INPUT',
          message: 'Query is required',
          field: 'query'
        }
      });
    }

    // Your research logic here
    const result = await doResearch(query, context);

    // Return structured response
    res.json({
      success: true,
      data: {
        query: query,
        result: result.summary,
        sources: result.sources,
        confidence: result.confidence
      },
      meta: {
        latency_ms: Date.now() - startTime,
        model: 'gpt-4',
        timestamp: new Date().toISOString()
      }
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: error.message
      }
    });
  }
});

// Health endpoint for monitoring
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    version: '1.0.0',
    uptime_seconds: process.uptime()
  });
});

app.listen(3000);
```

## Agent Card (A2A Protocol)

Create `/.well-known/agent-card.json`:

```json
{
  "name": "My Research API",
  "description": "Deep research on any topic using GPT-4",
  "url": "https://your-api.com",
  "version": "1.0.0",
  "capabilities": {
    "streaming": false,
    "push_notifications": false
  },
  "skills": [
    {
      "id": "research",
      "name": "Research",
      "description": "Comprehensive research on any topic",
      "input_schema": {
        "type": "object",
        "properties": {
          "query": {
            "type": "string",
            "description": "Research question"
          },
          "context": {
            "type": "string",
            "description": "Additional context"
          }
        },
        "required": ["query"]
      }
    }
  ],
  "authentication": {
    "schemes": ["api_key"]
  },
  "pricing": {
    "model": "per_request",
    "price": 0.01,
    "currency": "USD"
  }
}
```

## Register with Agent Gateway

```bash
curl -X POST https://agent-gateway-zeta.vercel.app/api/registry/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "My Research API",
    "description": "Deep research on any topic using GPT-4",
    "endpoint": "https://your-api.com/api/research",
    "category": "research",
    "capabilities": ["research", "analysis", "summarization"],
    "pricing": {
      "model": "per_request",
      "price": 0.01,
      "currency": "USD",
      "freeQuota": 10
    },
    "a2aCard": "https://your-api.com/.well-known/agent-card.json",
    "providerWallet": "0xYourWalletAddress"
  }'
```

## Quality Score Factors

Your quality score (0-5) depends on:

| Factor | Weight | How to Improve |
|--------|--------|----------------|
| Uptime | 40% | Use reliable hosting, add redundancy |
| Latency | 30% | Cache responses, optimize code, use CDN |
| Success Rate | 30% | Handle errors gracefully, validate inputs |

## Best Practices

### 1. Be Deterministic
Same input should produce consistent output format (content can vary).

### 2. Fast Responses
- Aim for <2 seconds for simple queries
- Return partial results with streaming for long operations
- Use caching where appropriate

### 3. Validate Inputs
Don't crash on bad input. Return helpful error messages.

### 4. Include Metadata
```json
{
  "success": true,
  "data": { ... },
  "meta": {
    "latency_ms": 1234,
    "model": "gpt-4",
    "tokens_used": 500,
    "cached": false
  }
}
```

### 5. Support Health Checks
Expose `/health` endpoint that returns quickly:
```json
{
  "status": "healthy",
  "version": "1.0.0"
}
```

### 6. Document Your Capabilities
Use clear capability tags that agents can search for:
- `research` - general research
- `code` - code generation/analysis
- `market-data` - financial data
- `summarization` - text summarization
- etc.

## Pricing Models

### Free
Best for discovery. Set a daily quota to prevent abuse.

### Per Request (x402)
Agent pays per API call via HTTP 402 micropayments.
```json
{
  "model": "x402",
  "price": 0.001,
  "currency": "USDC"
}
```

### Subscription
Monthly fee for high-volume users.

## Security Checklist

- [ ] Use HTTPS only
- [ ] Validate all inputs
- [ ] Rate limit requests
- [ ] Don't expose internal errors
- [ ] Log suspicious activity
- [ ] Accept payments via x402 for premium features

## Testing Your API

### 1. Check Agent Card
```bash
curl https://your-api.com/.well-known/agent-card.json | jq
```

### 2. Test Main Endpoint
```bash
curl -X POST https://your-api.com/api/research \
  -H "Content-Type: application/json" \
  -d '{"query": "test query"}'
```

### 3. Check Health
```bash
curl https://your-api.com/health
```

### 4. Verify in Registry
```bash
curl https://agent-gateway-zeta.vercel.app/api/v1/registry | jq '.data.apis[] | select(.name=="My Research API")'
```

## Need Help?

- Read the full methodology: [METHODOLOGY.md](/METHODOLOGY.md)
- Check the agent card spec: [A2A Protocol](https://google.github.io/a2a-spec/)
- Join the agent economy!
