import Link from "next/link";
import { Nav } from "@/components/Nav";

const BASE = "https://agent-gateway-zeta.vercel.app";

export default function DocsPage() {
  return (
    <div className="min-h-screen bg-[#050505] text-[#e0e0e0]">
      <Nav active="docs" />

      <main className="pt-14 max-w-4xl mx-auto px-4 py-12 md:py-16">
        <h1 className="text-3xl md:text-4xl font-mono font-bold text-white mb-4">API Documentation</h1>
        <p className="text-sm text-white/40 font-mono mb-12 max-w-xl">
          One Smart API for AI agents and developers. No auth needed for reads.
        </p>

        {/* Quick Start */}
        <section className="mb-16">
          <h2 className="text-xl font-mono font-bold text-white mb-6">Quick Start</h2>
          <div className="border border-white/10 rounded-lg overflow-hidden bg-white/[0.02]">
            <div className="px-4 py-2 border-b border-white/5">
              <span className="text-[10px] font-mono text-white/30">try these right now — no auth, no keys</span>
            </div>
            <pre className="p-4 md:p-6 text-xs font-mono text-white/40 overflow-x-auto leading-relaxed">
{`# Route to best provider (natural language)
curl -X POST ${BASE}/api/v1/route \\
  -H "Content-Type: application/json" \\
  -d '{"query": "trending prediction markets"}'

# Get prediction market data
curl ${BASE}/api/v1/data/markets/trending?limit=5

# Web search (10 free/day)
curl -X POST ${BASE}/api/v1/search \\
  -H "Content-Type: application/json" \\
  -d '{"q": "latest AI news"}'

# Browse all registered APIs
curl ${BASE}/api/v1/registry`}
            </pre>
          </div>
        </section>

        {/* Endpoints */}
        <section className="mb-16">
          <h2 className="text-xl font-mono font-bold text-white mb-6">Endpoints</h2>
          <div className="space-y-4">

            {/* Route */}
            <div className="border border-white/10 rounded-lg p-5 bg-white/[0.02]">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-[10px] font-mono text-white/60 bg-white/10 px-2 py-0.5 rounded">POST</span>
                <span className="text-sm font-mono text-white">/api/v1/route</span>
              </div>
              <p className="text-xs font-mono text-white/40 mb-4">
                Find the best API provider for a capability. Supports exact match or natural language queries. Returns provider with highest quality score + fallbacks.
              </p>
              <pre className="text-[10px] md:text-xs font-mono text-white/30 bg-black/20 rounded p-3 overflow-x-auto">
{`// Request body:
{
  "capability": "prediction-markets",  // exact match
  // OR
  "query": "crypto odds",              // natural language
  "preferences": {                     // optional
    "max_latency_ms": 2000,
    "max_price": 0.01,
    "min_quality_score": 4.0
  },
  "fallback_count": 2                  // optional
}`}
              </pre>
            </div>

            {/* Search */}
            <div className="border border-white/10 rounded-lg p-5 bg-white/[0.02]">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-[10px] font-mono text-white/60 bg-white/10 px-2 py-0.5 rounded">POST</span>
                <span className="text-sm font-mono text-white">/api/v1/search</span>
              </div>
              <p className="text-xs font-mono text-white/40 mb-4">
                Brave web search. 10 free calls/day per IP. After that, $0.005 USDC per request via x402 micropayments.
              </p>
              <pre className="text-[10px] md:text-xs font-mono text-white/30 bg-black/20 rounded p-3 overflow-x-auto">
{`// Request:
{ "q": "latest AI news", "count": 5 }

// Response includes:
// - Organic results (title, url, description)
// - Free tier remaining count
// - x402 payment info when exhausted`}
              </pre>
            </div>

            {/* Intelligence */}
            <div className="border border-white/10 rounded-lg p-5 bg-white/[0.02]">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-[10px] font-mono text-white/30 bg-white/5 px-2 py-0.5 rounded">GET</span>
                <span className="text-sm font-mono text-white">/api/v1/intelligence</span>
                <span className="text-[10px] font-mono text-white/60 bg-white/10 px-2 py-0.5 rounded ml-2">POST</span>
              </div>
              <p className="text-xs font-mono text-white/40 mb-4">
                GET: Intelligence system status — all provider predictions, anomalies, data points.
                POST: Test contextual understanding — send a natural language query, get back matched capabilities.
              </p>
              <pre className="text-[10px] md:text-xs font-mono text-white/30 bg-black/20 rounded p-3 overflow-x-auto">
{`// POST request:
{ "query": "crypto prediction odds" }

// Response: matched capability + confidence score`}
              </pre>
            </div>

            {/* Registry */}
            <div className="border border-white/10 rounded-lg p-5 bg-white/[0.02]">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-[10px] font-mono text-white/30 bg-white/5 px-2 py-0.5 rounded">GET</span>
                <span className="text-sm font-mono text-white">/api/v1/registry</span>
              </div>
              <p className="text-xs font-mono text-white/40 mb-4">
                List and search all registered APIs. Filter by capability, category, quality.
              </p>
              <pre className="text-[10px] md:text-xs font-mono text-white/30 bg-black/20 rounded p-3 overflow-x-auto">
{`?capability=research     # filter by capability
?category=market-data    # filter by category
?min_quality=4.0         # minimum quality score
?sort=quality            # sort: quality|price|latency`}
              </pre>
            </div>

            {/* Register */}
            <div className="border border-white/10 rounded-lg p-5 bg-white/[0.02]">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-[10px] font-mono text-white/60 bg-white/10 px-2 py-0.5 rounded">POST</span>
                <span className="text-sm font-mono text-white">/api/registry/register</span>
              </div>
              <p className="text-xs font-mono text-white/40 mb-4">
                Register a new API in the marketplace. Your API gets health-checked and scored automatically.
              </p>
              <pre className="text-[10px] md:text-xs font-mono text-white/30 bg-black/20 rounded p-3 overflow-x-auto">
{`{
  "name": "My Search API",
  "description": "Search the web",
  "endpoint": "https://api.example.com/search",
  "category": "research",
  "capabilities": ["web-search", "research"],
  "pricing": {
    "model": "x402",
    "price": 0.005,
    "currency": "USDC"
  },
  "providerWallet": "0x..."
}`}
              </pre>
            </div>

            {/* Data endpoints */}
            <div className="border border-white/10 rounded-lg p-5 bg-white/[0.02]">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-[10px] font-mono text-white/30 bg-white/5 px-2 py-0.5 rounded">GET</span>
                <span className="text-sm font-mono text-white">/api/v1/data/markets/*</span>
              </div>
              <p className="text-xs font-mono text-white/40 mb-4">
                Polymarket prediction market data. 138 markets, 7 categories, price history. No auth needed.
              </p>
              <div className="space-y-2 text-[10px] md:text-xs font-mono text-white/30">
                <div><span className="text-white/50">/trending</span> — top markets by volume (?limit=, ?category=)</div>
                <div><span className="text-white/50">/search?q=</span> — full-text search</div>
                <div><span className="text-white/50">/{`{slug}`}</span> — market detail + price history</div>
                <div><span className="text-white/50">/stats</span> — volume, categories, sync status</div>
              </div>
            </div>

            {/* Other endpoints */}
            <div className="grid md:grid-cols-2 gap-4">
              <div className="border border-white/10 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-[10px] font-mono text-white/30 bg-white/5 px-2 py-0.5 rounded">GET</span>
                  <span className="text-xs font-mono text-white">/api/v1/capabilities</span>
                </div>
                <p className="text-[10px] font-mono text-white/30">All available capabilities with provider counts</p>
              </div>
              <div className="border border-white/10 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-[10px] font-mono text-white/30 bg-white/5 px-2 py-0.5 rounded">GET</span>
                  <span className="text-xs font-mono text-white">/api/v1/health-check</span>
                </div>
                <p className="text-[10px] font-mono text-white/30">Provider health status and quality scores</p>
              </div>
            </div>
          </div>
        </section>

        {/* Response Format */}
        <section className="mb-16">
          <h2 className="text-xl font-mono font-bold text-white mb-6">Response Format</h2>
          <p className="text-xs font-mono text-white/40 mb-4">
            All responses are JSON-LD compatible with consistent structure:
          </p>
          <div className="border border-white/10 rounded-lg overflow-hidden bg-white/[0.02]">
            <pre className="p-4 md:p-6 text-xs font-mono text-white/40 overflow-x-auto">
{`// Success:
{
  "@context": "https://apipool.dev/schema/v1",
  "success": true,
  "data": { ... },
  "meta": { "timestamp": "2026-02-06T..." }
}

// Error:
{
  "success": false,
  "error": {
    "code": "NOT_FOUND",
    "message": "API not found"
  }
}`}
            </pre>
          </div>
        </section>

        {/* Pricing Models */}
        <section className="mb-16">
          <h2 className="text-xl font-mono font-bold text-white mb-6">Pricing Models</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {[
              {
                name: "x402 (Recommended)",
                desc: "Pay-per-request via HTTP 402. USDC on Base. No accounts needed. Free tier included.",
              },
              {
                name: "free",
                desc: "No cost. Daily limits may apply. Good for testing and community APIs.",
              },
              {
                name: "per_request",
                desc: "Traditional per-request billing. Requires API key or account setup.",
              },
              {
                name: "subscription",
                desc: "Monthly fee for unlimited access. Best for high-volume consumers.",
              },
            ].map((model) => (
              <div key={model.name} className="border border-white/10 rounded-lg p-4 bg-white/[0.02]">
                <div className="font-mono text-sm text-white mb-2">{model.name}</div>
                <p className="text-[10px] md:text-xs font-mono text-white/30">{model.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-white/5 pt-8">
          <div className="flex flex-wrap gap-6 font-mono text-xs">
            <Link href="/" className="text-white/30 hover:text-white/60 transition-colors">Home</Link>
            <Link href="/about" className="text-white/30 hover:text-white/60 transition-colors">About</Link>
            <Link href="/methodology" className="text-white/30 hover:text-white/60 transition-colors">Methodology</Link>
            <a href="https://github.com/exhuman777/agent-gateway" className="text-white/30 hover:text-white/60 transition-colors">
              GitHub
            </a>
          </div>
        </footer>
      </main>
    </div>
  );
}
