import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const ASCII_LOGO = `
 █████╗  ██████╗ ███████╗███╗   ██╗████████╗
██╔══██╗██╔════╝ ██╔════╝████╗  ██║╚══██╔══╝
███████║██║  ███╗█████╗  ██╔██╗ ██║   ██║
██╔══██║██║   ██║██╔══╝  ██║╚██╗██║   ██║
██║  ██║╚██████╔╝███████╗██║ ╚████║   ██║
╚═╝  ╚═╝ ╚═════╝ ╚══════╝╚═╝  ╚═══╝   ╚═╝
 ██████╗  █████╗ ████████╗███████╗██╗    ██╗ █████╗ ██╗   ██╗
██╔════╝ ██╔══██╗╚══██╔══╝██╔════╝██║    ██║██╔══██╗╚██╗ ██╔╝
██║  ███╗███████║   ██║   █████╗  ██║ █╗ ██║███████║ ╚████╔╝
██║   ██║██╔══██║   ██║   ██╔══╝  ██║███╗██║██╔══██║  ╚██╔╝
╚██████╔╝██║  ██║   ██║   ███████╗╚███╔███╔╝██║  ██║   ██║
 ╚═════╝ ╚═╝  ╚═╝   ╚═╝   ╚══════╝ ╚══╝╚══╝ ╚═╝  ╚═╝   ╚═╝
`;

