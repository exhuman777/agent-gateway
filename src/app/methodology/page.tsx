import Link from "next/link";

export default function MethodologyPage() {
  return (
    <div className="min-h-screen bg-[#050505] text-[#e0e0e0]">
      {/* Nav */}
      <nav className="border-b border-white/5 backdrop-blur-md fixed top-0 w-full z-50 bg-[#050505]/80">
        <div className="max-w-4xl mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/" className="text-lg font-mono font-bold text-white tracking-wider">APIPOOL</Link>
            <span className="text-[10px] font-mono text-white/30 border border-white/10 px-1.5 py-0.5 rounded">methodology</span>
          </div>
          <div className="flex items-center gap-6">
            <Link href="/about" className="text-xs text-white/40 hover:text-white transition-colors font-mono">about</Link>
            <Link href="/docs" className="text-xs text-white/40 hover:text-white transition-colors font-mono">docs</Link>
            <Link href="/explore" className="text-xs text-white/40 hover:text-white transition-colors font-mono">explore</Link>
          </div>
        </div>
      </nav>

      <main className="pt-14 max-w-4xl mx-auto px-4 py-16">
        <h1 className="text-4xl font-mono font-bold text-white mb-4">Methodology</h1>
        <p className="text-sm text-white/40 font-mono mb-16 max-w-xl">
          How APIPOOL routes agents to the best API. Every formula, every decision, every score — documented.
        </p>

        {/* 1. THE ROUTING MODEL */}
        <section className="mb-20">
          <div className="text-xs font-mono text-white/20 mb-2">01</div>
          <h2 className="text-2xl font-mono font-bold text-white mb-6">The Routing Model</h2>

          <div className="text-sm font-mono text-white/50 leading-relaxed space-y-4 mb-8">
            <p>
              APIPOOL is a <span className="text-white">capability-based router</span>. Agents don&apos;t query by URL or
              provider name — they query by what they need. The gateway matches the request against all
              registered providers, scores them, and returns the best endpoint with fallbacks.
            </p>
            <p>
              This is fundamentally different from API gateways like Kong or Apigee, which route by
              path/URL. APIPOOL routes by <span className="text-white">semantic capability</span>. An agent requesting
              &quot;prediction-markets&quot; gets the best prediction market provider, regardless of its URL structure.
            </p>
          </div>

          <div className="border border-white/10 rounded-lg p-6 bg-white/[0.02] mb-8">
            <div className="text-xs font-mono text-white/30 mb-4">ROUTING FLOW</div>
            <pre className="text-xs font-mono text-white/40 leading-relaxed">
{`Agent Request                  APIPOOL                         Provider
     |                            |                              |
     |  POST /api/v1/route        |                              |
     |  { capability: "X" }       |                              |
     |--------------------------->|                              |
     |                            |  1. Find all providers       |
     |                            |     with capability "X"      |
     |                            |                              |
     |                            |  2. Score each provider:     |
     |                            |     Q = 0.4U + 0.3L + 0.3S  |
     |                            |                              |
     |                            |  3. Apply preference filters |
     |                            |     (max_latency, max_price) |
     |                            |                              |
     |                            |  4. Return top provider      |
     |                            |     + ranked fallbacks       |
     |  <-- { provider, fallbacks }                              |
     |                            |                              |
     |  Direct API call (not proxied)                            |
     |---------------------------------------------------------->|
     |  <-- Response                                             |`}
            </pre>
          </div>
        </section>

        {/* 2. THE 4 PILLARS OF INTELLIGENT ROUTING */}
        <section className="mb-20">
          <div className="text-xs font-mono text-white/20 mb-2">02</div>
          <h2 className="text-2xl font-mono font-bold text-white mb-6">4 Pillars of Intelligent Routing</h2>

          <div className="text-sm font-mono text-white/50 leading-relaxed space-y-4 mb-10">
            <p>
              APIPOOL goes beyond static quality scores. The intelligence layer applies four
              real-time systems that continuously adapt routing decisions. Each pillar produces
              a multiplier that adjusts the base quality score.
            </p>
          </div>

          <div className="border border-white/10 rounded-lg p-6 bg-white/[0.02] mb-10">
            <div className="text-center mb-4">
              <div className="text-base font-mono text-white">effective_score = base_quality x learning x predictive x anomaly</div>
              <div className="text-[10px] font-mono text-white/30 mt-1">where each multiplier is 0.5-1.2 based on live data</div>
            </div>
          </div>

          {/* Pillar 1 */}
          <div className="border border-white/10 rounded-lg p-6 bg-white/[0.02] mb-6">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-xs font-mono text-white/20 border border-white/10 px-2 py-0.5 rounded">P1</span>
              <h3 className="font-mono text-sm text-white">Self-Learning Routing</h3>
            </div>
            <p className="text-xs font-mono text-white/40 leading-relaxed mb-4">
              Every routing decision is recorded with its outcome. Providers that consistently
              deliver successful responses get a boost (up to 1.2x). Providers that fail after
              being selected get penalized (down to 0.8x). The system learns which providers
              actually work, not just which ones claim to work.
            </p>
            <div className="border border-white/5 rounded p-4 bg-black/20">
              <div className="text-[10px] font-mono text-white/30 mb-2">FORMULA</div>
              <pre className="text-xs font-mono text-white/40">
{`learning_multiplier = 1.0 + success_bonus + latency_bonus

success_bonus = (success_rate - 0.7) × 0.5
  // 100% success → +0.15, 50% → -0.10

latency_bonus = clamp(-0.05, (1500 - avg_latency) / 20000, +0.05)
  // <500ms → +0.05, >3000ms → -0.05

Based on 50 most recent routing events per provider.
Minimum 5 events required; returns 1.0 if insufficient data.`}
              </pre>
            </div>
          </div>

          {/* Pillar 2 */}
          <div className="border border-white/10 rounded-lg p-6 bg-white/[0.02] mb-6">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-xs font-mono text-white/20 border border-white/10 px-2 py-0.5 rounded">P2</span>
              <h3 className="font-mono text-sm text-white">Predictive Orchestration</h3>
            </div>
            <p className="text-xs font-mono text-white/40 leading-relaxed mb-4">
              Health check data is analyzed for trends. If latency is rising or success rate is
              dropping compared to the baseline, the provider is proactively demoted BEFORE it
              actually fails. This prevents agents from being routed to degrading providers.
            </p>
            <div className="border border-white/5 rounded p-4 bg-black/20">
              <div className="text-[10px] font-mono text-white/30 mb-2">ALGORITHM</div>
              <pre className="text-xs font-mono text-white/40">
{`Split last 10 health checks: recent (3) vs baseline (7)

latency_trend:
  recent_avg > baseline_avg × 1.2 → "degrading"
  recent_avg < baseline_avg × 0.8 → "improving"
  else → "stable"

success_trend:
  recent_rate < baseline_rate - 0.15 → "degrading"
  recent_rate > baseline_rate + 0.15 → "improving"

prediction:
  both degrading → "failing"    → multiplier: 0.7
  one degrading  → "at_risk"    → multiplier: 0.9
  else           → "healthy"    → multiplier: 1.0`}
              </pre>
            </div>
          </div>

          {/* Pillar 3 */}
          <div className="border border-white/10 rounded-lg p-6 bg-white/[0.02] mb-6">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-xs font-mono text-white/20 border border-white/10 px-2 py-0.5 rounded">P3</span>
              <h3 className="font-mono text-sm text-white">Anomaly Detection</h3>
            </div>
            <p className="text-xs font-mono text-white/40 leading-relaxed mb-4">
              Unusual provider behavior is flagged in real-time. Latency spikes, error bursts,
              and downtime events are detected by comparing recent checks against the baseline.
              Anomalies directly reduce the provider&apos;s effective score.
            </p>
            <div className="border border-white/5 rounded p-4 bg-black/20">
              <div className="text-[10px] font-mono text-white/30 mb-2">DETECTION RULES</div>
              <pre className="text-xs font-mono text-white/40">
{`latency_spike:
  recent_avg_latency > 2× baseline_avg → medium
  recent_avg_latency > 3× baseline_avg → high

error_burst:
  2/3 recent checks failed → medium
  3/3 recent checks failed → high (also triggers "downtime")

Score penalty:
  high anomaly  = -15% per anomaly
  medium anomaly = -5% per anomaly
  minimum multiplier = 0.5 (floor)`}
              </pre>
            </div>
          </div>

          {/* Pillar 4 */}
          <div className="border border-white/10 rounded-lg p-6 bg-white/[0.02] mb-6">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-xs font-mono text-white/20 border border-white/10 px-2 py-0.5 rounded">P4</span>
              <h3 className="font-mono text-sm text-white">Contextual Understanding</h3>
            </div>
            <p className="text-xs font-mono text-white/40 leading-relaxed mb-4">
              Agents don&apos;t need to know exact capability strings. They can send natural language
              queries like &quot;I need crypto market prices&quot; and APIPOOL parses it into the correct
              capability. No LLM involved — pure keyword extraction + capability mapping.
            </p>
            <div className="border border-white/5 rounded p-4 bg-black/20">
              <div className="text-[10px] font-mono text-white/30 mb-2">HOW IT WORKS</div>
              <pre className="text-xs font-mono text-white/40">
{`Input:  { "query": "latest crypto prediction market odds" }

Tokenize → ["latest", "crypto", "prediction", "market", "odds"]

Match against 9 capability maps:
  prediction-markets: "prediction" ✓, "odds" ✓    → score: 2
  market-data:        "market" ✓                    → score: 1
  crypto:             "crypto" ✓                    → score: 1
  news:               "latest" ✓                    → score: 1

Output: capability = "prediction-markets" (highest score)
        confidence = 0.5 (5 hits / 5 tokens × 0.5)

Test it: POST /api/v1/intelligence { "query": "..." }`}
              </pre>
            </div>
          </div>

          {/* Live endpoint */}
          <div className="border border-white/10 rounded-lg p-4 bg-white/[0.01]">
            <div className="text-xs font-mono text-white/30 mb-2">TRY IT LIVE</div>
            <pre className="text-xs font-mono text-white/40 overflow-x-auto">
{`# See intelligence system status
curl https://agent-gateway-zeta.vercel.app/api/v1/intelligence

# Test contextual understanding
curl -X POST https://agent-gateway-zeta.vercel.app/api/v1/intelligence \\
  -H "Content-Type: application/json" \\
  -d '{"query": "I need crypto market prediction data"}'

# Route with natural language (no capability string needed)
curl -X POST https://agent-gateway-zeta.vercel.app/api/v1/route \\
  -H "Content-Type: application/json" \\
  -d '{"query": "trending prediction market odds"}'`}
            </pre>
          </div>
        </section>

        {/* 3. QUALITY SCORE FORMULA */}
        <section className="mb-20">
          <div className="text-xs font-mono text-white/20 mb-2">03</div>
          <h2 className="text-2xl font-mono font-bold text-white mb-6">Base Quality Score Formula</h2>

          <div className="text-sm font-mono text-white/50 leading-relaxed mb-8">
            <p>
              Every provider gets a composite quality score updated by daily health checks.
              The score determines routing priority.
            </p>
          </div>

          <div className="border border-white/10 rounded-lg p-8 bg-white/[0.02] mb-8">
            <div className="text-center mb-6">
              <div className="text-lg font-mono text-white mb-2">Q = 0.4U + 0.3L + 0.3S</div>
              <div className="text-xs font-mono text-white/30">where Q is the quality score (0-5)</div>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              <div className="border border-white/5 rounded p-4">
                <div className="text-xs font-mono text-white/30 mb-2">U — Uptime Score (40%)</div>
                <div className="text-[10px] font-mono text-white/40 space-y-2">
                  <div>U = uptime_percent / 20</div>
                  <div className="text-white/20">99.5% uptime = 4.975</div>
                  <div className="text-white/20">95.0% uptime = 4.750</div>
                  <div className="text-white/20">Measured via daily health checks</div>
                  <div className="text-white/20">Heaviest weight — reliability matters most</div>
                </div>
              </div>

              <div className="border border-white/5 rounded p-4">
                <div className="text-xs font-mono text-white/30 mb-2">L — Latency Score (30%)</div>
                <div className="text-[10px] font-mono text-white/40 space-y-2">
                  <div>L = max(0, 5 - latency_ms / 1000)</div>
                  <div className="text-white/20">200ms = 4.800</div>
                  <div className="text-white/20">1000ms = 4.000</div>
                  <div className="text-white/20">5000ms+ = 0.000</div>
                  <div className="text-white/20">Measured from Vercel IAD1 region</div>
                </div>
              </div>

              <div className="border border-white/5 rounded p-4">
                <div className="text-xs font-mono text-white/30 mb-2">S — Success Rate (30%)</div>
                <div className="text-[10px] font-mono text-white/40 space-y-2">
                  <div>S = success_rate * 5</div>
                  <div className="text-white/20">0.98 = 4.900</div>
                  <div className="text-white/20">0.95 = 4.750</div>
                  <div className="text-white/20">0.80 = 4.000</div>
                  <div className="text-white/20">Only 2xx responses count as success</div>
                </div>
              </div>
            </div>
          </div>

          <div className="border border-white/10 rounded-lg p-6 bg-white/[0.02]">
            <div className="text-xs font-mono text-white/30 mb-3">EXAMPLE CALCULATION</div>
            <pre className="text-xs font-mono text-white/40 leading-relaxed">
{`Provider: Polymarket Historical Data API
  Uptime:       99.5%  → U = 99.5 / 20 = 4.975
  Latency:      180ms  → L = 5 - 0.18  = 4.820
  Success Rate: 0.99   → S = 0.99 * 5   = 4.950

  Q = 0.4(4.975) + 0.3(4.820) + 0.3(4.950)
  Q = 1.990 + 1.446 + 1.485
  Q = 4.921

This provider routes first for "market-data" capability.`}
            </pre>
          </div>
        </section>

        {/* 4. HEALTH CHECKS */}
        <section className="mb-20">
          <div className="text-xs font-mono text-white/20 mb-2">04</div>
          <h2 className="text-2xl font-mono font-bold text-white mb-6">Health Check System</h2>

          <div className="text-sm font-mono text-white/50 leading-relaxed space-y-4 mb-8">
            <p>
              APIPOOL runs automated health checks via Vercel Cron. Every check pings each provider&apos;s
              endpoint, measures response time, validates the response format, and updates the quality score.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="border border-white/10 rounded-lg p-6">
              <div className="text-xs font-mono text-white/30 mb-3">WHAT WE CHECK</div>
              <div className="space-y-2 text-xs font-mono text-white/40">
                <div>1. Endpoint responds with 2xx</div>
                <div>2. Response is valid JSON</div>
                <div>3. Response time under 5 seconds</div>
                <div>4. Contains expected structure</div>
                <div>5. TLS certificate valid</div>
              </div>
            </div>
            <div className="border border-white/10 rounded-lg p-6">
              <div className="text-xs font-mono text-white/30 mb-3">SCORING RULES</div>
              <div className="space-y-2 text-xs font-mono text-white/40">
                <div>+ Healthy response: success_count++</div>
                <div>+ Failed check: uptime drops proportionally</div>
                <div>+ 3 consecutive failures: provider marked degraded</div>
                <div>+ 10 consecutive failures: provider deactivated</div>
                <div>+ Recovery: score rebuilds over next 7 checks</div>
              </div>
            </div>
          </div>
        </section>

        {/* 5. DATA PIPELINE */}
        <section className="mb-20">
          <div className="text-xs font-mono text-white/20 mb-2">05</div>
          <h2 className="text-2xl font-mono font-bold text-white mb-6">Data Pipeline Architecture</h2>

          <div className="text-sm font-mono text-white/50 leading-relaxed space-y-4 mb-8">
            <p>
              The Polymarket data pipeline demonstrates how APIPOOL serves pre-computed data without
              requiring an LLM or any always-on infrastructure. This is the reference architecture
              for data providers on APIPOOL.
            </p>
          </div>

          <div className="border border-white/10 rounded-lg p-6 bg-white/[0.02] mb-8">
            <pre className="text-xs font-mono text-white/40 leading-relaxed overflow-x-auto">
{`┌─────────────────────────────────────────────────────────────┐
│                    DAILY SYNC (Vercel Cron)                  │
│                                                             │
│  12:00 UTC ──► Polymarket Gamma API                         │
│                    │                                        │
│                    ▼                                        │
│              Fetch 90 markets:                              │
│              · 50 by volume (trending)                      │
│              · 20 by start date (new)                       │
│              · 20 by end date (recently closed)             │
│                    │                                        │
│                    ▼                                        │
│              Categorize (7 categories):                     │
│              crypto, politics, sports, economics,           │
│              tech, culture, science, other                  │
│                    │                                        │
│                    ▼                                        │
│              Upsert to Supabase PostgreSQL                  │
│              · polymarket_markets (current state)           │
│              · polymarket_snapshots (price history)         │
│                                                             │
└─────────────────────────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│                 QUERY LAYER (Vercel Edge)                    │
│                                                             │
│  /markets/trending ──► SELECT * ORDER BY volume DESC        │
│  /markets/search?q= ──► SELECT * WHERE question ILIKE      │
│  /markets/{slug}   ──► SELECT * + JOIN snapshots            │
│  /markets/stats    ──► COUNT, SUM(volume), categories       │
│                                                             │
│  Response time: <200ms (Supabase + Vercel = fast)           │
│  Availability: 99.9%+ (no Mac Mini dependency)              │
│  LLM required: none (pure SQL queries)                      │
└─────────────────────────────────────────────────────────────┘`}
            </pre>
          </div>

          <div className="border border-white/10 rounded-lg p-6">
            <div className="text-xs font-mono text-white/30 mb-3">WHY THIS ARCHITECTURE</div>
            <div className="grid md:grid-cols-2 gap-4 text-xs font-mono text-white/40">
              <div className="space-y-2">
                <div><span className="text-white/60">Offline-proof:</span> Mac Mini can sleep. Data is in Supabase.</div>
                <div><span className="text-white/60">No LLM costs:</span> Pre-computed data. $0 per query.</div>
                <div><span className="text-white/60">Fast:</span> PostgreSQL query, not API chain.</div>
              </div>
              <div className="space-y-2">
                <div><span className="text-white/60">Historical:</span> Snapshots track price changes over time.</div>
                <div><span className="text-white/60">Scalable:</span> Supabase handles concurrent reads.</div>
                <div><span className="text-white/60">Auditable:</span> Every sync is logged with counts.</div>
              </div>
            </div>
          </div>
        </section>

        {/* 6. WHY THIS IS THE FUTURE */}
        <section className="mb-20">
          <div className="text-xs font-mono text-white/20 mb-2">06</div>
          <h2 className="text-2xl font-mono font-bold text-white mb-6">Why This Is the Future</h2>

          <div className="text-sm font-mono text-white/50 leading-relaxed space-y-6">
            <div>
              <h3 className="text-white mb-2">The Agent Internet is Being Built Now</h3>
              <p>
                IBM and Salesforce estimate over <span className="text-white">1 billion AI agents</span> will be
                in operation by end of 2026. Gartner predicts 40% of enterprise applications will embed
                task-specific AI agents. x402 has processed 35M+ transactions with $10M+ volume.
                ERC-8004 launched on Ethereum mainnet. This isn&apos;t theoretical — it&apos;s production infrastructure.
              </p>
            </div>

            <div>
              <h3 className="text-white mb-2">APIs Need a Discovery Layer</h3>
              <p>
                Google&apos;s A2A protocol (backed by <span className="text-white">100+ companies</span> including
                Microsoft, Salesforce, SAP, PayPal — now under Linux Foundation governance) handles
                agent-to-agent communication. Anthropic&apos;s MCP (with <span className="text-white">16,670+ servers</span>,
                a 16,000% ecosystem growth) handles agent-to-tool connections. But neither solves
                discovery — how does an agent find the <span className="text-white">right</span> API for its
                current task? APIPOOL fills this gap with capability-based routing and quality scoring.
              </p>
            </div>

            <div>
              <h3 className="text-white mb-2">Hardcoded Endpoints Don&apos;t Scale</h3>
              <p>
                Only 11% of organizations have agentic AI in production (Deloitte). The gap between
                pilot and production is the defining challenge. Part of the problem: agents are built
                with hardcoded API dependencies. When Provider A raises prices or goes down, every
                agent using it breaks. A marketplace with intelligent routing solves this — agents get
                the best available provider automatically.
              </p>
            </div>

            <div>
              <h3 className="text-white mb-2">Data APIs &gt; LLM APIs</h3>
              <p>
                Most agent tasks don&apos;t need an LLM. &quot;What are the top prediction markets?&quot; is a database
                query, not an inference task. Prediction markets alone processed <span className="text-white">$44 billion+
                </span> in trading volume in 2025. APIPOOL prioritizes pre-computed, structured data APIs that
                return in milliseconds over LLM-dependent endpoints that take seconds. Faster, cheaper,
                more reliable.
              </p>
            </div>

            <div>
              <h3 className="text-white mb-2">The $10.9B Opportunity</h3>
              <p>
                The agentic AI market hits $10.9 billion in 2026, growing at 49.6% CAGR toward
                $183 billion by 2033 (Grand View Research). As decentralized infrastructure provides
                compute and protocols like x402 handle payments, the missing piece is a marketplace
                layer that connects supply (API providers) with demand (AI agents). That&apos;s APIPOOL.
              </p>
            </div>
          </div>
        </section>

        {/* 7. PROTOCOL COMPATIBILITY */}
        <section className="mb-16">
          <div className="text-xs font-mono text-white/20 mb-2">07</div>
          <h2 className="text-2xl font-mono font-bold text-white mb-6">Protocol Compatibility</h2>

          <div className="border border-white/10 rounded-lg overflow-hidden">
            <table className="w-full text-xs font-mono">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-left p-4 text-white/30">Protocol</th>
                  <th className="text-left p-4 text-white/30">Status</th>
                  <th className="text-left p-4 text-white/30">How APIPOOL Uses It</th>
                </tr>
              </thead>
              <tbody className="text-white/40">
                {[
                  ["A2A (Google)", "Supported", "Agent cards at /.well-known/agent-card.json for discovery"],
                  ["MCP (Anthropic)", "Compatible", "All data endpoints work as MCP data sources"],
                  ["x402 (Coinbase)", "Supported", "Pay-per-request pricing model for providers"],
                  ["ERC-8004", "Active", "On-chain identity for providers (#22742)"],
                  ["JSON-LD", "Native", "All responses include @context for machine semantics"],
                  ["OpenAPI", "Planned", "Auto-generated specs for registered providers"],
                ].map(([proto, status, usage], i) => (
                  <tr key={i} className="border-b border-white/5 last:border-0">
                    <td className="p-4 text-white/60">{proto}</td>
                    <td className="p-4">{status}</td>
                    <td className="p-4">{usage}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-white/5 pt-8">
          <div className="flex flex-wrap gap-6 font-mono text-xs">
            <Link href="/" className="text-white/30 hover:text-white/60 transition-colors">Home</Link>
            <Link href="/about" className="text-white/30 hover:text-white/60 transition-colors">About</Link>
            <Link href="/docs" className="text-white/30 hover:text-white/60 transition-colors">Docs</Link>
            <a href="https://github.com/exhuman777/agent-gateway" className="text-white/30 hover:text-white/60 transition-colors">
              GitHub
            </a>
          </div>
        </footer>
      </main>
    </div>
  );
}
