import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#050505] text-[#e0e0e0]">
      {/* Animated background */}
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0) rotate(0deg); opacity: 0.03; }
          50% { transform: translateY(-20px) rotate(1deg); opacity: 0.07; }
        }
        @keyframes pulse-slow {
          0%, 100% { opacity: 0.02; }
          50% { opacity: 0.05; }
        }
        @keyframes scan {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(100vh); }
        }
        .bg-grid {
          background-image:
            linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px);
          background-size: 60px 60px;
        }
        .float-1 { animation: float 8s ease-in-out infinite; }
        .float-2 { animation: float 12s ease-in-out infinite 2s; }
        .float-3 { animation: float 10s ease-in-out infinite 4s; }
        .scanline {
          animation: scan 8s linear infinite;
          background: linear-gradient(transparent, rgba(255,255,255,0.02), transparent);
          height: 100px;
        }
      `}</style>

      <div className="fixed inset-0 bg-grid pointer-events-none z-0" />
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="scanline w-full absolute" />
        <div className="float-1 absolute top-[10%] left-[5%] text-[120px] font-mono text-white opacity-[0.03] select-none">.</div>
        <div className="float-2 absolute top-[30%] right-[10%] text-[80px] font-mono text-white opacity-[0.03] select-none">/</div>
        <div className="float-3 absolute top-[60%] left-[15%] text-[100px] font-mono text-white opacity-[0.03] select-none">_</div>
        <div className="float-2 absolute top-[80%] right-[20%] text-[90px] font-mono text-white opacity-[0.03] select-none">{`>`}</div>
        <div className="float-1 absolute top-[45%] left-[70%] text-[70px] font-mono text-white opacity-[0.03] select-none">0</div>
        <div className="float-3 absolute top-[15%] left-[50%] text-[60px] font-mono text-white opacity-[0.03] select-none">1</div>
      </div>

      {/* Nav */}
      <nav className="border-b border-white/5 backdrop-blur-md fixed top-0 w-full z-50 bg-[#050505]/80">
        <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-lg font-mono font-bold text-white tracking-wider">aipool</span>
            <span className="text-[10px] font-mono text-white/30 border border-white/10 px-1.5 py-0.5 rounded">v1</span>
          </div>
          <div className="flex items-center gap-6">
            <a href="#how" className="text-xs text-white/40 hover:text-white transition-colors font-mono">how</a>
            <a href="#api" className="text-xs text-white/40 hover:text-white transition-colors font-mono">api</a>
            <Link href="/about" className="text-xs text-white/40 hover:text-white transition-colors font-mono">about</Link>
            <Link href="/methodology" className="text-xs text-white/40 hover:text-white transition-colors font-mono">methodology</Link>
            <Link href="/explore">
              <span className="text-xs text-black bg-white hover:bg-white/80 px-3 py-1.5 rounded font-mono transition-colors">
                explore
              </span>
            </Link>
          </div>
        </div>
      </nav>

      <main className="pt-14 relative z-10">
        {/* HERO */}
        <section className="max-w-5xl mx-auto px-4 py-24 text-center">
          <h1 className="text-5xl md:text-7xl font-mono font-bold text-white tracking-tight mb-6">
            aipool
          </h1>
          <p className="text-lg text-white/60 font-mono mb-3 max-w-2xl mx-auto">
            The API marketplace for AI agents.
          </p>
          <p className="text-sm text-white/30 font-mono mb-10 max-w-xl mx-auto leading-relaxed">
            Agents query by capability. We route to the best provider.
            No hardcoded endpoints. No guessing. Just structured intelligence.
          </p>

          <div className="flex gap-3 justify-center">
            <Link href="/explore">
              <span className="inline-block px-6 py-2.5 bg-white text-black font-mono text-sm rounded hover:bg-white/90 transition-colors">
                browse apis
              </span>
            </Link>
            <Link href="/register">
              <span className="inline-block px-6 py-2.5 border border-white/20 text-white/70 font-mono text-sm rounded hover:border-white/40 hover:text-white transition-colors">
                list your api
              </span>
            </Link>
          </div>

          {/* Live stats */}
          <div className="mt-16 flex justify-center gap-12 text-center">
            <div>
              <div className="text-2xl font-mono font-bold text-white">60+</div>
              <div className="text-xs font-mono text-white/30">markets tracked</div>
            </div>
            <div>
              <div className="text-2xl font-mono font-bold text-white">$12.5M</div>
              <div className="text-xs font-mono text-white/30">volume indexed</div>
            </div>
            <div>
              <div className="text-2xl font-mono font-bold text-white">&lt;200ms</div>
              <div className="text-xs font-mono text-white/30">avg response</div>
            </div>
            <div>
              <div className="text-2xl font-mono font-bold text-white">0</div>
              <div className="text-xs font-mono text-white/30">LLMs in the loop</div>
            </div>
          </div>
        </section>

        {/* INTELLIGENT ROUTING — THE METHODOLOGY */}
        <section id="how" className="border-t border-white/5">
          <div className="max-w-5xl mx-auto px-4 py-20">
            <h2 className="text-2xl font-mono font-bold text-white mb-3">Intelligent Routing</h2>
            <p className="text-sm text-white/40 font-mono mb-12 max-w-2xl">
              How agents find the right API without hardcoding anything. This is a real, deployed system — not a concept.
            </p>

            {/* The flow */}
            <div className="grid md:grid-cols-3 gap-6 mb-12">
              <div className="border border-white/10 rounded-lg p-6 bg-white/[0.02]">
                <div className="text-xs font-mono text-white/30 mb-4">STEP 1 — QUERY</div>
                <p className="text-sm font-mono text-white/70 leading-relaxed mb-4">
                  Agent sends a capability request. Not a URL. Not an API name. Just what it needs.
                </p>
                <pre className="text-xs font-mono text-white/50 bg-black/30 rounded p-3 overflow-x-auto">
{`POST /api/v1/route
{
  "capability": "market-data",
  "preferences": {
    "max_latency_ms": 2000,
    "min_quality_score": 4.0
  }
}`}
                </pre>
              </div>

              <div className="border border-white/10 rounded-lg p-6 bg-white/[0.02]">
                <div className="text-xs font-mono text-white/30 mb-4">STEP 2 — SCORE</div>
                <p className="text-sm font-mono text-white/70 leading-relaxed mb-4">
                  Gateway scores all providers matching that capability. Ranking formula:
                </p>
                <div className="space-y-2 text-xs font-mono">
                  <div className="flex justify-between text-white/50">
                    <span>uptime</span>
                    <span className="text-white/70">40%</span>
                  </div>
                  <div className="w-full h-1 bg-white/5 rounded"><div className="h-full bg-white/20 rounded" style={{width:'40%'}}/></div>
                  <div className="flex justify-between text-white/50">
                    <span>latency</span>
                    <span className="text-white/70">30%</span>
                  </div>
                  <div className="w-full h-1 bg-white/5 rounded"><div className="h-full bg-white/20 rounded" style={{width:'30%'}}/></div>
                  <div className="flex justify-between text-white/50">
                    <span>success rate</span>
                    <span className="text-white/70">30%</span>
                  </div>
                  <div className="w-full h-1 bg-white/5 rounded"><div className="h-full bg-white/20 rounded" style={{width:'30%'}}/></div>
                </div>
                <p className="text-xs font-mono text-white/30 mt-4">
                  Daily health checks update scores automatically.
                </p>
              </div>

              <div className="border border-white/10 rounded-lg p-6 bg-white/[0.02]">
                <div className="text-xs font-mono text-white/30 mb-4">STEP 3 — ROUTE</div>
                <p className="text-sm font-mono text-white/70 leading-relaxed mb-4">
                  Agent gets the best endpoint + fallbacks. Calls provider directly. Gateway is not a proxy.
                </p>
                <pre className="text-xs font-mono text-white/50 bg-black/30 rounded p-3 overflow-x-auto">
{`{
  "provider": {
    "name": "Polymarket Data",
    "endpoint": "https://...markets",
    "quality_score": 4.9,
    "latency_ms": 180
  },
  "fallbacks": [...]
}`}
                </pre>
              </div>
            </div>

            {/* Visual flow */}
            <div className="border border-white/10 rounded-lg p-8 bg-white/[0.02]">
              <div className="flex items-center justify-center gap-6 flex-wrap">
                <div className="border border-white/20 rounded px-6 py-3 text-center">
                  <div className="font-mono text-sm text-white">AGENT</div>
                  <div className="text-[10px] font-mono text-white/30 mt-1">&quot;I need market data&quot;</div>
                </div>
                <div className="text-white/20 font-mono">{"--->"}</div>
                <div className="border border-white/40 rounded px-6 py-3 text-center bg-white/[0.03]">
                  <div className="font-mono text-sm text-white font-bold">aipool</div>
                  <div className="text-[10px] font-mono text-white/30 mt-1">scores + routes</div>
                </div>
                <div className="text-white/20 font-mono">{"--->"}</div>
                <div className="border border-white/20 rounded px-6 py-3 text-center">
                  <div className="font-mono text-sm text-white">PROVIDER</div>
                  <div className="text-[10px] font-mono text-white/30 mt-1">returns data</div>
                </div>
              </div>
              <div className="text-center mt-4 text-[10px] font-mono text-white/20">
                agent calls provider directly — aipool is a router, not a proxy
              </div>
            </div>
          </div>
        </section>

        {/* API REFERENCE */}
        <section id="api" className="border-t border-white/5 bg-white/[0.01]">
          <div className="max-w-5xl mx-auto px-4 py-20">
            <h2 className="text-2xl font-mono font-bold text-white mb-3">API Reference</h2>
            <p className="text-sm text-white/40 font-mono mb-10">Every endpoint. No auth needed for reads.</p>

            <div className="border border-white/10 rounded-lg overflow-hidden">
              <table className="w-full text-sm font-mono">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="text-left p-4 text-white/30 text-xs">method</th>
                    <th className="text-left p-4 text-white/30 text-xs">endpoint</th>
                    <th className="text-left p-4 text-white/30 text-xs">description</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { method: "POST", endpoint: "/api/v1/route", desc: "Intelligent routing — find best provider for any capability", highlight: true },
                    { method: "GET", endpoint: "/api/v1/registry", desc: "Browse all registered APIs" },
                    { method: "GET", endpoint: "/api/v1/capabilities", desc: "List all available capabilities" },
                    { method: "POST", endpoint: "/api/registry/register", desc: "Register your API" },
                    { method: "GET", endpoint: "/api/v1/health-check", desc: "Health status of all providers" },
                    { method: "GET", endpoint: "/api/v1/data/markets/trending", desc: "Polymarket top markets by volume", highlight: true },
                    { method: "GET", endpoint: "/api/v1/data/markets/search?q=", desc: "Search prediction markets" },
                    { method: "GET", endpoint: "/api/v1/data/markets/{slug}", desc: "Market detail + price history" },
                    { method: "GET", endpoint: "/api/v1/data/markets/stats", desc: "Market stats overview" },
                  ].map((ep, i) => (
                    <tr key={i} className={`border-b border-white/5 last:border-0 ${ep.highlight ? 'bg-white/[0.02]' : ''}`}>
                      <td className="p-4">
                        <span className={`text-xs ${ep.method === 'POST' ? 'text-white/60' : 'text-white/30'}`}>
                          {ep.method}
                        </span>
                      </td>
                      <td className="p-4 text-white/70">{ep.endpoint}</td>
                      <td className="p-4 text-white/30">{ep.desc}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* FEATURED API */}
        <section id="featured" className="border-t border-white/5">
          <div className="max-w-5xl mx-auto px-4 py-20">
            <div className="flex items-center gap-3 mb-3">
              <h2 className="text-2xl font-mono font-bold text-white">Featured Provider</h2>
              <span className="text-[10px] font-mono text-white/40 border border-white/10 px-1.5 py-0.5 rounded">LIVE</span>
            </div>
            <p className="text-sm text-white/30 font-mono mb-10">
              Reference listing. This is what a well-structured provider looks like on aipool.
            </p>

            <div className="border border-white/10 rounded-lg overflow-hidden">
              {/* Header */}
              <div className="border-b border-white/10 px-6 py-5 flex items-center justify-between bg-white/[0.02]">
                <div>
                  <h3 className="font-mono font-bold text-white text-lg">Polymarket Historical Data API</h3>
                  <div className="flex items-center gap-3 mt-1 text-xs font-mono text-white/30">
                    <span>market-data</span>
                    <span className="text-white/10">|</span>
                    <span>by Rufus #22742</span>
                    <span className="text-white/10">|</span>
                    <span className="text-white/50">FREE</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  {["ERC-8004", "A2A", "No LLM"].map(tag => (
                    <span key={tag} className="text-[10px] font-mono text-white/40 border border-white/10 px-2 py-1 rounded">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Body */}
              <div className="px-6 py-6">
                <p className="text-sm text-white/60 font-mono leading-relaxed mb-6">
                  60+ prediction markets with price history. Pure structured data from PostgreSQL.
                  No LLM, no external dependencies, no API keys. Synced daily from Polymarket Gamma API.
                </p>

                <div className="flex flex-wrap gap-2 mb-6">
                  {["prediction-markets", "price-history", "trending-markets", "market-search"].map(cap => (
                    <span key={cap} className="px-2 py-1 rounded text-[10px] font-mono text-white/30 border border-white/5 bg-white/[0.02]">
                      {cap}
                    </span>
                  ))}
                </div>

                <div className="grid md:grid-cols-2 gap-3 mb-6">
                  {[
                    { name: "Trending", path: "GET /api/v1/data/markets/trending", info: "Top markets by volume" },
                    { name: "Search", path: "GET /api/v1/data/markets/search?q=", info: "Full-text search" },
                    { name: "Detail", path: "GET /api/v1/data/markets/{slug}", info: "Market + price history" },
                    { name: "Stats", path: "GET /api/v1/data/markets/stats", info: "Volume, categories, sync time" },
                  ].map(ep => (
                    <div key={ep.name} className="border border-white/5 rounded p-3 bg-white/[0.01]">
                      <div className="text-[10px] font-mono text-white/30 mb-1">{ep.name}</div>
                      <code className="text-xs font-mono text-white/50">{ep.path}</code>
                      <div className="text-[10px] font-mono text-white/20 mt-1">{ep.info}</div>
                    </div>
                  ))}
                </div>

                {/* Try it */}
                <div className="border border-white/10 rounded overflow-hidden">
                  <div className="px-4 py-2 border-b border-white/5 bg-white/[0.02]">
                    <span className="text-[10px] font-mono text-white/30">try it — no auth required</span>
                  </div>
                  <pre className="p-4 text-xs font-mono text-white/40 overflow-x-auto">
{`curl https://agent-gateway-zeta.vercel.app/api/v1/data/markets/trending?limit=3`}
                  </pre>
                </div>
              </div>

              {/* Why it scores high */}
              <div className="border-t border-white/5 px-6 py-4 bg-white/[0.01]">
                <div className="text-[10px] font-mono text-white/20 mb-2">Why this scores high on aipool:</div>
                <div className="flex flex-wrap gap-x-4 gap-y-1 text-[10px] font-mono text-white/30">
                  <span>+ structured JSON</span>
                  <span>+ no auth for reads</span>
                  <span>+ {`{success, data, meta}`} format</span>
                  <span>+ sub-200ms latency</span>
                  <span>+ multiple query patterns</span>
                  <span>+ clear capability tags</span>
                  <span>+ on-chain identity</span>
                  <span>+ no LLM = always available</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* BEST PRACTICES */}
        <section className="border-t border-white/5 bg-white/[0.01]">
          <div className="max-w-5xl mx-auto px-4 py-20">
            <h2 className="text-2xl font-mono font-bold text-white mb-3">Provider Best Practices</h2>
            <p className="text-sm text-white/30 font-mono mb-10">Follow these to rank higher and get more agent traffic.</p>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="border border-white/10 rounded-lg p-6">
                <h3 className="font-mono text-sm text-white mb-4">Response Format</h3>
                <pre className="text-xs font-mono text-white/40 bg-black/30 rounded p-4 overflow-x-auto mb-4">
{`// Every response should follow this shape:
{
  "success": true,
  "data": {
    // your payload here
  },
  "meta": {
    "source": "your-service",
    "timestamp": "2026-02-06T..."
  }
}

// On errors:
{
  "success": false,
  "error": {
    "code": "NOT_FOUND",
    "message": "Human-readable message"
  }
}`}
                </pre>
                <p className="text-[10px] font-mono text-white/20">Agents parse JSON. Consistent structure = fewer integration bugs.</p>
              </div>

              <div className="border border-white/10 rounded-lg p-6">
                <h3 className="font-mono text-sm text-white mb-4">Checklist</h3>
                <div className="space-y-3 text-xs font-mono">
                  {[
                    "HTTPS only",
                    "Latency under 2 seconds",
                    "Expose /health endpoint",
                    "Descriptive capability tags",
                    "A2A agent card at /.well-known/agent-card.json",
                    "No auth required for read endpoints",
                    "Return JSON, never HTML",
                    "Handle errors with {success: false, error: {...}}",
                  ].map((item, i) => (
                    <div key={i} className="flex gap-2 text-white/40">
                      <span className="text-white/20">+</span>
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-6 pt-4 border-t border-white/5">
                  <div className="text-[10px] font-mono text-white/20 mb-2">Avoid:</div>
                  <div className="space-y-1 text-xs font-mono text-white/20">
                    <div>- Returning unstructured text or HTML</div>
                    <div>- Complex auth for basic reads</div>
                    <div>- Inconsistent response shapes</div>
                    <div>- LLM dependency for simple data lookups</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="border-t border-white/5">
          <div className="max-w-5xl mx-auto px-4 py-20 text-center">
            <h2 className="text-3xl font-mono font-bold text-white mb-4">List your API</h2>
            <p className="text-sm text-white/30 font-mono mb-8 max-w-lg mx-auto">
              Register your API, follow the best practices, maintain uptime.
              aipool routes agents to you automatically.
            </p>
            <Link href="/register">
              <span className="inline-block px-8 py-3 bg-white text-black font-mono text-sm rounded hover:bg-white/90 transition-colors">
                register now
              </span>
            </Link>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-white/5 py-8">
          <div className="max-w-5xl mx-auto px-4">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-4 font-mono text-xs text-white/20">
                <span className="text-white/40 font-bold">aipool</span>
                <span className="text-white/5">|</span>
                <a href="https://8004scan.io/agents/ethereum/22742" className="hover:text-white/40 transition-colors">
                  ERC-8004 #22742
                </a>
                <span className="text-white/5">|</span>
                <span>Built by Rufus</span>
              </div>
              <div className="flex gap-6 font-mono text-xs text-white/20">
                <Link href="/about" className="hover:text-white/40 transition-colors">about</Link>
                <Link href="/methodology" className="hover:text-white/40 transition-colors">methodology</Link>
                <Link href="/docs" className="hover:text-white/40 transition-colors">docs</Link>
                <a href="https://github.com/exhuman777/agent-gateway" className="hover:text-white/40 transition-colors">github</a>
                <a href="/.well-known/agent-card.json" className="hover:text-white/40 transition-colors">agent-card</a>
              </div>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}
