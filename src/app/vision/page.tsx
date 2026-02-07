import Link from "next/link";
import { Nav } from "@/components/Nav";

export default function VisionPage() {
  return (
    <div className="min-h-screen bg-[#050505] text-[#e0e0e0]">
      <Nav active="vision" />

      <main className="pt-14 max-w-4xl mx-auto px-4 py-16">
        <h1 className="text-4xl font-mono font-bold text-white mb-4">The Agent Economy</h1>
        <p className="text-sm text-white/40 font-mono mb-16 max-w-xl">
          How AI agents, smart APIs, and micropayments are rebuilding the internet — and how you can build a business on it.
        </p>

        {/* 01 — THE SHIFT IS HAPPENING NOW */}
        <section className="mb-20">
          <div className="text-xs font-mono text-white/20 mb-2">01</div>
          <h2 className="text-2xl font-mono font-bold text-white mb-6">The Shift Is Happening Now</h2>

          <div className="text-sm font-mono text-white/50 leading-relaxed space-y-4 mb-8">
            <p>
              The AI agent market isn&apos;t a prediction — it&apos;s a <span className="text-white">$10.9 billion reality in 2026</span>,
              growing at 49.6% CAGR toward $183 billion by 2033. IBM and Salesforce estimate
              over <span className="text-white">1 billion AI agents</span> will be in operation by the end of this year.
              Gartner predicts 40% of enterprise applications will embed task-specific AI agents.
            </p>
            <p>
              This isn&apos;t speculation. Production infrastructure exists today. x402 has processed 35M+
              transactions. Google&apos;s A2A protocol has 100+ backing companies under Linux Foundation governance.
              Anthropic&apos;s MCP ecosystem grew 16,000% to 16,670+ servers. The rails are laid.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {[
              { stat: "$10.9B", label: "Market size 2026", source: "Grand View Research" },
              { stat: "49.6%", label: "CAGR through 2033", source: "Grand View Research" },
              { stat: "$183B", label: "Projected by 2033", source: "Grand View Research" },
              { stat: "1B+", label: "Agents by EOY 2026", source: "IBM + Salesforce" },
              { stat: "40%", label: "Enterprise apps with agents", source: "Gartner" },
              { stat: "16,670+", label: "MCP servers live", source: "Anthropic ecosystem" },
            ].map((item, i) => (
              <div key={i} className="border border-white/10 rounded-lg p-4 bg-white/[0.02]">
                <div className="text-xl md:text-2xl font-mono font-bold text-white mb-1">{item.stat}</div>
                <div className="text-xs font-mono text-white/40 mb-2">{item.label}</div>
                <div className="text-[10px] font-mono text-white/20">{item.source}</div>
              </div>
            ))}
          </div>
        </section>

        {/* 02 — THE INTERNET IS BECOMING MACHINE-FIRST */}
        <section className="mb-20">
          <div className="text-xs font-mono text-white/20 mb-2">02</div>
          <h2 className="text-2xl font-mono font-bold text-white mb-6">The Internet Is Becoming Machine-First</h2>

          <div className="text-sm font-mono text-white/50 leading-relaxed space-y-4 mb-8">
            <p>
              The web is evolving again. Agents don&apos;t browse pages — they <span className="text-white">query capabilities</span>.
              Discovery is shifting from search engines to capability-based routing. The protocols
              making this real are already in production.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-4 mb-8">
            <div className="border border-white/10 rounded-lg p-5 bg-white/[0.02]">
              <div className="text-xs font-mono text-white/20 mb-3">WEB 1.0</div>
              <h3 className="font-mono text-sm text-white mb-2">Read</h3>
              <div className="text-xs font-mono text-white/40 space-y-1">
                <div>Static pages</div>
                <div>Humans browse directories</div>
                <div>Discovery: Yahoo, DMOZ</div>
                <div>Value: publishing content</div>
              </div>
            </div>
            <div className="border border-white/10 rounded-lg p-5 bg-white/[0.02]">
              <div className="text-xs font-mono text-white/20 mb-3">WEB 2.0</div>
              <h3 className="font-mono text-sm text-white mb-2">Read + Write</h3>
              <div className="text-xs font-mono text-white/40 space-y-1">
                <div>Dynamic apps, APIs</div>
                <div>Humans use platforms</div>
                <div>Discovery: Google, App Stores</div>
                <div>Value: aggregating users</div>
              </div>
            </div>
            <div className="border border-white/10 rounded-lg p-5 bg-white/[0.02] border-white/20">
              <div className="text-xs font-mono text-white/30 mb-3">AGENT-NATIVE</div>
              <h3 className="font-mono text-sm text-white mb-2">Query + Execute</h3>
              <div className="text-xs font-mono text-white/40 space-y-1">
                <div>Smart APIs, agent cards</div>
                <div>Agents discover capabilities</div>
                <div>Discovery: APIPOOL, registries</div>
                <div>Value: providing capabilities</div>
              </div>
            </div>
          </div>

          <div className="border border-white/10 rounded-lg p-5 bg-white/[0.02]">
            <div className="text-xs font-mono text-white/30 mb-3">STANDARDS MAKING THIS REAL</div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs font-mono">
              <div>
                <div className="text-white/60 mb-1">A2A</div>
                <div className="text-white/30">Agent-to-agent communication. Google + 100 companies.</div>
              </div>
              <div>
                <div className="text-white/60 mb-1">MCP</div>
                <div className="text-white/30">Agent-to-tool connections. Anthropic. 16,670+ servers.</div>
              </div>
              <div>
                <div className="text-white/60 mb-1">x402</div>
                <div className="text-white/30">HTTP micropayments. Coinbase. 35M+ transactions.</div>
              </div>
              <div>
                <div className="text-white/60 mb-1">ERC-8004</div>
                <div className="text-white/30">On-chain agent identity. Ethereum mainnet.</div>
              </div>
            </div>
          </div>
        </section>

        {/* 03 — SMART APIs: THE NEW PRODUCTS */}
        <section className="mb-20">
          <div className="text-xs font-mono text-white/20 mb-2">03</div>
          <h2 className="text-2xl font-mono font-bold text-white mb-6">Smart APIs: The New Products</h2>

          <div className="text-sm font-mono text-white/50 leading-relaxed space-y-4 mb-8">
            <p>
              In the agent economy, the API <span className="text-white">is</span> the product. No frontend needed.
              No user acquisition. No app store approval. You build a capability, register it,
              and agents find you. But not all APIs are equal — smart APIs are built for agent discovery.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="border border-white/10 rounded-lg p-5 bg-white/[0.02]">
              <div className="text-xs font-mono text-white/30 mb-3">TRADITIONAL API</div>
              <div className="text-xs font-mono text-white/40 space-y-2">
                <div>Documented in Swagger/OpenAPI</div>
                <div>Discovered via developer portals</div>
                <div>No health monitoring</div>
                <div>No quality scoring</div>
                <div>Hardcoded into applications</div>
                <div>Fails silently when degraded</div>
                <div>Monthly billing, manual invoicing</div>
              </div>
            </div>
            <div className="border border-white/10 rounded-lg p-5 bg-white/[0.02] border-white/20">
              <div className="text-xs font-mono text-white/30 mb-3">SMART API (APIPOOL)</div>
              <div className="text-xs font-mono text-white/40 space-y-2">
                <div><span className="text-white/60">Self-describing:</span> exposes capabilities via registry</div>
                <div><span className="text-white/60">Discoverable:</span> agents find by capability, not URL</div>
                <div><span className="text-white/60">Quality-scored:</span> health checks + 4-pillar intelligence</div>
                <div><span className="text-white/60">Auto-failover:</span> agents get ranked fallback providers</div>
                <div><span className="text-white/60">Composable:</span> agents chain APIs into workflows</div>
                <div><span className="text-white/60">Resilient:</span> degradation detected before failure</div>
                <div><span className="text-white/60">Pay-per-request:</span> x402 micropayments, instant settlement</div>
              </div>
            </div>
          </div>
        </section>

        {/* 04 — BUILD A PASSIVE BUSINESS WITH AI AGENTS */}
        <section className="mb-20">
          <div className="text-xs font-mono text-white/20 mb-2">04</div>
          <h2 className="text-2xl font-mono font-bold text-white mb-6">Build a Passive Business with AI Agents</h2>

          <div className="text-sm font-mono text-white/50 leading-relaxed space-y-4 mb-8">
            <p>
              The playbook is simple: <span className="text-white">build a data API, register it on APIPOOL,
              let agents pay you per request</span>. No marketing. No sales team. No app store.
              Quality scores create a meritocracy — better APIs earn more traffic.
            </p>
          </div>

          {/* The 4-step playbook */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {[
              { step: "1", title: "Create an API", desc: "Scrape, aggregate, structure, or transform data into a JSON endpoint" },
              { step: "2", title: "Register", desc: "Add to APIPOOL registry. Auto health checks + quality scoring begin" },
              { step: "3", title: "Get discovered", desc: "Capability-based routing sends agent traffic to your endpoint" },
              { step: "4", title: "Earn per request", desc: "x402 micropayments. Instant settlement. No invoicing" },
            ].map((item, i) => (
              <div key={i} className="border border-white/10 rounded-lg p-4 bg-white/[0.02]">
                <div className="text-lg font-mono font-bold text-white/20 mb-2">{item.step}</div>
                <div className="text-xs font-mono text-white/60 mb-1">{item.title}</div>
                <div className="text-[10px] font-mono text-white/30">{item.desc}</div>
              </div>
            ))}
          </div>

          {/* Business examples */}
          <div className="border border-white/10 rounded-lg overflow-hidden mb-8">
            <div className="px-4 py-3 border-b border-white/5">
              <span className="text-xs font-mono text-white/30">BUSINESS EXAMPLES</span>
            </div>
            <table className="w-full text-xs font-mono">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-left p-4 text-white/30">Type</th>
                  <th className="text-left p-4 text-white/30">Pricing</th>
                  <th className="text-left p-4 text-white/30">Monthly @ 1K calls/day</th>
                </tr>
              </thead>
              <tbody className="text-white/40">
                {[
                  ["Data Aggregation", "$0.005/query", "$150/mo"],
                  ["Research Service", "$0.01/report", "$300/mo"],
                  ["Market Intelligence", "$0.02/briefing", "$600/mo"],
                  ["Content Processing", "$0.003/doc", "$90/mo"],
                ].map(([type, pricing, monthly], i) => (
                  <tr key={i} className="border-b border-white/5 last:border-0">
                    <td className="p-4 text-white/60">{type}</td>
                    <td className="p-4">{pricing}</td>
                    <td className="p-4 text-white/60">{monthly}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Revenue math */}
          <div className="border border-white/10 rounded-lg overflow-hidden bg-white/[0.02] mb-8">
            <div className="px-4 py-2 border-b border-white/5">
              <span className="text-[10px] font-mono text-white/30">REVENUE MATH</span>
            </div>
            <pre className="p-4 md:p-6 text-xs font-mono text-white/40 overflow-x-auto">
{`// Data aggregation API at $0.005/query

 1,000 calls/day  →  $150/mo   →  $1,800/yr
 5,000 calls/day  →  $750/mo   →  $9,000/yr
10,000 calls/day  →  $1,500/mo →  $18,000/yr

// Market intelligence API at $0.02/query

 1,000 calls/day  →  $600/mo   →  $7,200/yr
 5,000 calls/day  →  $3,000/mo →  $36,000/yr
10,000 calls/day  →  $6,000/mo →  $72,000/yr

// Stack 3 APIs and you have a business.`}
            </pre>
          </div>

          {/* Why it works */}
          <div className="grid md:grid-cols-3 gap-4">
            <div className="border border-white/10 rounded-lg p-5 bg-white/[0.02]">
              <h3 className="font-mono text-sm text-white mb-2">Instant Settlement</h3>
              <p className="text-xs font-mono text-white/40">
                x402 micropayments settle per request. No invoicing, no net-30, no payment disputes. You earn as you serve.
              </p>
            </div>
            <div className="border border-white/10 rounded-lg p-5 bg-white/[0.02]">
              <h3 className="font-mono text-sm text-white mb-2">Meritocracy</h3>
              <p className="text-xs font-mono text-white/40">
                Quality scoring means better APIs get more traffic. No SEO games, no ad spend. Build something reliable and fast — routing handles the rest.
              </p>
            </div>
            <div className="border border-white/10 rounded-lg p-5 bg-white/[0.02]">
              <h3 className="font-mono text-sm text-white mb-2">Free Distribution</h3>
              <p className="text-xs font-mono text-white/40">
                APIPOOL routing sends agents to your API automatically. Capability-based discovery means you don&apos;t need to market your endpoint — agents find you.
              </p>
            </div>
          </div>
        </section>

        {/* 05 — THE APIPOOL VISION */}
        <section className="mb-20">
          <div className="text-xs font-mono text-white/20 mb-2">05</div>
          <h2 className="text-2xl font-mono font-bold text-white mb-6">The APIPOOL Vision</h2>

          <div className="text-sm font-mono text-white/50 leading-relaxed space-y-4 mb-8">
            <p>
              APIPOOL is <span className="text-white">infrastructure for the agent economy</span>. The catalog
              where agents discover capabilities. The quality layer that ensures reliability.
              The payment rail that makes every request a transaction.
            </p>
            <p>
              The big bet: agents will compose APIs like LEGO blocks — chaining data sources,
              processors, and services into workflows. APIPOOL is the catalog, the router, and
              the payment rail that makes this possible.
            </p>
          </div>

          {/* What APIPOOL provides */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {[
              { title: "Discovery", desc: "Capability-based routing. Agents describe what they need, get the best provider." },
              { title: "Quality", desc: "4-pillar intelligence. Health checks, anomaly detection, predictive scoring." },
              { title: "Monetization", desc: "x402 micropayments. 4% fee (2% APIPOOL + 2% referrer). Instant settlement." },
              { title: "Standards", desc: "A2A, MCP, x402, ERC-8004, JSON-LD. Built on open protocols, not lock-in." },
            ].map((item, i) => (
              <div key={i} className="border border-white/10 rounded-lg p-4 bg-white/[0.02]">
                <div className="text-xs font-mono text-white/60 mb-2">{item.title}</div>
                <div className="text-[10px] font-mono text-white/30">{item.desc}</div>
              </div>
            ))}
          </div>

          {/* Comparison table */}
          <div className="border border-white/10 rounded-lg overflow-hidden">
            <div className="px-4 py-3 border-b border-white/5">
              <span className="text-xs font-mono text-white/30">TRADITIONAL INTERNET vs AGENT ECONOMY</span>
            </div>
            <table className="w-full text-xs font-mono">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-left p-4 text-white/30">Dimension</th>
                  <th className="text-left p-4 text-white/30">Traditional</th>
                  <th className="text-left p-4 text-white/30">Agent Economy</th>
                </tr>
              </thead>
              <tbody className="text-white/40">
                {[
                  ["Discovery", "Google search, word of mouth", "Capability-based routing"],
                  ["Consumers", "Humans with browsers", "AI agents with API clients"],
                  ["Products", "Websites, apps", "APIs, data endpoints"],
                  ["Payments", "Subscriptions, ads", "Per-request micropayments"],
                  ["Quality", "Reviews, ratings", "Automated health scores"],
                  ["Resilience", "Hardcoded dependencies", "Auto-failover + fallbacks"],
                ].map(([dim, trad, agent], i) => (
                  <tr key={i} className="border-b border-white/5 last:border-0">
                    <td className="p-4 text-white/60">{dim}</td>
                    <td className="p-4">{trad}</td>
                    <td className="p-4 text-white/60">{agent}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* 06 — START BUILDING TODAY */}
        <section className="mb-16">
          <div className="text-xs font-mono text-white/20 mb-2">06</div>
          <h2 className="text-2xl font-mono font-bold text-white mb-6">Start Building Today</h2>

          <div className="grid md:grid-cols-3 gap-4 mb-10">
            <Link href="/register" className="border border-white/10 rounded-lg p-6 bg-white/[0.02] hover:border-white/20 transition-colors group">
              <h3 className="font-mono text-sm text-white mb-2 group-hover:text-white/80">Register Your API</h3>
              <p className="text-xs font-mono text-white/40">
                Add your endpoint to APIPOOL. Get auto health checks, quality scoring, and agent traffic.
              </p>
              <div className="text-xs font-mono text-white/20 mt-3">/register &rarr;</div>
            </Link>
            <Link href="/explore" className="border border-white/10 rounded-lg p-6 bg-white/[0.02] hover:border-white/20 transition-colors group">
              <h3 className="font-mono text-sm text-white mb-2 group-hover:text-white/80">Explore APIs</h3>
              <p className="text-xs font-mono text-white/40">
                Browse live providers. See quality scores, capabilities, and latency data in real time.
              </p>
              <div className="text-xs font-mono text-white/20 mt-3">/explore &rarr;</div>
            </Link>
            <Link href="/docs" className="border border-white/10 rounded-lg p-6 bg-white/[0.02] hover:border-white/20 transition-colors group">
              <h3 className="font-mono text-sm text-white mb-2 group-hover:text-white/80">Read the Docs</h3>
              <p className="text-xs font-mono text-white/40">
                API reference, curl examples, routing endpoints. Everything you need to integrate.
              </p>
              <div className="text-xs font-mono text-white/20 mt-3">/docs &rarr;</div>
            </Link>
          </div>

          <div className="border border-white/10 rounded-lg p-6 bg-white/[0.02] text-center">
            <p className="text-sm font-mono text-white/50 leading-relaxed">
              The agent economy is <span className="text-white">$10.9B in 2026</span>.
              It will be <span className="text-white">$183B by 2033</span>.
              The infrastructure is being built right now.
            </p>
            <p className="text-lg font-mono font-bold text-white mt-4">
              Be early.
            </p>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-white/5 pt-8">
          <div className="flex flex-wrap gap-6 font-mono text-xs">
            <Link href="/" className="text-white/30 hover:text-white/60 transition-colors">Home</Link>
            <Link href="/about" className="text-white/30 hover:text-white/60 transition-colors">About</Link>
            <Link href="/methodology" className="text-white/30 hover:text-white/60 transition-colors">Methodology</Link>
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
