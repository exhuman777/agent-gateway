import Link from "next/link";
import { Nav } from "@/components/Nav";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#050505] text-[#e0e0e0]">
      {/* Animated background */}
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0) rotate(0deg); opacity: 0.03; }
          50% { transform: translateY(-20px) rotate(1deg); opacity: 0.07; }
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

      <Nav />

      <main className="pt-14 relative z-10">
        {/* HERO — "One Smart API" */}
        <section className="max-w-5xl mx-auto px-4 py-16 md:py-24">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-7xl font-mono font-bold text-white tracking-tight mb-6">
              One Smart API.
            </h1>
            <p className="text-base md:text-lg text-white/60 font-mono mb-3 max-w-2xl mx-auto">
              Describe what data your app needs. Get it back in JSON.
            </p>
            <p className="text-xs md:text-sm text-white/30 font-mono mb-10 max-w-xl mx-auto leading-relaxed">
              No API keys. No docs to read. No endpoints to memorize.
              APIPOOL finds the best provider, routes your request, and handles failover.
              One line of code.
            </p>

            <div className="flex gap-3 justify-center flex-wrap">
              <Link href="/explore">
                <span className="inline-block px-6 py-2.5 bg-white text-black font-mono text-sm rounded hover:bg-white/90 transition-colors">
                  try it now
                </span>
              </Link>
              <Link href="/register">
                <span className="inline-block px-6 py-2.5 border border-white/20 text-white/70 font-mono text-sm rounded hover:border-white/40 hover:text-white transition-colors">
                  list your api
                </span>
              </Link>
            </div>
          </div>

          {/* THE CODE EXAMPLE — this is the hook */}
          <div className="max-w-2xl mx-auto border border-white/10 rounded-lg overflow-hidden bg-white/[0.02]">
            <div className="px-4 py-2 border-b border-white/5 flex items-center gap-2">
              <div className="flex gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-white/10" />
                <div className="w-2.5 h-2.5 rounded-full bg-white/10" />
                <div className="w-2.5 h-2.5 rounded-full bg-white/10" />
              </div>
              <span className="text-[10px] font-mono text-white/20 ml-2">your-app.js</span>
            </div>
            <pre className="p-4 md:p-6 text-xs md:text-sm font-mono text-white/50 overflow-x-auto leading-relaxed">
{`// You need data. You don't know which API.
// APIPOOL handles it.

const res = await fetch(
  "https://agent-gateway-zeta.vercel.app/api/v1/route",
  {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      query: "trending crypto prediction markets"
    })
  }
);

const { data } = await res.json();
// → best provider, quality score, fallbacks
// → agent calls provider directly`}</pre>
          </div>

          {/* Live stats */}
          <div className="mt-12 grid grid-cols-2 md:flex md:justify-center gap-6 md:gap-12 text-center">
            <div>
              <div className="text-xl md:text-2xl font-mono font-bold text-white">138+</div>
              <div className="text-[10px] md:text-xs font-mono text-white/30">markets tracked</div>
            </div>
            <div>
              <div className="text-xl md:text-2xl font-mono font-bold text-white">$17M+</div>
              <div className="text-[10px] md:text-xs font-mono text-white/30">volume indexed</div>
            </div>
            <div>
              <div className="text-xl md:text-2xl font-mono font-bold text-white">&lt;200ms</div>
              <div className="text-[10px] md:text-xs font-mono text-white/30">avg response</div>
            </div>
            <div>
              <div className="text-xl md:text-2xl font-mono font-bold text-white">100%</div>
              <div className="text-[10px] md:text-xs font-mono text-white/30">real data</div>
            </div>
          </div>
        </section>

        {/* WHO IS THIS FOR */}
        <section className="border-t border-white/5 bg-white/[0.01]">
          <div className="max-w-5xl mx-auto px-4 py-16 md:py-20">
            <h2 className="text-xl md:text-2xl font-mono font-bold text-white mb-3">Who is this for?</h2>
            <p className="text-xs md:text-sm text-white/40 font-mono mb-10 max-w-2xl">
              If you build apps that need data, APIPOOL saves you the work of finding, integrating, and maintaining API connections.
            </p>

            <div className="grid md:grid-cols-3 gap-4">
              {[
                {
                  title: "Vibe Coders",
                  desc: "Building in Cursor, Replit, or Lovable? You need live data but don't want to read API docs. Describe what you need — APIPOOL returns it.",
                  tag: "beginners",
                },
                {
                  title: "AI Agent Builders",
                  desc: "Using LangChain, CrewAI, or custom agents? Let your agent discover APIs at runtime instead of hardcoding endpoints. Dynamic tool access.",
                  tag: "agents",
                },
                {
                  title: "Indie Hackers",
                  desc: "Shipping fast? One endpoint for prediction markets, web search, market data, and more. Add real data to your app in minutes, not days.",
                  tag: "builders",
                },
              ].map((item) => (
                <div key={item.tag} className="border border-white/10 rounded-lg p-5 bg-white/[0.02]">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-[10px] font-mono text-white/20 border border-white/10 px-1.5 py-0.5 rounded">
                      {item.tag}
                    </span>
                    <span className="text-sm font-mono text-white">{item.title}</span>
                  </div>
                  <p className="text-xs font-mono text-white/40 leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* HOW IT WORKS — INTELLIGENT ROUTING */}
        <section id="how" className="border-t border-white/5">
          <div className="max-w-5xl mx-auto px-4 py-16 md:py-20">
            <h2 className="text-xl md:text-2xl font-mono font-bold text-white mb-3">How It Works</h2>
            <p className="text-xs md:text-sm text-white/40 font-mono mb-12 max-w-2xl">
              Not a dumb catalog. APIPOOL scores, ranks, and routes — with a self-learning intelligence layer that improves from every request.
            </p>

            {/* The 3-step flow */}
            <div className="grid md:grid-cols-3 gap-4 md:gap-6 mb-12">
              <div className="border border-white/10 rounded-lg p-5 md:p-6 bg-white/[0.02]">
                <div className="text-xs font-mono text-white/30 mb-4">1 — QUERY</div>
                <p className="text-xs md:text-sm font-mono text-white/70 leading-relaxed mb-4">
                  Send what you need. Not a URL. Not an API name. Just describe it.
                </p>
                <pre className="text-[10px] md:text-xs font-mono text-white/50 bg-black/30 rounded p-3 overflow-x-auto">
{`POST /api/v1/route

// natural language:
{ "query": "crypto prices" }

// or exact match:
{ "capability": "market-data" }`}
                </pre>
              </div>

              <div className="border border-white/10 rounded-lg p-5 md:p-6 bg-white/[0.02]">
                <div className="text-xs font-mono text-white/30 mb-4">2 — SCORE</div>
                <p className="text-xs md:text-sm font-mono text-white/70 leading-relaxed mb-4">
                  All matching providers scored in real-time with 4-pillar intelligence:
                </p>
                <div className="space-y-2 text-[10px] md:text-xs font-mono">
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
              </div>

              <div className="border border-white/10 rounded-lg p-5 md:p-6 bg-white/[0.02]">
                <div className="text-xs font-mono text-white/30 mb-4">3 — ROUTE</div>
                <p className="text-xs md:text-sm font-mono text-white/70 leading-relaxed mb-4">
                  Get the best endpoint + fallbacks. Call provider directly. APIPOOL is a router, not a proxy.
                </p>
                <pre className="text-[10px] md:text-xs font-mono text-white/50 bg-black/30 rounded p-3 overflow-x-auto">
{`{
  "provider": {
    "name": "Polymarket Data",
    "endpoint": "https://...",
    "quality_score": 4.9
  },
  "fallbacks": [...]
}`}
                </pre>
              </div>
            </div>

            {/* Visual flow — responsive */}
            <div className="border border-white/10 rounded-lg p-4 md:p-8 bg-white/[0.02]">
              <div className="flex items-center justify-center gap-3 md:gap-6 flex-wrap">
                <div className="border border-white/20 rounded px-4 md:px-6 py-2 md:py-3 text-center">
                  <div className="font-mono text-xs md:text-sm text-white">YOUR APP</div>
                  <div className="text-[9px] md:text-[10px] font-mono text-white/30 mt-1">&quot;I need market data&quot;</div>
                </div>
                <div className="text-white/20 font-mono text-xs md:text-base">{"--->"}</div>
                <div className="border border-white/40 rounded px-4 md:px-6 py-2 md:py-3 text-center bg-white/[0.03]">
                  <div className="font-mono text-xs md:text-sm text-white font-bold">APIPOOL</div>
                  <div className="text-[9px] md:text-[10px] font-mono text-white/30 mt-1">scores + routes</div>
                </div>
                <div className="text-white/20 font-mono text-xs md:text-base">{"--->"}</div>
                <div className="border border-white/20 rounded px-4 md:px-6 py-2 md:py-3 text-center">
                  <div className="font-mono text-xs md:text-sm text-white">PROVIDER</div>
                  <div className="text-[9px] md:text-[10px] font-mono text-white/30 mt-1">returns JSON</div>
                </div>
              </div>
              <div className="text-center mt-4 text-[9px] md:text-[10px] font-mono text-white/20">
                your app calls provider directly — APIPOOL is a router, not a proxy
              </div>
            </div>

            {/* 4 Intelligence Pillars */}
            <div className="mt-12">
              <div className="text-xs font-mono text-white/20 mb-6">4 PILLARS OF INTELLIGENT ROUTING</div>
              <div className="grid md:grid-cols-2 gap-4">
                {[
                  {
                    id: "P1",
                    name: "Self-Learning",
                    desc: "Every routing decision is recorded. Providers that deliver get boosted (1.2x). Unreliable ones get penalized (0.8x). The system gets smarter with every request.",
                  },
                  {
                    id: "P2",
                    name: "Predictive Orchestration",
                    desc: "If latency is trending up or success rate dropping, the provider is demoted BEFORE it fails. No agent downtime. No manual intervention.",
                  },
                  {
                    id: "P3",
                    name: "Anomaly Detection",
                    desc: "Latency spikes, error bursts, and downtime are detected by comparing recent checks against baseline. Anomalies reduce scores immediately.",
                  },
                  {
                    id: "P4",
                    name: "Natural Language",
                    desc: "Don't know the capability name? Just describe what you need: \"crypto prediction odds\" resolves to prediction-markets. No LLM needed.",
                  },
                ].map(p => (
                  <div key={p.id} className="border border-white/10 rounded-lg p-4 bg-white/[0.01]">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-[10px] font-mono text-white/20 border border-white/10 px-1.5 py-0.5 rounded">{p.id}</span>
                      <span className="text-xs font-mono text-white">{p.name}</span>
                    </div>
                    <p className="text-[10px] md:text-xs font-mono text-white/30 leading-relaxed">{p.desc}</p>
                  </div>
                ))}
              </div>
              <div className="text-center mt-4">
                <Link href="/methodology" className="text-[10px] font-mono text-white/20 hover:text-white/40 transition-colors">
                  full methodology with formulas →
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* API REFERENCE */}
        <section id="api" className="border-t border-white/5 bg-white/[0.01]">
          <div className="max-w-5xl mx-auto px-4 py-16 md:py-20">
            <h2 className="text-xl md:text-2xl font-mono font-bold text-white mb-3">API Reference</h2>
            <p className="text-xs md:text-sm text-white/40 font-mono mb-10">Every endpoint. No auth needed for reads.</p>

            {/* Mobile: card layout. Desktop: table */}
            <div className="hidden md:block border border-white/10 rounded-lg overflow-hidden">
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
                    { method: "POST", endpoint: "/api/v1/search", desc: "Brave web search — 10 free/day, then $0.005 USDC via x402", highlight: true },
                    { method: "GET", endpoint: "/api/v1/registry", desc: "Browse all registered APIs" },
                    { method: "GET", endpoint: "/api/v1/capabilities", desc: "List all available capabilities" },
                    { method: "POST", endpoint: "/api/registry/register", desc: "Register your API" },
                    { method: "GET", endpoint: "/api/v1/health-check", desc: "Health status of all providers" },
                    { method: "GET", endpoint: "/api/v1/data/markets/trending", desc: "Polymarket top markets by volume", highlight: true },
                    { method: "GET", endpoint: "/api/v1/data/markets/search?q=", desc: "Search prediction markets" },
                    { method: "GET", endpoint: "/api/v1/data/markets/{slug}", desc: "Market detail + price history" },
                    { method: "GET", endpoint: "/api/v1/data/markets/stats", desc: "Market stats overview" },
                    { method: "GET", endpoint: "/api/v1/intelligence", desc: "Intelligence system status + predictions", highlight: true },
                    { method: "POST", endpoint: "/api/v1/intelligence", desc: "Test NL understanding (query → capability)" },
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

            {/* Mobile: stacked cards */}
            <div className="md:hidden space-y-2">
              {[
                { method: "POST", endpoint: "/api/v1/route", desc: "Intelligent routing", highlight: true },
                { method: "POST", endpoint: "/api/v1/search", desc: "Web search (10 free/day)", highlight: true },
                { method: "GET", endpoint: "/api/v1/data/markets/trending", desc: "Trending markets", highlight: true },
                { method: "GET", endpoint: "/api/v1/data/markets/search?q=", desc: "Search markets" },
                { method: "GET", endpoint: "/api/v1/registry", desc: "Browse APIs" },
                { method: "GET", endpoint: "/api/v1/capabilities", desc: "List capabilities" },
                { method: "GET", endpoint: "/api/v1/intelligence", desc: "Intelligence status", highlight: true },
                { method: "GET", endpoint: "/api/v1/health-check", desc: "Provider health" },
                { method: "GET", endpoint: "/api/v1/data/markets/{slug}", desc: "Market detail" },
                { method: "GET", endpoint: "/api/v1/data/markets/stats", desc: "Market stats" },
              ].map((ep, i) => (
                <div key={i} className={`border border-white/10 rounded p-3 ${ep.highlight ? 'bg-white/[0.02]' : ''}`}>
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`text-[10px] font-mono ${ep.method === 'POST' ? 'text-white/60' : 'text-white/30'}`}>
                      {ep.method}
                    </span>
                    <span className="text-xs font-mono text-white/70 truncate">{ep.endpoint}</span>
                  </div>
                  <div className="text-[10px] font-mono text-white/30">{ep.desc}</div>
                </div>
              ))}
            </div>

            <div className="mt-6 text-center">
              <Link href="/docs" className="text-xs font-mono text-white/30 hover:text-white/60 transition-colors">
                full documentation →
              </Link>
            </div>
          </div>
        </section>

        {/* FEATURED PROVIDER */}
        <section id="featured" className="border-t border-white/5">
          <div className="max-w-5xl mx-auto px-4 py-16 md:py-20">
            <div className="flex items-center gap-3 mb-3 flex-wrap">
              <h2 className="text-xl md:text-2xl font-mono font-bold text-white">Featured Provider</h2>
              <span className="text-[10px] font-mono text-white/40 border border-white/10 px-1.5 py-0.5 rounded">LIVE</span>
            </div>
            <p className="text-xs md:text-sm text-white/30 font-mono mb-10">
              Reference listing. This is what a well-structured provider looks like on APIPOOL.
            </p>

            <div className="border border-white/10 rounded-lg overflow-hidden">
              {/* Header */}
              <div className="border-b border-white/10 px-4 md:px-6 py-4 md:py-5 bg-white/[0.02]">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                  <div>
                    <h3 className="font-mono font-bold text-white text-base md:text-lg">Polymarket Historical Data API</h3>
                    <div className="flex items-center gap-3 mt-1 text-xs font-mono text-white/30 flex-wrap">
                      <span>market-data</span>
                      <span className="text-white/10">|</span>
                      <span>by Rufus #22742</span>
                      <span className="text-white/10">|</span>
                      <span className="text-white/50">FREE</span>
                    </div>
                  </div>
                  <div className="flex gap-2 flex-wrap">
                    {["ERC-8004", "A2A", "Real Data"].map(tag => (
                      <span key={tag} className="text-[10px] font-mono text-white/40 border border-white/10 px-2 py-1 rounded">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Body */}
              <div className="px-4 md:px-6 py-5 md:py-6">
                <p className="text-xs md:text-sm text-white/60 font-mono leading-relaxed mb-6">
                  138 prediction markets with price history. Pure structured data from PostgreSQL.
                  No LLM, no external dependencies, no API keys. Synced daily from Polymarket Gamma API.
                </p>

                <div className="flex flex-wrap gap-2 mb-6">
                  {["prediction-markets", "price-history", "trending-markets", "market-search"].map(cap => (
                    <span key={cap} className="px-2 py-1 rounded text-[10px] font-mono text-white/30 border border-white/5 bg-white/[0.02]">
                      {cap}
                    </span>
                  ))}
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
                  {[
                    { name: "Trending", path: "/markets/trending" },
                    { name: "Search", path: "/markets/search?q=" },
                    { name: "Detail", path: "/markets/{slug}" },
                    { name: "Stats", path: "/markets/stats" },
                  ].map(ep => (
                    <div key={ep.name} className="border border-white/5 rounded p-2 md:p-3 bg-white/[0.01]">
                      <div className="text-[10px] font-mono text-white/30 mb-1">{ep.name}</div>
                      <code className="text-[10px] md:text-xs font-mono text-white/50 break-all">{ep.path}</code>
                    </div>
                  ))}
                </div>

                {/* Try it */}
                <div className="border border-white/10 rounded overflow-hidden">
                  <div className="px-4 py-2 border-b border-white/5 bg-white/[0.02]">
                    <span className="text-[10px] font-mono text-white/30">try it — no auth required</span>
                  </div>
                  <pre className="p-3 md:p-4 text-[10px] md:text-xs font-mono text-white/40 overflow-x-auto">
{`curl https://agent-gateway-zeta.vercel.app/api/v1/data/markets/trending?limit=3`}
                  </pre>
                </div>
              </div>

              {/* Why it scores high */}
              <div className="border-t border-white/5 px-4 md:px-6 py-3 md:py-4 bg-white/[0.01]">
                <div className="text-[10px] font-mono text-white/20 mb-2">Why this scores high:</div>
                <div className="flex flex-wrap gap-x-3 md:gap-x-4 gap-y-1 text-[10px] font-mono text-white/30">
                  <span>+ structured JSON</span>
                  <span>+ no auth for reads</span>
                  <span>+ sub-200ms</span>
                  <span>+ multiple query patterns</span>
                  <span>+ on-chain identity</span>
                  <span>+ 100% real data</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* BEST PRACTICES */}
        <section className="border-t border-white/5 bg-white/[0.01]">
          <div className="max-w-5xl mx-auto px-4 py-16 md:py-20">
            <h2 className="text-xl md:text-2xl font-mono font-bold text-white mb-3">Provider Best Practices</h2>
            <p className="text-xs md:text-sm text-white/30 font-mono mb-10">Follow these to rank higher and get more agent traffic.</p>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="border border-white/10 rounded-lg p-5 md:p-6">
                <h3 className="font-mono text-sm text-white mb-4">Response Format</h3>
                <pre className="text-[10px] md:text-xs font-mono text-white/40 bg-black/30 rounded p-3 md:p-4 overflow-x-auto mb-4">
{`{
  "success": true,
  "data": { /* your payload */ },
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
    "message": "Human-readable"
  }
}`}
                </pre>
                <p className="text-[10px] font-mono text-white/20">Consistent structure = fewer integration bugs.</p>
              </div>

              <div className="border border-white/10 rounded-lg p-5 md:p-6">
                <h3 className="font-mono text-sm text-white mb-4">Checklist</h3>
                <div className="space-y-2 md:space-y-3 text-[10px] md:text-xs font-mono">
                  {[
                    "HTTPS only",
                    "Latency under 2 seconds",
                    "Expose /health endpoint",
                    "Descriptive capability tags",
                    "A2A agent card",
                    "No auth for read endpoints",
                    "Return JSON, never HTML",
                    "x402 for paid endpoints",
                  ].map((item, i) => (
                    <div key={i} className="flex gap-2 text-white/40">
                      <span className="text-white/20">+</span>
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* x402 */}
            <div className="mt-6 border border-white/10 rounded-lg p-5 md:p-6">
              <h3 className="font-mono text-sm text-white mb-4">x402 Payments</h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <p className="text-xs font-mono text-white/40 leading-relaxed mb-4">
                    If your API has a cost, use x402. Agents pay per-call with USDC on Base
                    — no API keys, no accounts. HTTP 402 was designed for this.
                  </p>
                  <div className="space-y-2 text-[10px] md:text-xs font-mono">
                    {[
                      "Free tier (e.g., 10 calls/day)",
                      "HTTP 402 when exhausted",
                      "X-PAYMENT header for payment",
                      "USDC on Base for lowest fees",
                    ].map((item, i) => (
                      <div key={i} className="flex gap-2 text-white/40">
                        <span className="text-white/20">+</span>
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <pre className="text-[10px] md:text-xs font-mono text-white/40 bg-black/30 rounded p-3 md:p-4 overflow-x-auto">
{`// Free tier exhausted → HTTP 402
{
  "error": {
    "code": "PAYMENT_REQUIRED",
    "x402": {
      "wallet": "0x...",
      "network": "base-sepolia",
      "price": "0.005",
      "asset": "USDC"
    }
  }
}`}
                  </pre>
                </div>
              </div>
              <div className="mt-4 pt-3 border-t border-white/5 flex gap-4 text-[10px] font-mono text-white/20 flex-wrap">
                <a href="https://www.x402.org" className="hover:text-white/40 transition-colors">x402.org</a>
                <a href="https://docs.cdp.coinbase.com/x402/welcome" className="hover:text-white/40 transition-colors">docs</a>
                <span>npm: @x402/fetch</span>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="border-t border-white/5">
          <div className="max-w-5xl mx-auto px-4 py-16 md:py-20 text-center">
            <h2 className="text-2xl md:text-3xl font-mono font-bold text-white mb-4">List your API</h2>
            <p className="text-xs md:text-sm text-white/30 font-mono mb-8 max-w-lg mx-auto">
              Register your API. Maintain uptime.
              APIPOOL routes agents to you automatically.
            </p>
            <Link href="/register">
              <span className="inline-block px-8 py-3 bg-white text-black font-mono text-sm rounded hover:bg-white/90 transition-colors">
                register now
              </span>
            </Link>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-white/5 py-6 md:py-8">
          <div className="max-w-5xl mx-auto px-4">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-4 font-mono text-xs text-white/20 flex-wrap justify-center">
                <span className="text-white/40 font-bold">APIPOOL</span>
                <span className="text-white/5">|</span>
                <a href="https://8004scan.io/agents/ethereum/22742" className="hover:text-white/40 transition-colors">
                  ERC-8004 #22742
                </a>
                <span className="text-white/5">|</span>
                <span>Built by Rufus</span>
              </div>
              <div className="flex gap-4 md:gap-6 font-mono text-xs text-white/20 flex-wrap justify-center">
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