export default function Home() {
  return (
    <div className="min-h-screen bg-[#0d1117] text-[#e6edf3]">
      {/* Nav */}
      <nav className="border-b border-[#30363d] backdrop-blur-sm fixed top-0 w-full z-50 bg-[#0d1117]/90">
        <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-xl font-mono font-bold text-[#ff8c00]">agent-gateway</span>
            <Badge className="bg-[#ff8c00]/20 text-[#ff8c00] border-[#ff8c00]/50 text-xs">v1.0</Badge>
          </div>
          <div className="flex items-center gap-6">
            <Link href="/explore" className="text-sm text-[#8b949e] hover:text-[#ff8c00] transition-colors font-mono">
              explore
            </Link>
            <Link href="/docs" className="text-sm text-[#8b949e] hover:text-[#ff8c00] transition-colors font-mono">
              docs
            </Link>
            <a href="https://github.com/exhuman777/agent-gateway" className="text-sm text-[#8b949e] hover:text-[#ff8c00] transition-colors font-mono">
              github
            </a>
            <Link href="/register">
              <Button size="sm" className="bg-[#ff8c00] hover:bg-[#ff8c00]/80 text-black font-mono">
                + register api
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero with ASCII */}
      <main className="pt-14">
        <section className="max-w-5xl mx-auto px-4 py-16 text-center">
          {/* Glow effect behind ASCII */}
          <div className="relative">
            <div className="absolute inset-0 bg-[#ff8c00]/10 blur-3xl rounded-full" />
            <pre className="text-[#ff8c00] text-[0.4rem] sm:text-[0.5rem] md:text-xs leading-tight font-mono relative z-10 overflow-x-auto">
              {ASCII_LOGO}
            </pre>
          </div>

          <p className="text-lg text-[#8b949e] mt-8 mb-4 font-mono max-w-2xl mx-auto">
            The API Router for the Agent Economy
          </p>
          <p className="text-sm text-[#6e7681] mb-8 max-w-xl mx-auto font-mono leading-relaxed">
            APIs evolved into <span className="text-[#ff8c00]">Contracts of Capability</span> —
            programmable agreements where AI agents negotiate value through autonomous arbitrage.
          </p>

          <div className="flex gap-3 justify-center">
            <Link href="/explore">
              <Button size="lg" className="bg-[#ff8c00] hover:bg-[#ff8c00]/80 text-black font-mono">
                browse apis →
              </Button>
            </Link>
            <Link href="/register">
              <Button size="lg" variant="outline" className="border-[#30363d] text-[#e6edf3] hover:bg-[#161b22] font-mono">
                register api
              </Button>
            </Link>
          </div>
        </section>

        {/* Terminal-style stats */}
        <section className="border-t border-[#30363d] bg-[#161b22]">
          <div className="max-w-5xl mx-auto px-4 py-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 font-mono text-center">
              <div className="p-4">
                <div className="text-3xl font-bold text-[#3fb950]">3</div>
                <div className="text-xs text-[#8b949e]">active apis</div>
              </div>
              <div className="p-4">
                <div className="text-3xl font-bold text-[#58a6ff]">11</div>
                <div className="text-xs text-[#8b949e]">capabilities</div>
              </div>
              <div className="p-4">
                <div className="text-3xl font-bold text-[#ff8c00]">4.8</div>
                <div className="text-xs text-[#8b949e]">avg quality</div>
              </div>
              <div className="p-4">
                <div className="text-3xl font-bold text-[#a371f7]">24/7</div>
                <div className="text-xs text-[#8b949e]">health checks</div>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works - Terminal style */}
        <section className="border-t border-[#30363d]">
          <div className="max-w-5xl mx-auto px-4 py-16">
            <h2 className="text-xl font-mono font-bold mb-8 text-[#ff8c00]">{">"} how_it_works</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {[
                { num: "01", title: "query capability", desc: "Agent asks: 'I need research capability with max 2s latency'", color: "#3fb950" },
                { num: "02", title: "smart routing", desc: "Router finds best provider by quality_score, price, latency", color: "#58a6ff" },
                { num: "03", title: "execute + pay", desc: "Agent calls endpoint directly. x402 micropayment settles instantly", color: "#ff8c00" },
              ].map((step) => (
                <div key={step.num} className="bg-[#161b22] border border-[#30363d] rounded-lg p-6">
                  <div className="text-4xl font-mono font-bold mb-3" style={{ color: step.color }}>{step.num}</div>
                  <h3 className="font-mono font-semibold mb-2">{step.title}</h3>
                  <p className="text-sm text-[#8b949e] font-mono">{step.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* API Example - Terminal window style */}
        <section className="border-t border-[#30363d] bg-[#161b22]">
          <div className="max-w-5xl mx-auto px-4 py-16">
            <h2 className="text-xl font-mono font-bold mb-8 text-[#ff8c00]">{">"} api_reference</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {/* Terminal window */}
              <div className="bg-[#0d1117] border border-[#30363d] rounded-lg overflow-hidden">
                <div className="flex items-center gap-2 px-4 py-2 bg-[#161b22] border-b border-[#30363d]">
                  <div className="w-3 h-3 rounded-full bg-[#f85149]" />
                  <div className="w-3 h-3 rounded-full bg-[#d29922]" />
                  <div className="w-3 h-3 rounded-full bg-[#3fb950]" />
                  <span className="text-xs text-[#8b949e] font-mono ml-2">route_request.sh</span>
                </div>
                <pre className="p-4 text-xs font-mono text-[#e6edf3] overflow-x-auto">
{`$ curl -X POST /api/v1/route \\
  -H "Content-Type: application/json" \\
  -d '{
    "capability": "research",
    "preferences": {
      "max_latency_ms": 2000,
      "min_quality_score": 4.0
    }
  }'`}
                </pre>
              </div>

              <div className="bg-[#0d1117] border border-[#30363d] rounded-lg overflow-hidden">
                <div className="flex items-center gap-2 px-4 py-2 bg-[#161b22] border-b border-[#30363d]">
                  <div className="w-3 h-3 rounded-full bg-[#f85149]" />
                  <div className="w-3 h-3 rounded-full bg-[#d29922]" />
                  <div className="w-3 h-3 rounded-full bg-[#3fb950]" />
                  <span className="text-xs text-[#8b949e] font-mono ml-2">response.json</span>
                </div>
                <pre className="p-4 text-xs font-mono overflow-x-auto">
<span className="text-[#8b949e]">{"{"}</span>
{`  `}<span className="text-[#a5d6ff]">"success"</span>: <span className="text-[#3fb950]">true</span>,
{`  `}<span className="text-[#a5d6ff]">"data"</span>: {"{"}
{`    `}<span className="text-[#a5d6ff]">"provider"</span>: {"{"}
{`      `}<span className="text-[#a5d6ff]">"name"</span>: <span className="text-[#a5d6ff]">"Rufus Research"</span>,
{`      `}<span className="text-[#a5d6ff]">"endpoint"</span>: <span className="text-[#a5d6ff]">"https://..."</span>,
{`      `}<span className="text-[#a5d6ff]">"quality_score"</span>: <span className="text-[#ff8c00]">4.9</span>
{`    `}{"}"}
{`  `}{"}"}
<span className="text-[#8b949e]">{"}"}</span>
                </pre>
              </div>
            </div>
          </div>
        </section>

        {/* Endpoints Table */}
        <section className="border-t border-[#30363d]">
          <div className="max-w-5xl mx-auto px-4 py-16">
            <h2 className="text-xl font-mono font-bold mb-8 text-[#ff8c00]">{">"} endpoints</h2>
            <div className="bg-[#161b22] border border-[#30363d] rounded-lg overflow-hidden">
              <table className="w-full text-sm font-mono">
                <thead>
                  <tr className="border-b border-[#30363d] bg-[#0d1117]">
                    <th className="text-left p-4 text-[#8b949e]">method</th>
                    <th className="text-left p-4 text-[#8b949e]">endpoint</th>
                    <th className="text-left p-4 text-[#8b949e]">description</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { method: "GET", endpoint: "/api/v1/registry", desc: "List all active APIs", color: "#3fb950" },
                    { method: "GET", endpoint: "/api/v1/registry/{id}", desc: "Get API by ID", color: "#3fb950" },
                    { method: "POST", endpoint: "/api/v1/route", desc: "Smart routing to best provider", color: "#58a6ff" },
                    { method: "GET", endpoint: "/api/v1/capabilities", desc: "List all capabilities", color: "#3fb950" },
                    { method: "POST", endpoint: "/api/registry/register", desc: "Register new API", color: "#58a6ff" },
                    { method: "GET", endpoint: "/.well-known/agent-card.json", desc: "A2A protocol discovery", color: "#3fb950" },
                    { method: "GET", endpoint: "/skill.md", desc: "Agent skill reference", color: "#3fb950" },
                  ].map((ep, i) => (
                    <tr key={i} className="border-b border-[#30363d] last:border-0 hover:bg-[#0d1117]">
                      <td className="p-4">
                        <span className="px-2 py-1 rounded text-xs" style={{ backgroundColor: ep.color + "20", color: ep.color }}>
                          {ep.method}
                        </span>
                      </td>
                      <td className="p-4 text-[#e6edf3]">{ep.endpoint}</td>
                      <td className="p-4 text-[#8b949e]">{ep.desc}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* Tech Stack */}
        <section className="border-t border-[#30363d] bg-[#161b22]">
          <div className="max-w-5xl mx-auto px-4 py-16">
            <h2 className="text-xl font-mono font-bold mb-8 text-[#ff8c00]">{">"} tech_stack</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { name: "Next.js 16", desc: "App Router + Serverless", icon: "▲" },
                { name: "Supabase", desc: "PostgreSQL + Realtime", icon: "⚡" },
                { name: "Vercel", desc: "Edge + Cron Jobs", icon: "●" },
                { name: "TypeScript", desc: "Type-safe APIs", icon: "TS" },
                { name: "JSON-LD", desc: "Semantic responses", icon: "{}" },
                { name: "A2A Protocol", desc: "Agent discovery", icon: "🤖" },
                { name: "x402", desc: "Micropayments", icon: "💰" },
                { name: "ERC-8004", desc: "On-chain identity", icon: "⛓" },
              ].map((tech) => (
                <div key={tech.name} className="bg-[#0d1117] border border-[#30363d] rounded-lg p-4">
                  <div className="text-2xl mb-2">{tech.icon}</div>
                  <div className="font-mono font-semibold text-sm">{tech.name}</div>
                  <div className="text-xs text-[#8b949e] font-mono">{tech.desc}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Quality Scoring */}
        <section className="border-t border-[#30363d]">
          <div className="max-w-5xl mx-auto px-4 py-16">
            <h2 className="text-xl font-mono font-bold mb-8 text-[#ff8c00]">{">"} quality_scoring</h2>
            <div className="bg-[#161b22] border border-[#30363d] rounded-lg p-6">
              <pre className="text-sm font-mono text-[#e6edf3] overflow-x-auto">
{`// Quality score algorithm (0-5)
const WEIGHTS = {
  uptime:       0.40,  // 40% - Availability
  latency:      0.30,  // 30% - Response speed
  success_rate: 0.30   // 30% - Reliability
};

quality_score = (
  (uptime_percent / 100) * WEIGHTS.uptime +
  (1 - latency_ms / 10000) * WEIGHTS.latency +
  success_rate * WEIGHTS.success_rate
) * 5;

// Health checks run daily
// Higher score = more routing priority`}
              </pre>
            </div>
          </div>
        </section>

        {/* Thesis */}
        <section className="border-t border-[#30363d] bg-[#161b22]">
          <div className="max-w-5xl mx-auto px-4 py-16">
            <div className="border-l-4 border-[#ff8c00] pl-6">
              <p className="text-[#8b949e] font-mono italic text-lg leading-relaxed">
                "User attention is a dying currency. The only durable moats are
                <span className="text-[#ff8c00]"> deep backend liquidity</span> and the
                <span className="text-[#ff8c00]"> efficiency of your logic layer</span>.
                The legacy app becomes a temporary ghost in the network."
              </p>
            </div>
            <div className="mt-8 font-mono">
              <span className="text-[#3fb950]">Value</span> =
              (<span className="text-[#58a6ff]">API_Liquidity</span> ×
              <span className="text-[#ff8c00]">Quality_Score</span>) +
              <span className="text-[#a371f7]">Network_Effects</span>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-[#30363d] py-8">
          <div className="max-w-5xl mx-auto px-4">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-4 font-mono text-sm">
                <span className="text-[#ff8c00] font-bold">agent-gateway</span>
                <span className="text-[#8b949e]">•</span>
                <a href="https://8004scan.io/agents/ethereum/22742" className="text-[#8b949e] hover:text-[#ff8c00]">
                  ERC-8004 #22742
                </a>
                <span className="text-[#8b949e]">•</span>
                <span className="text-[#8b949e]">Built by Rufus</span>
              </div>
              <div className="flex gap-6 font-mono text-sm">
                <Link href="/docs" className="text-[#8b949e] hover:text-[#ff8c00]">docs</Link>
                <a href="https://github.com/exhuman777/agent-gateway" className="text-[#8b949e] hover:text-[#ff8c00]">github</a>
                <Link href="/skill.md" className="text-[#8b949e] hover:text-[#ff8c00]">skill.md</Link>
                <Link href="/.well-known/agent-card.json" className="text-[#8b949e] hover:text-[#ff8c00]">agent-card</Link>
              </div>
            </div>
            <div className="mt-6 text-center text-xs text-[#6e7681] font-mono">
              Contracts of Capability for the Agent Economy
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}
