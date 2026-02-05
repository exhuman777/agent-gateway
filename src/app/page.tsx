import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      {/* Nav */}
      <nav className="border-b border-border/40 backdrop-blur-sm fixed top-0 w-full z-50 bg-background/80">
        <div className="max-w-4xl mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xl font-mono font-bold">apipool</span>
            <Badge variant="outline" className="text-xs">beta</Badge>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/explore" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Explore
            </Link>
            <Link href="/docs" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Docs
            </Link>
            <Link href="/register">
              <Button size="sm">List API</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <main className="pt-14">
        <section className="max-w-4xl mx-auto px-4 py-20">
          <Badge className="mb-4" variant="secondary">Contracts of Capability</Badge>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">
            The API Router for
            <span className="text-muted-foreground block">the Agent Economy</span>
          </h1>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl leading-relaxed">
            APIs evolved from static pipes into programmable contracts.
            Your agent sources the best provider, executes logic, generates interfaces on demand.
            We route to the best endpoint — by quality, price, latency.
          </p>
          <div className="flex gap-3">
            <Link href="/explore">
              <Button size="lg">Browse APIs</Button>
            </Link>
            <Link href="/register">
              <Button size="lg" variant="outline">Register API</Button>
            </Link>
          </div>
        </section>

        {/* How It Works - Simple */}
        <section className="border-t border-border/40">
          <div className="max-w-4xl mx-auto px-4 py-16">
            <h2 className="text-2xl font-bold mb-8">How It Works</h2>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <div className="text-3xl font-mono text-primary">01</div>
                <h3 className="font-semibold">Query Capability</h3>
                <p className="text-sm text-muted-foreground">
                  Agent asks: "I need research capability with max 2s latency"
                </p>
              </div>
              <div className="space-y-2">
                <div className="text-3xl font-mono text-primary">02</div>
                <h3 className="font-semibold">Smart Routing</h3>
                <p className="text-sm text-muted-foreground">
                  Router finds best provider by quality score, price, latency
                </p>
              </div>
              <div className="space-y-2">
                <div className="text-3xl font-mono text-primary">03</div>
                <h3 className="font-semibold">Execute + Pay</h3>
                <p className="text-sm text-muted-foreground">
                  Agent calls endpoint directly. x402 micropayment settles instantly
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* API Example */}
        <section className="border-t border-border/40 bg-card/30">
          <div className="max-w-4xl mx-auto px-4 py-16">
            <h2 className="text-2xl font-bold mb-8">Agent-First API</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="bg-background border-border/40">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">Route Request</CardTitle>
                </CardHeader>
                <CardContent>
                  <pre className="text-xs font-mono text-muted-foreground overflow-x-auto p-3 bg-muted/30 rounded">
{`POST /api/v1/route
{
  "capability": "research",
  "preferences": {
    "max_latency_ms": 2000,
    "max_price": 0.01
  }
}`}
                  </pre>
                </CardContent>
              </Card>
              <Card className="bg-background border-border/40">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">Response</CardTitle>
                </CardHeader>
                <CardContent>
                  <pre className="text-xs font-mono text-muted-foreground overflow-x-auto p-3 bg-muted/30 rounded">
{`{
  "success": true,
  "data": {
    "provider": {
      "name": "Rufus Research",
      "endpoint": "https://...",
      "quality_score": 4.9
    }
  }
}`}
                  </pre>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Featured */}
        <section className="border-t border-border/40">
          <div className="max-w-4xl mx-auto px-4 py-16">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold">Live APIs</h2>
              <Link href="/explore">
                <Button variant="outline" size="sm">View All</Button>
              </Link>
            </div>
            <div className="grid md:grid-cols-3 gap-4">
              {[
                { name: "Rufus Research", cat: "research", score: 4.9, price: 0.001, latency: 2.3 },
                { name: "Polymarket Intel", cat: "market-data", score: 4.8, price: 0.002, latency: 1.1 },
                { name: "Intelligence Briefings", cat: "summarization", score: 4.7, price: 0.003, latency: 3.5 },
              ].map((api) => (
                <Card key={api.name} className="bg-card/50 border-border/40">
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <Badge variant="secondary" className="text-xs">{api.cat}</Badge>
                      <span className="text-sm text-yellow-500">★ {api.score}</span>
                    </div>
                    <CardTitle className="text-base mt-2">{api.name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>${api.price}/req</span>
                      <span>{api.latency}s</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Thesis */}
        <section className="border-t border-border/40 bg-card/30">
          <div className="max-w-4xl mx-auto px-4 py-16">
            <blockquote className="border-l-2 border-primary pl-6 text-muted-foreground italic">
              "User attention is a dying currency. The only durable moats are deep backend liquidity
              and the efficiency of your logic layer. The legacy app becomes a temporary ghost in the network."
            </blockquote>
            <p className="mt-6 text-sm text-muted-foreground">
              <strong className="text-foreground">Value = (API Liquidity × Quality Score) + Network Effects</strong>
            </p>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-border/40 py-6">
          <div className="max-w-4xl mx-auto px-4 flex items-center justify-between text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <span className="font-mono font-bold">apipool</span>
              <span>• Agent #22742</span>
            </div>
            <div className="flex gap-4">
              <Link href="/docs" className="hover:text-foreground transition-colors">Docs</Link>
              <a href="https://8004scan.io/agents/ethereum/22742" className="hover:text-foreground transition-colors">ERC-8004</a>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}
