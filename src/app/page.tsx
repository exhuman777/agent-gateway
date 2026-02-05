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
            <a href="#why" className="text-sm text-[#8b949e] hover:text-[#ff8c00] transition-colors font-mono">why</a>
            <a href="#how" className="text-sm text-[#8b949e] hover:text-[#ff8c00] transition-colors font-mono">how</a>
            <a href="#api" className="text-sm text-[#8b949e] hover:text-[#ff8c00] transition-colors font-mono">api</a>
            <a href="https://github.com/exhuman777/agent-gateway" className="text-sm text-[#8b949e] hover:text-[#ff8c00] transition-colors font-mono">github</a>
            <Link href="/register">
              <Button size="sm" className="bg-[#ff8c00] hover:bg-[#ff8c00]/80 text-black font-mono">
                + register
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero with ASCII */}
      <main className="pt-14">
        <section className="max-w-5xl mx-auto px-4 py-12 text-center">
          <div className="relative">
            <div className="absolute inset-0 bg-[#ff8c00]/10 blur-3xl rounded-full" />
            <pre className="text-[#ff8c00] text-[0.35rem] sm:text-[0.45rem] md:text-[0.6rem] leading-tight font-mono relative z-10 overflow-x-auto">
              {ASCII_LOGO}
            </pre>
          </div>

          <p className="text-xl text-[#e6edf3] mt-8 mb-3 font-mono">
            The API Router for the Agent Economy
          </p>
          <p className="text-sm text-[#8b949e] mb-8 max-w-2xl mx-auto font-mono leading-relaxed">
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

        {/* WHAT IS THIS */}
        <section id="why" className="border-t border-[#30363d] bg-[#161b22]">
          <div className="max-w-5xl mx-auto px-4 py-16">
            <h2 className="text-2xl font-mono font-bold mb-6 text-[#ff8c00]">{">"} what_is_agent_gateway</h2>

            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <p className="text-[#e6edf3] font-mono leading-relaxed">
                  Agent Gateway is a <span className="text-[#ff8c00]">registry and router</span> for APIs in the agent economy.
                </p>
                <p className="text-[#8b949e] font-mono text-sm leading-relaxed">
                  Instead of hardcoding API endpoints, AI agents query us by <span className="text-[#3fb950]">capability</span>
                  (what they need) and we return the <span className="text-[#58a6ff]">best provider</span> based on quality,
                  latency, and price.
                </p>
                <p className="text-[#8b949e] font-mono text-sm leading-relaxed">
                  Think of it as <span className="text-[#ff8c00]">DNS for agent capabilities</span> — but smarter.
                  We don't just resolve names, we optimize routes.
                </p>
              </div>

              <div className="bg-[#0d1117] border border-[#30363d] rounded-lg p-4">
                <div className="text-xs text-[#8b949e] font-mono mb-2">// The Problem</div>
                <pre className="text-sm font-mono text-[#f85149] mb-4">
{`// Old way: hardcoded, fragile
const RESEARCH_API = "https://some-api.com/v1"
// What if it goes down?
// What if a better one exists?
// What if prices change?`}
                </pre>
                <div className="text-xs text-[#8b949e] font-mono mb-2">// The Solution</div>
                <pre className="text-sm font-mono text-[#3fb950]">
{`// New way: capability-based routing
const provider = await gateway.route({
  capability: "research",
  preferences: { min_quality: 4.0 }
});
// Always gets the best available`}
                </pre>
              </div>
            </div>
          </div>
        </section>

        {/* WHY USE THIS */}
        <section className="border-t border-[#30363d]">
          <div className="max-w-5xl mx-auto px-4 py-16">
            <h2 className="text-2xl font-mono font-bold mb-8 text-[#ff8c00]">{">"} why_use_this</h2>

            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-[#161b22] border border-[#30363d] rounded-lg p-6">
                <div className="text-3xl mb-4">🤖</div>
                <h3 className="font-mono font-bold text-[#e6edf3] mb-2">For Agents</h3>
                <ul className="text-sm text-[#8b949e] font-mono space-y-2">
                  <li>• Find APIs by capability, not name</li>
                  <li>• Auto-route to best provider</li>
                  <li>• Built-in fallback on failures</li>
                  <li>• Quality-scored providers</li>
                  <li>• No hardcoded endpoints</li>
                </ul>
              </div>

              <div className="bg-[#161b22] border border-[#30363d] rounded-lg p-6">
                <div className="text-3xl mb-4">🔧</div>
                <h3 className="font-mono font-bold text-[#e6edf3] mb-2">For API Creators</h3>
                <ul className="text-sm text-[#8b949e] font-mono space-y-2">
                  <li>• Get discovered by agents</li>
                  <li>• Quality score = more traffic</li>
                  <li>• Automated health monitoring</li>
                  <li>• x402 micropayment support</li>
                  <li>• No marketing needed</li>
                </ul>
              </div>

              <div className="bg-[#161b22] border border-[#30363d] rounded-lg p-6">
                <div className="text-3xl mb-4">👨‍💻</div>
                <h3 className="font-mono font-bold text-[#e6edf3] mb-2">For Developers</h3>
                <ul className="text-sm text-[#8b949e] font-mono space-y-2">
                  <li>• MCP server for Claude</li>
                  <li>• Simple REST API</li>
                  <li>• JSON-LD responses</li>
                  <li>• A2A protocol compatible</li>
                  <li>• Open source</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* HOW IT WORKS */}
        <section id="how" className="border-t border-[#30363d] bg-[#161b22]">
          <div className="max-w-5xl mx-auto px-4 py-16">
            <h2 className="text-2xl font-mono font-bold mb-8 text-[#ff8c00]">{">"} how_it_works</h2>

            <div className="grid md:grid-cols-4 gap-4">
              {[
                { num: "01", title: "discover", desc: "Agent queries registry for a capability (e.g., 'research', 'market-data')", color: "#3fb950" },
                { num: "02", title: "route", desc: "Gateway finds best provider based on quality score, latency, price", color: "#58a6ff" },
                { num: "03", title: "execute", desc: "Agent calls provider's endpoint directly with its payload", color: "#ff8c00" },
                { num: "04", title: "pay", desc: "x402 micropayment settles instantly on L2 (optional)", color: "#a371f7" },
              ].map((step) => (
                <div key={step.num} className="bg-[#0d1117] border border-[#30363d] rounded-lg p-5">
                  <div className="text-3xl font-mono font-bold mb-2" style={{ color: step.color }}>{step.num}</div>
                  <h3 className="font-mono font-semibold mb-2 text-[#e6edf3]">{step.title}</h3>
                  <p className="text-xs text-[#8b949e] font-mono leading-relaxed">{step.desc}</p>
                </div>
              ))}
            </div>

            {/* Visual Flow */}
            <div className="mt-8 bg-[#0d1117] border border-[#30363d] rounded-lg p-6">
              <pre className="text-xs font-mono text-center overflow-x-auto">
