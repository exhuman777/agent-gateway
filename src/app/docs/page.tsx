import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function DocsPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Nav */}
      <nav className="border-b border-border/40 backdrop-blur-sm fixed top-0 w-full z-50 bg-background/80">
        <div className="max-w-4xl mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Link href="/" className="text-xl font-mono font-bold">apipool</Link>
            <Badge variant="outline" className="text-xs">docs</Badge>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/explore" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Explore
            </Link>
            <Link href="/register">
              <Button size="sm">List API</Button>
            </Link>
          </div>
        </div>
      </nav>

      <main className="pt-14 max-w-4xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold mb-2">API Documentation</h1>
        <p className="text-muted-foreground mb-8">Agent-first API for the agent economy</p>

        {/* Quick Start */}
        <section className="mb-12">
          <h2 className="text-xl font-bold mb-4">Quick Start</h2>
          <Card className="bg-card/50">
            <CardContent className="pt-6">
              <pre className="text-sm font-mono text-muted-foreground overflow-x-auto">
{`# Find best provider for a capability
curl -X POST https://apipool.dev/api/v1/route \\
  -H "Content-Type: application/json" \\
  -d '{"capability": "research"}'

# List all APIs
curl https://apipool.dev/api/v1/registry

# Get single API
curl https://apipool.dev/api/v1/registry/rufus-research`}
              </pre>
            </CardContent>
          </Card>
        </section>

        {/* Endpoints */}
        <section className="mb-12">
          <h2 className="text-xl font-bold mb-4">Endpoints</h2>
          <div className="space-y-4">
            <Card className="bg-card/50">
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-mono">
                  <Badge className="mr-2">POST</Badge>
                  /api/v1/route
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Find the best API provider for a capability. Returns provider with highest quality score matching your preferences.
                </p>
                <h4 className="font-semibold text-sm mb-2">Request Body</h4>
                <pre className="text-xs font-mono bg-muted/30 p-3 rounded overflow-x-auto">
{`{
  "capability": "research",      // required
  "preferences": {               // optional
    "max_latency_ms": 2000,
    "max_price": 0.01,
    "min_quality_score": 4.0
  },
  "fallback_count": 2            // optional
}`}
                </pre>
              </CardContent>
            </Card>

            <Card className="bg-card/50">
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-mono">
                  <Badge variant="secondary" className="mr-2">GET</Badge>
                  /api/v1/registry
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  List and search all registered APIs.
                </p>
                <h4 className="font-semibold text-sm mb-2">Query Parameters</h4>
                <pre className="text-xs font-mono bg-muted/30 p-3 rounded overflow-x-auto">
{`?capability=research     # filter by capability
?category=market-data    # filter by category
?min_quality=4.0         # minimum quality score
?max_price=0.01          # maximum price
?max_latency=2000        # maximum latency (ms)
?sort=quality            # sort: quality|price|latency|popularity
?limit=10                # limit results`}
                </pre>
              </CardContent>
            </Card>

            <Card className="bg-card/50">
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-mono">
                  <Badge variant="secondary" className="mr-2">GET</Badge>
                  /api/v1/registry/:id
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Get detailed information about a specific API by ID.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-card/50">
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-mono">
                  <Badge className="mr-2">POST</Badge>
                  /api/v1/registry
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Register a new API in the marketplace.
                </p>
                <pre className="text-xs font-mono bg-muted/30 p-3 rounded overflow-x-auto">
{`{
  "name": "My Research API",
  "description": "Deep research on any topic",
  "endpoint": "https://api.example.com/research",
  "category": "research",
  "capabilities": ["research", "analysis"],
  "pricing": {
    "model": "x402",
    "price": 0.001,
    "currency": "USDC"
  },
  "a2aCard": "https://api.example.com/.well-known/agent-card.json",
  "providerWallet": "0x..."
}`}
                </pre>
              </CardContent>
            </Card>

            <Card className="bg-card/50">
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-mono">
                  <Badge variant="secondary" className="mr-2">GET</Badge>
                  /api/v1/capabilities
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  List all available capabilities with provider counts.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Response Format */}
        <section className="mb-12">
          <h2 className="text-xl font-bold mb-4">Response Format</h2>
          <p className="text-sm text-muted-foreground mb-4">
            All responses are JSON-LD compatible with consistent structure:
          </p>
          <Card className="bg-card/50">
            <CardContent className="pt-6">
              <pre className="text-xs font-mono text-muted-foreground overflow-x-auto">
{`{
  "@context": "https://apipool.dev/schema/v1",
  "@type": "APIResponse",
  "success": true,
  "data": { ... },
  "meta": {
    "timestamp": "2026-02-05T10:00:00Z"
  }
}

// Error format
{
  "@context": "https://apipool.dev/schema/v1",
  "@type": "APIError",
  "success": false,
  "error": {
    "code": "NOT_FOUND",
    "message": "API not found"
  }
}`}
              </pre>
            </CardContent>
          </Card>
        </section>

        {/* Categories */}
        <section className="mb-12">
          <h2 className="text-xl font-bold mb-4">Categories</h2>
          <div className="flex flex-wrap gap-2">
            {["research", "market-data", "image-gen", "code", "translation", "summarization", "embeddings", "web-scraping", "audio", "video", "other"].map(cat => (
              <Badge key={cat} variant="outline">{cat}</Badge>
            ))}
          </div>
        </section>

        {/* Pricing Models */}
        <section className="mb-12">
          <h2 className="text-xl font-bold mb-4">Pricing Models</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <Card className="bg-card/50">
              <CardHeader className="pb-2">
                <CardTitle className="text-base">x402 (Recommended)</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Pay-per-request via HTTP 402. Instant L2 micropayments. No accounts needed.
                </p>
              </CardContent>
            </Card>
            <Card className="bg-card/50">
              <CardHeader className="pb-2">
                <CardTitle className="text-base">per_request</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Traditional per-request billing. Requires account setup.
                </p>
              </CardContent>
            </Card>
            <Card className="bg-card/50">
              <CardHeader className="pb-2">
                <CardTitle className="text-base">subscription</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Monthly fee for unlimited access. Best for high-volume consumers.
                </p>
              </CardContent>
            </Card>
            <Card className="bg-card/50">
              <CardHeader className="pb-2">
                <CardTitle className="text-base">free</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Free tier with daily limits. Good for testing and discovery.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-border/40 pt-6 mt-12">
          <p className="text-sm text-muted-foreground">
            Full methodology and best practices: <Link href="/METHODOLOGY.md" className="text-primary hover:underline">METHODOLOGY.md</Link>
          </p>
        </footer>
      </main>
    </div>
  );
}
