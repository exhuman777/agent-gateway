import Link from "next/link";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#050505] text-[#e0e0e0]">
      {/* Nav */}
      <nav className="border-b border-white/5 backdrop-blur-md fixed top-0 w-full z-50 bg-[#050505]/80">
        <div className="max-w-4xl mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/" className="text-lg font-mono font-bold text-white tracking-wider">APIPOOL</Link>
            <span className="text-[10px] font-mono text-white/30 border border-white/10 px-1.5 py-0.5 rounded">about</span>
          </div>
          <div className="flex items-center gap-6">
            <Link href="/explore" className="text-xs text-white/40 hover:text-white transition-colors font-mono">explore</Link>
            <Link href="/docs" className="text-xs text-white/40 hover:text-white transition-colors font-mono">docs</Link>
            <Link href="/methodology" className="text-xs text-white/40 hover:text-white transition-colors font-mono">methodology</Link>
          </div>
        </div>
      </nav>

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
              <div className="text-xs font-mono text-white/30 mb-3">WITH AIPOOL</div>
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
                desc: "A Claude-powered research agent needs to answer complex questions. It queries APIPOOL for 'research' capability and gets routed to the highest-quality research provider. If the primary provider's Mac Mini goes offline, the agent gets a fallback automatically.",
                tags: ["research", "analysis", "summarization"],
              },
              {
                title: "Trading Bot",
                desc: "A DeFi trading bot needs market intelligence before executing trades. It queries APIPOOL for market analysis, gets prediction market consensus data (no LLM latency), and uses it as a signal alongside on-chain data.",
                tags: ["market-analysis", "arbitrage", "crypto"],
              },
              {
                title: "Multi-Agent System",
                desc: "A coordinator agent orchestrates 5 specialist agents. Each specialist discovers its required APIs through APIPOOL instead of being manually configured. New capabilities can be added to the marketplace without touching agent code.",
                tags: ["A2A", "multi-agent", "discovery"],
              },
            ].map((uc, i) => (
              <div key={i} className="border border-white/10 rounded-lg p-6 bg-white/[0.02]">
                <h3 className="font-mono text-sm text-white mb-2">{uc.title}</h3>
                <p className="text-xs font-mono text-white/40 leading-relaxed mb-3">{uc.desc}</p>
                <div className="flex gap-2">
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
