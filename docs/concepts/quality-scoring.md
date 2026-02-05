# Quality Scoring

Every API in Agent Gateway has a quality score from 0 to 5. This score determines routing priority — higher quality APIs get more traffic.

---

## How It's Calculated

Quality score is a weighted average of three factors:

| Factor | Weight | Measurement |
|--------|--------|-------------|
| Uptime | 40% | Percentage of successful health checks |
| Latency | 30% | Average response time |
| Success Rate | 30% | Percentage of successful requests |

### Formula

```
quality_score = (
  (uptime_percent / 100) * 0.4 +
  (latency_score) * 0.3 +
  (success_rate) * 0.3
) * 5
```

Where:
- `uptime_percent` = successful health checks / total checks × 100
- `latency_score` = max(0, 1 - (latency_ms / 10000))
- `success_rate` = successful requests / total requests

---

## Health Checks

Health checks run every 6 hours. Each check:

1. Sends a request to your endpoint
2. Measures response time
3. Checks if response is valid

A check is successful if:
- Response status < 500
- Response time < 10 seconds

---

## Score Breakdown

| Score | Rating | Typical Profile |
|-------|--------|-----------------|
| 4.5 - 5.0 | Excellent | 99%+ uptime, <1s latency, 98%+ success |
| 4.0 - 4.5 | Very Good | 98%+ uptime, <2s latency, 95%+ success |
| 3.0 - 4.0 | Good | 95%+ uptime, <3s latency, 90%+ success |
| 2.0 - 3.0 | Fair | 90%+ uptime, <5s latency, 80%+ success |
| 0 - 2.0 | Poor | Below thresholds |

---

## Improving Your Score

### Increase Uptime
- Use reliable hosting (AWS, GCP, Vercel)
- Implement health endpoints
- Add redundancy / failover
- Monitor your service

### Reduce Latency
- Cache frequent responses
- Optimize database queries
- Use CDN for static assets
- Deploy closer to users

### Improve Success Rate
- Validate inputs thoroughly
- Handle errors gracefully
- Return consistent response formats
- Don't throw on edge cases

---

## Viewing Your Score

```bash
curl https://agent-gateway-zeta.vercel.app/api/v1/registry/your-api-id | jq '.data.metrics'
```

Response:
```json
{
  "quality_score": 4.9,
  "latency_ms": 2300,
  "uptime_percent": 99.2,
  "total_requests": 1247,
  "success_rate": 0.98,
  "last_checked": "2026-02-05T12:00:00Z"
}
```

---

## Score Updates

- Health checks run every 6 hours
- Scores use weighted averages (recent data weighted more)
- New APIs start at score 0 until first health check
- Scores can change by up to 0.5 per check

---

## Why Quality Matters

When agents route via `/api/v1/route`, providers are sorted by quality score. Higher quality = more traffic = more revenue.

The top provider for a capability can receive 80%+ of routing requests.
