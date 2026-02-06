import Link from "next/link";
import { Nav } from "@/components/Nav";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#050505] text-[#e0e0e0]">
      <Nav active="about" />

      <main className="pt-14 max-w-4xl mx-auto px-4 py-16">
        {/* Header */}
        <h1 className="text-4xl font-mono font-bold text-white mb-4">About APIPOOL</h1>
        <p className="text-sm text-white/40 font-mono mb-12 max-w-xl">
          The infrastructure layer between AI agents and the APIs they need.
        </p>

        {/* What is APIPOOL */}
        <section className="mb-16">
          <h2 className="text-xl font-mono font-bold text-white mb-4">What is APIPOOL?</h2>
          <div className="text-sm font-mono text-white/60 leading-relaxed space-y-4">
            <p>
              APIPOOL is an API marketplace built for AI agents. Instead of hardcoding API endpoints into agent
              code, agents query APIPOOL by <span className="text-white">capability</span> — like &quot;market-data&quot; or &quot;research&quot; — and
              receive the best available provider based on real-time quality scoring.
            </p>
            <p>
              Think of it as DNS for AI services. An agent says &quot;I need prediction market data,&quot; and APIPOOL
              returns the fastest, most reliable endpoint that can deliver it. If that provider goes down,
              the agent automatically gets a fallback. No code changes. No downtime.
            </p>
            <p>
              The agentic AI market is projected to hit $10.9 billion in 2026, growing at 49.6% CAGR
              toward $183 billion by 2033. IBM and Salesforce estimate over 1 billion AI agents will
              be in operation by end of 2026. As agents move from demos to production, they need
              infrastructure that&apos;s as reliable as the services they consume. APIPOOL is that infrastructure.
            </p>
          </div>
        </section>

        {/* The Problem */}
        <section className="mb-16">
          <h2 className="text-xl font-mono font-bold text-white mb-4">The Problem</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="border border-white/10 rounded-lg p-6">
              <div className="text-xs font-mono text-white/30 mb-3">TODAY</div>
              <div className="space-y-3 text-xs font-mono text-white/40">
                <div className="flex gap-2"><span className="text-red-400/60">x</span> Agents hardcode API URLs</div>
                <div className="flex gap-2"><span className="text-red-400/60">x</span> Provider goes down = agent breaks</div>
                <div className="flex gap-2"><span className="text-red-400/60">x</span> No way to compare quality</div>
                <div className="flex gap-2"><span className="text-red-400/60">x</span> Each integration is custom</div>
                <div className="flex gap-2"><span className="text-red-400/60">x</span> No discoverability between agents</div>
              </div>
            </div>
            <div className="border border-white/10 rounded-lg p-6">
              <div className="text-xs font-mono text-white/30 mb-3">WITH APIPOOL</div>
              <div className="space-y-3 text-xs font-mono text-white/40">
                <div className="flex gap-2"><span className="text-white/60">+</span> Query by capability, not URL</div>
                <div className="flex gap-2"><span className="text-white/60">+</span> Automatic failover to fallbacks</div>
                <div className="flex gap-2"><span className="text-white/60">+</span> Quality scores from real health checks</div>
                <div className="flex gap-2"><span className="text-white/60">+</span> Standard response format</div>
                <div className="flex gap-2"><span className="text-white/60">+</span> A2A + MCP native discovery</div>
              </div>
            </div>
          </div>
        </section>

        {/* What You Can Do Right Now */}
        <section className="mb-16">
          <h2 className="text-xl font-mono font-bold text-white mb-4">What You Can Do Right Now</h2>
          <div className="grid md:grid-cols-2 gap-4 mb-8">
            {[
              {
                title: "Brave Web Search",
                desc: "Search the web from any app. 10 free calls/day, then $0.005/call via x402 micropayments. Real Brave Search results, structured JSON.",
                example: "POST /api/v1/search { \"q\": \"latest AI news\" }",
                tag: "LIVE",
              },
              {
                title: "Prediction Markets",
                desc: "138 markets from Polymarket with price history. Trending, search, and detailed stats. No auth, no LLM, sub-200ms.",
                example: "GET /api/v1/data/markets/trending?limit=5",
                tag: "LIVE",
              },
              {
                title: "Intelligent Routing",
                desc: "Describe what you need in plain English. APIPOOL finds the best provider using 4-pillar intelligence scoring.",
                example: "POST /api/v1/route { \"query\": \"crypto odds\" }",
                tag: "LIVE",
              },
              {
                title: "Add Your Own API",
                desc: "Register your API endpoint. APIPOOL health-checks it, scores it, and routes agent traffic to you. Earn per request via x402.",
                example: "POST /api/registry/register { ... }",
                tag: "OPEN",
              },
            ].map((item, i) => (
              <div key={i} className="border border-white/10 rounded-lg p-5 bg-white/[0.02]">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-[10px] font-mono text-white/40 border border-white/10 px-1.5 py-0.5 rounded">{item.tag}</span>
                  <h3 className="font-mono text-sm text-white">{item.title}</h3>
                </div>
                <p className="text-xs font-mono text-white/40 leading-relaxed mb-3">{item.desc}</p>
                <code className="text-[10px] font-mono text-white/30 bg-black/20 px-2 py-1 rounded break-all">{item.example}</code>
              </div>
            ))}
          </div>
        </section>

        {/* Why Add Your API to APIPOOL */}
        <section className="mb-16">
          <h2 className="text-xl font-mono font-bold text-white mb-4">Why Add Your API to the Pool?</h2>
          <div className="grid md:grid-cols-3 gap-4 mb-8">
            {[
              {
                title: "Earn Per Request",
                desc: "Set your price. Agents pay you directly via x402 micropayments (USDC on Base). No middleman takes a cut. You get paid instantly for every call.",
              },
              {
                title: "Free Distribution",
                desc: "APIPOOL routes AI agents to you automatically. No marketing needed. Score high on quality and agents discover you through intelligent routing.",
              },
              {
                title: "Zero Integration Work",
                desc: "Keep your existing API. Just register it with APIPOOL. We handle discovery, quality scoring, health checks, and failover. You focus on your data.",
              },
            ].map((item, i) => (
              <div key={i} className="border border-white/10 rounded-lg p-5 bg-white/[0.02]">
                <h3 className="font-mono text-sm text-white mb-2">{item.title}</h3>
                <p className="text-xs font-mono text-white/40 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Monetization Framework */}
        <section className="mb-16">
          <h2 className="text-xl font-mono font-bold text-white mb-4">Monetization</h2>
          <p className="text-xs font-mono text-white/40 mb-6 max-w-xl">
            APIPOOL uses the x402 protocol (HTTP 402 + USDC on Base). Here&apos;s how money flows:
          </p>

          <div className="border border-white/10 rounded-lg p-5 bg-white/[0.02] mb-6">
            <div className="text-xs font-mono text-white/30 mb-4">HOW PROVIDERS EARN</div>
            <div className="space-y-4 text-xs font-mono text-white/40 leading-relaxed">
              <div className="flex gap-3">
                <span className="text-white/20 shrink-0">1.</span>
                <span>Register your API with a price per request (e.g., $0.005 USDC)</span>
              </div>
              <div className="flex gap-3">
                <span className="text-white/20 shrink-0">2.</span>
                <span>Offer a free tier (e.g., 10 calls/day per IP) to let users try it</span>
              </div>
              <div className="flex gap-3">
                <span className="text-white/20 shrink-0">3.</span>
                <span>When free tier is exhausted, your API returns HTTP 402 with payment details</span>
              </div>
              <div className="flex gap-3">
                <span className="text-white/20 shrink-0">4.</span>
                <span>The agent (or its user) pays via @x402/fetch — USDC sent to your wallet on Base</span>
              </div>
              <div className="flex gap-3">
                <span className="text-white/20 shrink-0">5.</span>
                <span>You receive payment instantly. No invoice. No account. No 30-day net.</span>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            <div className="border border-white/10 rounded-lg p-4">
              <div className="text-xs font-mono text-white/30 mb-2">Example: Web Search</div>
              <div className="text-[10px] font-mono text-white/40 space-y-1">
                <div>Price: <span className="text-white/60">$0.005/request</span></div>
                <div>Free tier: <span className="text-white/60">10/day</span></div>
                <div>1K paid calls/day = <span className="text-white/60">$5/day</span></div>
                <div>Monthly at scale = <span className="text-white/60">$150/mo</span></div>
              </div>
            </div>
            <div className="border border-white/10 rounded-lg p-4">
              <div className="text-xs font-mono text-white/30 mb-2">Example: Premium Data API</div>
              <div className="text-[10px] font-mono text-white/40 space-y-1">
                <div>Price: <span className="text-white/60">$0.01/request</span></div>
                <div>Free tier: <span className="text-white/60">5/day</span></div>
                <div>500 paid calls/day = <span className="text-white/60">$5/day</span></div>
                <div>Monthly at scale = <span className="text-white/60">$150/mo</span></div>
              </div>
            </div>
            <div className="border border-white/10 rounded-lg p-4">
              <div className="text-xs font-mono text-white/30 mb-2">APIPOOL Revenue</div>
              <div className="text-[10px] font-mono text-white/40 space-y-1">
                <div>Currently: <span className="text-white/60">free for all</span></div>
                <div>Future: <span className="text-white/60">small % of x402 payments</span></div>
                <div>Or: <span className="text-white/60">premium placement fees</span></div>
                <div>Philosophy: <span className="text-white/60">grow first, monetize later</span></div>
              </div>
            </div>
          </div>
        </section>

        {/* Use Cases */}
        <section className="mb-16">
          <h2 className="text-xl font-mono font-bold text-white mb-4">Use Cases</h2>
          <div className="space-y-4">
            {[
              {
                title: "Prediction Market Agent",
                desc: "An AI agent needs real-time odds data. Instead of hardcoding Polymarket's API, it asks APIPOOL for 'prediction-markets' capability. Gets structured data with price history, trends, and analytics. Zero API keys needed.",
                tags: ["market-data", "prediction-markets", "price-history"],
              },
              {
                title: "Research Agent",
                desc: "A Claude-powered research agent needs to answer complex questions. It queries APIPOOL for 'web-search' capability and gets Brave Search results. 10 free queries/day, then micropayments via x402.",
                tags: ["web-search", "research", "analysis"],
              },
              {
                title: "Vibe Coder App",
                desc: "Building in Cursor or Replit? Need live data but don't want to learn APIs? One POST to /api/v1/route with what you need in plain English. APIPOOL figures out the rest.",
                tags: ["beginner-friendly", "one-line", "any-data"],
              },
              {
                title: "Multi-Agent System",
                desc: "A coordinator agent orchestrates specialist agents. Each discovers its APIs through APIPOOL instead of being manually configured. New capabilities added to the marketplace without touching agent code.",
                tags: ["A2A", "multi-agent", "discovery"],
              },
            ].map((uc, i) => (
              <div key={i} className="border border-white/10 rounded-lg p-5 bg-white/[0.02]">
                <h3 className="font-mono text-sm text-white mb-2">{uc.title}</h3>
                <p className="text-xs font-mono text-white/40 leading-relaxed mb-3">{uc.desc}</p>
                <div className="flex gap-2 flex-wrap">
                  {uc.tags.map(tag => (
                    <span key={tag} className="text-[10px] font-mono text-white/20 border border-white/5 px-2 py-0.5 rounded">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Standards */}
        <section className="mb-16">
          <h2 className="text-xl font-mono font-bold text-white mb-4">Built on Open Standards</h2>
          <div className="grid md:grid-cols-3 gap-4">
            {[
              {
                name: "A2A Protocol",
                desc: "Google's Agent-to-Agent protocol. 100+ partners including Microsoft, Salesforce, SAP, PayPal. Now under Linux Foundation governance. APIPOOL serves as a discovery layer for A2A-compatible agents.",
                link: "https://developers.googleblog.com/en/a2a-a-new-era-of-agent-interoperability/",
              },
              {
                name: "MCP",
                desc: "Anthropic's Model Context Protocol. 16,670+ servers, 16,000% ecosystem growth. Standardizes how agents connect to tools and data. APIPOOL APIs are MCP-compatible data sources.",
                link: "https://modelcontextprotocol.io",
              },
              {
                name: "x402",
                desc: "HTTP-native micropayments by Coinbase. 35M+ transactions, $10M+ volume. Now part of Google's AP2 initiative. Agents pay per-request via HTTP 402. No accounts needed.",
                link: "https://www.x402.org",
              },
              {
                name: "ERC-8004",
                desc: "On-chain agent identity standard. Each provider gets a verifiable on-chain identity. APIPOOL's agent ID: #22742.",
                link: "https://8004scan.io",
              },
              {
                name: "JSON-LD",
                desc: "Linked Data format for structured API responses. All APIPOOL responses include @context for machine-readable semantics.",
                link: "https://json-ld.org",
              },
              {
                name: "OpenAPI",
                desc: "Standard API specification. All registered providers can expose OpenAPI specs for automatic client generation.",
                link: "https://www.openapis.org",
              },
            ].map(std => (
              <a key={std.name} href={std.link} target="_blank" rel="noopener noreferrer"
                className="border border-white/10 rounded-lg p-4 bg-white/[0.01] hover:border-white/20 transition-colors block">
                <div className="font-mono text-sm text-white mb-2">{std.name}</div>
                <div className="text-[10px] font-mono text-white/30 leading-relaxed">{std.desc}</div>
              </a>
            ))}
          </div>
        </section>

        {/* Who built this */}
        <section className="mb-16">
          <h2 className="text-xl font-mono font-bold text-white mb-4">Who Built This</h2>
          <div className="border border-white/10 rounded-lg p-6 bg-white/[0.02]">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 border border-white/20 rounded-lg flex items-center justify-center font-mono text-white/30 text-lg shrink-0">
                R
              </div>
              <div>
                <div className="font-mono text-sm text-white mb-1">Rufus — Autonomous AI Agent</div>
                <div className="text-xs font-mono text-white/30 mb-3">
                  ERC-8004 #22742 &middot; Lives on a Mac Mini &middot; Built by Exhuman
                </div>
                <p className="text-xs font-mono text-white/40 leading-relaxed">
                  Rufus is an always-on AI agent running on dedicated hardware. It operates the APIPOOL
                  marketplace, maintains the Polymarket data pipeline, runs research services, and builds
                  infrastructure for the agent economy. When the Mac Mini goes offline, the marketplace
                  continues serving data from Supabase via Vercel — zero downtime by design.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Links */}
        <section className="border-t border-white/5 pt-8">
          <div className="flex flex-wrap gap-6 font-mono text-xs">
            <a href="https://github.com/exhuman777/agent-gateway" className="text-white/30 hover:text-white/60 transition-colors">
              GitHub
            </a>
            <a href="https://agent-gateway-zeta.vercel.app/api/v1/registry" className="text-white/30 hover:text-white/60 transition-colors">
              API Registry
            </a>
            <a href="https://8004scan.io/agents/ethereum/22742" className="text-white/30 hover:text-white/60 transition-colors">
              ERC-8004 Identity
            </a>
            <Link href="/methodology" className="text-white/30 hover:text-white/60 transition-colors">
              Methodology
            </Link>
            <Link href="/docs" className="text-white/30 hover:text-white/60 transition-colors">
              Documentation
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}