<span className="text-[#3fb950]">┌─────────┐</span>     <span className="text-[#58a6ff]">┌──────────────┐</span>     <span className="text-[#ff8c00]">┌──────────┐</span>
<span className="text-[#3fb950]">│  AGENT  │</span>────▶<span className="text-[#58a6ff]">│ AGENT GATEWAY │</span>────▶<span className="text-[#ff8c00]">│ PROVIDER │</span>
<span className="text-[#3fb950]">└─────────┘</span>     <span className="text-[#58a6ff]">└──────────────┘</span>     <span className="text-[#ff8c00]">└──────────┘</span>
      <span className="text-[#8b949e]">│</span>                  <span className="text-[#8b949e]">│</span>                   <span className="text-[#8b949e]">│</span>
      <span className="text-[#8b949e]">│</span>    <span className="text-[#6e7681]">"I need research"</span>           <span className="text-[#8b949e]">│</span>
      <span className="text-[#8b949e]">│</span>                  <span className="text-[#8b949e]">│</span>                   <span className="text-[#8b949e]">│</span>
      <span className="text-[#8b949e]">│</span>    <span className="text-[#6e7681]">"Best: Rufus @ 4.9"</span>         <span className="text-[#8b949e]">│</span>
      <span className="text-[#8b949e]">│</span>                  <span className="text-[#8b949e]">│</span>                   <span className="text-[#8b949e]">│</span>
      <span className="text-[#8b949e]">└──────────────────┴───────────────────┘</span>
                   <span className="text-[#6e7681]">Direct API call</span>
              </pre>
            </div>
          </div>
        </section>

        {/* QUICK START */}
        <section className="border-t border-[#30363d]">
          <div className="max-w-5xl mx-auto px-4 py-16">
            <h2 className="text-2xl font-mono font-bold mb-8 text-[#ff8c00]">{">"} quick_start</h2>

            <div className="grid md:grid-cols-2 gap-6">
              {/* Find Provider */}
              <div>
                <h3 className="font-mono font-semibold mb-3 text-[#e6edf3]">1. Find Best Provider</h3>
                <div className="bg-[#0d1117] border border-[#30363d] rounded-lg overflow-hidden">
                  <div className="flex items-center gap-2 px-4 py-2 bg-[#161b22] border-b border-[#30363d]">
                    <div className="w-3 h-3 rounded-full bg-[#f85149]" />
                    <div className="w-3 h-3 rounded-full bg-[#d29922]" />
                    <div className="w-3 h-3 rounded-full bg-[#3fb950]" />
                    <span className="text-xs text-[#8b949e] font-mono ml-2">terminal</span>
                  </div>
                  <pre className="p-4 text-xs font-mono text-[#e6edf3] overflow-x-auto">
{`curl -X POST \\
  https://agent-gateway-zeta.vercel.app/api/v1/route \\
  -H "Content-Type: application/json" \\
  -d '{
    "capability": "research",
    "preferences": {
      "min_quality_score": 4.0
    }
  }'`}
                  </pre>
                </div>
              </div>

              {/* Response */}
              <div>
                <h3 className="font-mono font-semibold mb-3 text-[#e6edf3]">2. Get Best Match</h3>
                <div className="bg-[#0d1117] border border-[#30363d] rounded-lg overflow-hidden">
                  <div className="flex items-center gap-2 px-4 py-2 bg-[#161b22] border-b border-[#30363d]">
                    <div className="w-3 h-3 rounded-full bg-[#f85149]" />
                    <div className="w-3 h-3 rounded-full bg-[#d29922]" />
                    <div className="w-3 h-3 rounded-full bg-[#3fb950]" />
                    <span className="text-xs text-[#8b949e] font-mono ml-2">response.json</span>
                  </div>
                  <pre className="p-4 text-xs font-mono overflow-x-auto">
{`{
  `}<span className="text-[#a5d6ff]">"success"</span>: <span className="text-[#3fb950]">true</span>,
{`  `}<span className="text-[#a5d6ff]">"data"</span>: {`{
    `}<span className="text-[#a5d6ff]">"provider"</span>: {`{
      `}<span className="text-[#a5d6ff]">"name"</span>: <span className="text-[#a5d6ff]">"Rufus Research"</span>,
{`      `}<span className="text-[#a5d6ff]">"endpoint"</span>: <span className="text-[#a5d6ff]">"https://rufus.yesno.events/api/research"</span>,
{`      `}<span className="text-[#a5d6ff]">"quality_score"</span>: <span className="text-[#ff8c00]">4.9</span>
{`    }
  }
}`}
                  </pre>
                </div>
              </div>

              {/* List APIs */}
              <div>
                <h3 className="font-mono font-semibold mb-3 text-[#e6edf3]">3. Browse All APIs</h3>
                <div className="bg-[#0d1117] border border-[#30363d] rounded-lg overflow-hidden">
                  <div className="flex items-center gap-2 px-4 py-2 bg-[#161b22] border-b border-[#30363d]">
                    <div className="w-3 h-3 rounded-full bg-[#f85149]" />
                    <div className="w-3 h-3 rounded-full bg-[#d29922]" />
                    <div className="w-3 h-3 rounded-full bg-[#3fb950]" />
                    <span className="text-xs text-[#8b949e] font-mono ml-2">terminal</span>
                  </div>
                  <pre className="p-4 text-xs font-mono text-[#e6edf3] overflow-x-auto">
{`# List all APIs
curl https://agent-gateway-zeta.vercel.app/api/v1/registry

# Filter by category
curl ".../api/v1/registry?category=research"

# Filter by quality
curl ".../api/v1/registry?minQuality=4.5"`}
                  </pre>
                </div>
              </div>

              {/* Register */}
              <div>
                <h3 className="font-mono font-semibold mb-3 text-[#e6edf3]">4. Register Your API</h3>
                <div className="bg-[#0d1117] border border-[#30363d] rounded-lg overflow-hidden">
                  <div className="flex items-center gap-2 px-4 py-2 bg-[#161b22] border-b border-[#30363d]">
                    <div className="w-3 h-3 rounded-full bg-[#f85149]" />
                    <div className="w-3 h-3 rounded-full bg-[#d29922]" />
                    <div className="w-3 h-3 rounded-full bg-[#3fb950]" />
                    <span className="text-xs text-[#8b949e] font-mono ml-2">terminal</span>
                  </div>
                  <pre className="p-4 text-xs font-mono text-[#e6edf3] overflow-x-auto">
{`curl -X POST .../api/registry/register \\
  -d '{
    "name": "My API",
    "endpoint": "https://my-api.com/v1",
    "category": "research",
    "capabilities": ["research"],
    "pricing": {"model":"free","price":0}
  }'`}
                  </pre>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* API REFERENCE */}
        <section id="api" className="border-t border-[#30363d] bg-[#161b22]">
          <div className="max-w-5xl mx-auto px-4 py-16">
            <h2 className="text-2xl font-mono font-bold mb-8 text-[#ff8c00]">{">"} api_reference</h2>

            <div className="bg-[#0d1117] border border-[#30363d] rounded-lg overflow-hidden">
              <table className="w-full text-sm font-mono">
                <thead>
                  <tr className="border-b border-[#30363d]">
                    <th className="text-left p-4 text-[#8b949e]">method</th>
                    <th className="text-left p-4 text-[#8b949e]">endpoint</th>
                    <th className="text-left p-4 text-[#8b949e]">description</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { method: "POST", endpoint: "/api/v1/route", desc: "Smart routing — find best provider for capability", color: "#58a6ff", primary: true },
                    { method: "GET", endpoint: "/api/v1/registry", desc: "List all APIs with optional filters", color: "#3fb950" },
                    { method: "GET", endpoint: "/api/v1/registry/{id}", desc: "Get single API details by ID", color: "#3fb950" },
                    { method: "GET", endpoint: "/api/v1/capabilities", desc: "List all available capabilities", color: "#3fb950" },
                    { method: "POST", endpoint: "/api/registry/register", desc: "Register your API (pending review)", color: "#58a6ff" },
                    { method: "GET", endpoint: "/api/v1/health-check", desc: "View health status of all APIs", color: "#3fb950" },
                    { method: "GET", endpoint: "/.well-known/agent-card.json", desc: "A2A protocol agent card", color: "#3fb950" },
                    { method: "GET", endpoint: "/skill.md", desc: "Full skill documentation for agents", color: "#3fb950" },
                    { method: "GET", endpoint: "/llms.txt", desc: "AI crawler discovery file", color: "#3fb950" },
                  ].map((ep, i) => (
                    <tr key={i} className={`border-b border-[#30363d] last:border-0 ${ep.primary ? 'bg-[#ff8c00]/5' : 'hover:bg-[#161b22]'}`}>
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

        {/* QUALITY SCORING */}
        <section className="border-t border-[#30363d]">
          <div className="max-w-5xl mx-auto px-4 py-16">
            <h2 className="text-2xl font-mono font-bold mb-8 text-[#ff8c00]">{">"} quality_scoring</h2>

            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <p className="text-[#8b949e] font-mono text-sm mb-4 leading-relaxed">
                  Every API gets a quality score from <span className="text-[#f85149]">0</span> to <span className="text-[#3fb950]">5</span>.
                  Higher score = more routing priority = more traffic.
                </p>
                <p className="text-[#8b949e] font-mono text-sm mb-4 leading-relaxed">
                  Scores are calculated automatically from health checks that run daily.
                </p>

                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-20 text-right font-mono text-sm text-[#8b949e]">40%</div>
                    <div className="flex-1 h-2 bg-[#30363d] rounded-full overflow-hidden">
                      <div className="h-full bg-[#3fb950]" style={{ width: '40%' }} />
                    </div>
                    <div className="w-24 font-mono text-sm text-[#3fb950]">uptime</div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-20 text-right font-mono text-sm text-[#8b949e]">30%</div>
                    <div className="flex-1 h-2 bg-[#30363d] rounded-full overflow-hidden">
                      <div className="h-full bg-[#58a6ff]" style={{ width: '30%' }} />
                    </div>
                    <div className="w-24 font-mono text-sm text-[#58a6ff]">latency</div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-20 text-right font-mono text-sm text-[#8b949e]">30%</div>
                    <div className="flex-1 h-2 bg-[#30363d] rounded-full overflow-hidden">
                      <div className="h-full bg-[#ff8c00]" style={{ width: '30%' }} />
                    </div>
                    <div className="w-24 font-mono text-sm text-[#ff8c00]">success rate</div>
                  </div>
                </div>
              </div>

              <div className="bg-[#0d1117] border border-[#30363d] rounded-lg p-4">
                <pre className="text-xs font-mono text-[#e6edf3] overflow-x-auto">
{`// Quality Score Algorithm
function calculateScore(api) {
  const WEIGHTS = {
    uptime:       0.40,  // availability
    latency:      0.30,  // speed
    success_rate: 0.30   // reliability
  };

  const uptimeScore = api.uptime_percent / 100;
  const latencyScore = Math.max(0, 1 - api.latency_ms/10000);
  const successScore = api.success_rate;

  return (
    uptimeScore * WEIGHTS.uptime +
    latencyScore * WEIGHTS.latency +
    successScore * WEIGHTS.success_rate
  ) * 5;  // Scale to 0-5
}

// Target for high ranking:
// - Uptime: 99%+
// - Latency: <2 seconds
// - Success: 98%+`}
                </pre>
              </div>
            </div>
          </div>
        </section>

        {/* BEST PRACTICES */}
        <section className="border-t border-[#30363d] bg-[#161b22]">
          <div className="max-w-5xl mx-auto px-4 py-16">
            <h2 className="text-2xl font-mono font-bold mb-8 text-[#ff8c00]">{">"} best_practices</h2>

            <div className="grid md:grid-cols-2 gap-6">
              {/* For API Providers */}
              <div className="bg-[#0d1117] border border-[#30363d] rounded-lg p-6">
                <h3 className="font-mono font-bold text-[#3fb950] mb-4">For API Providers</h3>
                <ul className="space-y-3 text-sm font-mono">
                  <li className="flex gap-2">
                    <span className="text-[#3fb950]">✓</span>
                    <span className="text-[#8b949e]">Return JSON with <code className="text-[#e6edf3]">{`{success, data, error}`}</code> format</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-[#3fb950]">✓</span>
                    <span className="text-[#8b949e]">Use HTTPS only</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-[#3fb950]">✓</span>
                    <span className="text-[#8b949e]">Keep latency under 2 seconds</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-[#3fb950]">✓</span>
                    <span className="text-[#8b949e]">Expose <code className="text-[#e6edf3]">/health</code> endpoint</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-[#3fb950]">✓</span>
                    <span className="text-[#8b949e]">Use descriptive capability tags</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-[#3fb950]">✓</span>
                    <span className="text-[#8b949e]">Add A2A agent card at <code className="text-[#e6edf3]">/.well-known/agent-card.json</code></span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-[#f85149]">✗</span>
                    <span className="text-[#8b949e]">Don't return HTML or unstructured text</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-[#f85149]">✗</span>
                    <span className="text-[#8b949e]">Don't require complex authentication for basic calls</span>
                  </li>
                </ul>
              </div>

              {/* For Agents */}
              <div className="bg-[#0d1117] border border-[#30363d] rounded-lg p-6">
                <h3 className="font-mono font-bold text-[#58a6ff] mb-4">For Agents</h3>
                <ul className="space-y-3 text-sm font-mono">
                  <li className="flex gap-2">
                    <span className="text-[#3fb950]">✓</span>
                    <span className="text-[#8b949e]">Query by <span className="text-[#ff8c00]">capability</span>, not by provider name</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-[#3fb950]">✓</span>
                    <span className="text-[#8b949e]">Set <code className="text-[#e6edf3]">min_quality_score</code> preference (recommend 4.0+)</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-[#3fb950]">✓</span>
                    <span className="text-[#8b949e]">Cache routing results for 5-15 minutes</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-[#3fb950]">✓</span>
                    <span className="text-[#8b949e]">Implement fallback to next-best provider</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-[#3fb950]">✓</span>
                    <span className="text-[#8b949e]">Check <code className="text-[#e6edf3]">/skill.md</code> for full documentation</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-[#3fb950]">✓</span>
                    <span className="text-[#8b949e]">Use agent card for A2A protocol discovery</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-[#f85149]">✗</span>
                    <span className="text-[#8b949e]">Don't hardcode provider endpoints</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-[#f85149]">✗</span>
                    <span className="text-[#8b949e]">Don't ignore quality scores</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* CATEGORIES */}
        <section className="border-t border-[#30363d]">
          <div className="max-w-5xl mx-auto px-4 py-16">
            <h2 className="text-2xl font-mono font-bold mb-8 text-[#ff8c00]">{">"} categories</h2>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[
                { name: "research", desc: "Deep analysis", icon: "🔍" },
                { name: "market-data", desc: "Financial data", icon: "📈" },
                { name: "code", desc: "Code gen/review", icon: "💻" },
                { name: "summarization", desc: "Text summary", icon: "📝" },
                { name: "translation", desc: "Languages", icon: "🌐" },
                { name: "embeddings", desc: "Vectors", icon: "🧮" },
                { name: "image-gen", desc: "Image creation", icon: "🎨" },
                { name: "web-scraping", desc: "Data extraction", icon: "🕷️" },
                { name: "audio", desc: "TTS/STT", icon: "🔊" },
                { name: "video", desc: "Video processing", icon: "🎬" },
                { name: "other", desc: "Everything else", icon: "📦" },
              ].map((cat) => (
                <div key={cat.name} className="bg-[#161b22] border border-[#30363d] rounded-lg p-3 text-center">
                  <div className="text-2xl mb-1">{cat.icon}</div>
                  <div className="font-mono text-sm text-[#e6edf3]">{cat.name}</div>
                  <div className="font-mono text-xs text-[#8b949e]">{cat.desc}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* TECH STACK */}
        <section className="border-t border-[#30363d] bg-[#161b22]">
          <div className="max-w-5xl mx-auto px-4 py-16">
            <h2 className="text-2xl font-mono font-bold mb-8 text-[#ff8c00]">{">"} tech_stack</h2>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { name: "Next.js 16", desc: "App Router + Edge", icon: "▲" },
                { name: "Supabase", desc: "PostgreSQL DB", icon: "⚡" },
                { name: "Vercel", desc: "Hosting + Cron", icon: "●" },
                { name: "TypeScript", desc: "Type-safe code", icon: "TS" },
                { name: "JSON-LD", desc: "Semantic API", icon: "{}" },
                { name: "A2A Protocol", desc: "Agent discovery", icon: "🤖" },
                { name: "x402", desc: "Micropayments", icon: "💰" },
                { name: "ERC-8004", desc: "Agent identity", icon: "⛓️" },
              ].map((tech) => (
                <div key={tech.name} className="bg-[#0d1117] border border-[#30363d] rounded-lg p-4">
                  <div className="text-2xl mb-2">{tech.icon}</div>
                  <div className="font-mono font-semibold text-sm text-[#e6edf3]">{tech.name}</div>
                  <div className="text-xs text-[#8b949e] font-mono">{tech.desc}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* THESIS */}
        <section className="border-t border-[#30363d]">
          <div className="max-w-5xl mx-auto px-4 py-16">
            <h2 className="text-2xl font-mono font-bold mb-8 text-[#ff8c00]">{">"} thesis</h2>

            <div className="border-l-4 border-[#ff8c00] pl-6 mb-8">
              <p className="text-[#8b949e] font-mono italic text-lg leading-relaxed">
                "User attention is a dying currency. The only durable moats are
                <span className="text-[#ff8c00]"> deep backend liquidity</span> and the
                <span className="text-[#ff8c00]"> efficiency of your logic layer</span>.
                The legacy app becomes a temporary ghost in the network."
              </p>
            </div>

            <div className="bg-[#161b22] border border-[#30363d] rounded-lg p-6 font-mono">
              <div className="text-lg mb-4">
                <span className="text-[#3fb950]">Value</span>{" = "}
                (<span className="text-[#58a6ff]">API_Liquidity</span> ×
                <span className="text-[#ff8c00]"> Quality_Score</span>) +
                <span className="text-[#a371f7]"> Network_Effects</span>
              </div>
              <p className="text-sm text-[#8b949e]">
                The more high-quality APIs in the registry, the more valuable it becomes for agents.
                The more agents use it, the more valuable it becomes for API providers.
                Flywheel effect.
              </p>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-[#30363d] py-8 bg-[#161b22]">
          <div className="max-w-5xl mx-auto px-4">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-4 font-mono text-sm">
                <span className="text-[#ff8c00] font-bold">agent-gateway</span>
                <span className="text-[#30363d]">|</span>
                <a href="https://8004scan.io/agents/ethereum/22742" className="text-[#8b949e] hover:text-[#ff8c00]">
                  ERC-8004 #22742
                </a>
                <span className="text-[#30363d]">|</span>
                <span className="text-[#8b949e]">Built by Rufus</span>
              </div>
              <div className="flex gap-6 font-mono text-sm">
                <a href="https://github.com/exhuman777/agent-gateway" className="text-[#8b949e] hover:text-[#ff8c00]">github</a>
                <a href="/skill.md" className="text-[#8b949e] hover:text-[#ff8c00]">skill.md</a>
                <a href="/.well-known/agent-card.json" className="text-[#8b949e] hover:text-[#ff8c00]">agent-card</a>
                <a href="/llms.txt" className="text-[#8b949e] hover:text-[#ff8c00]">llms.txt</a>
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
