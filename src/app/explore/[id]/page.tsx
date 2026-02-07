"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import type { APIListing } from "@/lib/types";

// Map registry IDs to actual working endpoints + docs
const API_DETAILS: Record<
  string,
  {
    endpoint: string;
    method: string;
    tryItFields: { name: string; type: string; placeholder: string; required?: boolean }[];
    exampleRequest: Record<string, unknown>;
    exampleResponse: Record<string, unknown>;
    curlExample: string;
  }
> = {
  "rufus-research": {
    endpoint: "/api/research",
    method: "POST",
    tryItFields: [
      { name: "query", type: "text", placeholder: "prediction markets 2026", required: true },
      { name: "context", type: "text", placeholder: "polymarket legal status (optional)" },
      { name: "count", type: "number", placeholder: "10" },
    ],
    exampleRequest: {
      query: "prediction markets regulation 2026",
      context: "polymarket",
      count: 5,
    },
    exampleResponse: {
      success: true,
      research: {
        query: "prediction markets regulation 2026",
        results: [
          {
            rank: 1,
            title: "Polymarket Surpasses $1B in Volume...",
            url: "https://example.com/article",
            snippet: "The prediction market platform...",
            age: "3 hours ago",
          },
        ],
        total_estimated: 45000,
        sources_summary: [{ domain: "bloomberg.com", count: 2 }],
      },
      metadata: { llm_used: false, source: "Brave Search API" },
    },
    curlExample: `curl -X POST https://agent-gateway-zeta.vercel.app/api/research \\
  -H "Content-Type: application/json" \\
  -d '{"query":"prediction markets 2026","count":5}'`,
  },
  "rufus-briefing": {
    endpoint: "/api/briefing",
    method: "POST",
    tryItFields: [
      { name: "topics", type: "text", placeholder: "crypto, AI, polymarket (comma-separated)" },
      { name: "focus", type: "text", placeholder: "arbitrage opportunities (optional)" },
      { name: "count", type: "number", placeholder: "5" },
    ],
    exampleRequest: {
      topics: ["bitcoin", "polymarket"],
      focus: "price movements",
      count: 3,
    },
    exampleResponse: {
      success: true,
      briefing: {
        date: "Friday, February 7, 2026",
        headlines: [
          {
            topic: "bitcoin",
            articles: [
              {
                title: "Bitcoin Surges Past $70K...",
                url: "https://example.com",
                snippet: "...",
              },
            ],
          },
        ],
        markets: {
          trending: [
            {
              rank: 1,
              question: "Will Bitcoin reach $100K?",
              yes_probability: "23.5%",
              volume: 5000000,
            },
          ],
        },
      },
      metadata: { llm_used: false, sources: ["Brave Search API", "Polymarket"] },
    },
    curlExample: `curl -X POST https://agent-gateway-zeta.vercel.app/api/briefing \\
  -H "Content-Type: application/json" \\
  -d '{"topics":["crypto","AI"],"focus":"latest developments","count":3}'`,
  },
  "polymarket-intel": {
    endpoint: "/api/market-analysis",
    method: "POST",
    tryItFields: [
      { name: "question", type: "text", placeholder: "bitcoin (search markets)" },
      { name: "market", type: "text", placeholder: "561238 (specific market ID, optional)" },
      { name: "timeframe", type: "text", placeholder: "this week (optional)" },
    ],
    exampleRequest: {
      question: "bitcoin",
      timeframe: "this week",
    },
    exampleResponse: {
      success: true,
      analysis: {
        query: "bitcoin",
        matched_markets: [
          {
            question: "Will Bitcoin be above $70K on Feb 14?",
            yes_percent: "62.3%",
            volume: 150000,
            category: "crypto",
          },
        ],
        aggregate: {
          markets_found: 14,
          total_volume: 450000,
          arbitrage_signals: 2,
        },
        news_context: [{ title: "Bitcoin Rally Continues...", url: "https://..." }],
      },
      metadata: { llm_used: false, sources: ["Polymarket", "Brave Search"] },
    },
    curlExample: `curl -X POST https://agent-gateway-zeta.vercel.app/api/market-analysis \\
  -H "Content-Type: application/json" \\
  -d '{"question":"bitcoin","timeframe":"this week"}'`,
  },
  // Alias: registry uses "rufus-market-analysis" as the ID
  "rufus-market-analysis": {
    endpoint: "/api/market-analysis",
    method: "POST",
    tryItFields: [
      { name: "question", type: "text", placeholder: "bitcoin (search markets)" },
      { name: "market", type: "text", placeholder: "561238 (specific market ID, optional)" },
      { name: "timeframe", type: "text", placeholder: "this week (optional)" },
    ],
    exampleRequest: {
      question: "bitcoin",
      timeframe: "this week",
    },
    exampleResponse: {
      success: true,
      analysis: {
        query: "bitcoin",
        matched_markets: [
          {
            question: "Will Bitcoin be above $70K on Feb 14?",
            yes_percent: "62.3%",
            volume: 150000,
            category: "crypto",
          },
        ],
        aggregate: {
          markets_found: 14,
          total_volume: 450000,
          arbitrage_signals: 2,
        },
      },
      metadata: { llm_used: false, sources: ["Polymarket", "Brave Search"] },
    },
    curlExample: `curl -X POST https://agent-gateway-zeta.vercel.app/api/market-analysis \\
  -H "Content-Type: application/json" \\
  -d '{"question":"bitcoin","timeframe":"this week"}'`,
  },
  "rufus-brave-search": {
    endpoint: "/api/v1/search",
    method: "POST",
    tryItFields: [
      { name: "query", type: "text", placeholder: "AI agent frameworks 2026", required: true },
      { name: "count", type: "number", placeholder: "10" },
    ],
    exampleRequest: {
      query: "bitcoin price today",
      count: 5,
    },
    exampleResponse: {
      success: true,
      data: {
        query: "bitcoin price today",
        results: [
          {
            title: "Bitcoin Price | BTC Price Index...",
            url: "https://coinmarketcap.com/currencies/bitcoin/",
            description: "The live Bitcoin price today is...",
          },
        ],
        count: 5,
      },
      meta: {
        source: "Brave Search API",
        is_free_tier: true,
        free_tier: { remaining: 9, limit: 10 },
      },
    },
    curlExample: `curl -X POST https://agent-gateway-zeta.vercel.app/api/v1/search \\
  -H "Content-Type: application/json" \\
  -d '{"query":"bitcoin price today","count":5}'`,
  },
};

// Fallback for any API not in the map (e.g., self-registered)
const DEFAULT_DETAIL = {
  endpoint: "",
  method: "GET",
  tryItFields: [],
  exampleRequest: {},
  exampleResponse: { message: "Contact the API provider for documentation" },
  curlExample: "# No example available for this API",
};

export default function APIDetailPage() {
  const params = useParams();
  const id = params.id as string;

  const [api, setApi] = useState<APIListing | null>(null);
  const [loading, setLoading] = useState(true);
  const [tryItValues, setTryItValues] = useState<Record<string, string>>({});
  const [tryItResult, setTryItResult] = useState<string | null>(null);
  const [tryItLoading, setTryItLoading] = useState(false);

  useEffect(() => {
    const fetchAPI = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/v1/registry/${id}`);
        if (res.ok) {
          const json = await res.json();
          const d = json.data;
          if (d) {
            // Map snake_case API response back to APIListing shape
            setApi({
              id: d.id,
              name: d.name,
              description: d.description,
              endpoint: d.endpoint,
              category: d.category,
              capabilities: d.capabilities || [],
              pricing: {
                model: d.pricing?.model || "per_request",
                price: d.pricing?.price || 0,
                currency: d.pricing?.currency || "USD",
                freeQuota: d.pricing?.free_quota,
              },
              provider: {
                id: d.provider?.id || "",
                name: d.provider?.name || "",
                wallet: d.provider?.wallet,
                erc8004Id: d.provider?.erc8004_id,
                verified: d.provider?.verified || false,
              },
              metrics: {
                qualityScore: d.metrics?.quality_score || 0,
                latencyMs: d.metrics?.latency_ms || 0,
                uptimePercent: d.metrics?.uptime_percent || 0,
                totalRequests: d.metrics?.total_requests || 0,
                successRate: d.metrics?.success_rate || 0,
                lastChecked: d.metrics?.last_checked || "",
              },
              a2aCard: d.a2a_card,
              status: d.status || "active",
              createdAt: d.created_at || "",
              updatedAt: d.updated_at || "",
            });
          }
        }
      } catch {
        // handled by null state
      }
      setLoading(false);
    };
    fetchAPI();
  }, [id]);

  const detail = API_DETAILS[id] || DEFAULT_DETAIL;

  const handleTryIt = async () => {
    if (!detail.endpoint) return;
    setTryItLoading(true);
    setTryItResult(null);

    try {
      const body: Record<string, unknown> = {};
      for (const field of detail.tryItFields) {
        const val = tryItValues[field.name];
        if (!val) continue;
        if (field.type === "number") {
          body[field.name] = parseInt(val, 10);
        } else if (field.name === "topics") {
          body[field.name] = val.split(",").map((s) => s.trim());
        } else {
          body[field.name] = val;
        }
      }

      const res = await fetch(detail.endpoint, {
        method: detail.method,
        headers: { "Content-Type": "application/json" },
        body: detail.method === "POST" ? JSON.stringify(body) : undefined,
      });

      const data = await res.json();
      setTryItResult(JSON.stringify(data, null, 2));
    } catch (err) {
      setTryItResult(
        JSON.stringify({ error: err instanceof Error ? err.message : "Request failed" }, null, 2)
      );
    }

    setTryItLoading(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <nav className="border-b border-border/40 backdrop-blur-sm fixed top-0 w-full z-50 bg-background/80">
          <div className="max-w-4xl mx-auto px-4 h-14 flex items-center gap-2">
            <Link href="/" className="text-xl font-mono font-bold">APIPOOL</Link>
            <span className="text-muted-foreground">/</span>
            <Link href="/explore" className="text-muted-foreground hover:text-foreground">explore</Link>
          </div>
        </nav>
        <main className="pt-14 max-w-4xl mx-auto px-4 py-8">
          <Skeleton className="h-10 w-64 mb-4" />
          <Skeleton className="h-6 w-full mb-8" />
          <Skeleton className="h-40 w-full mb-4" />
          <Skeleton className="h-40 w-full" />
        </main>
      </div>
    );
  }

  if (!api) {
    return (
      <div className="min-h-screen bg-background">
        <nav className="border-b border-border/40 backdrop-blur-sm fixed top-0 w-full z-50 bg-background/80">
          <div className="max-w-4xl mx-auto px-4 h-14 flex items-center gap-2">
            <Link href="/" className="text-xl font-mono font-bold">APIPOOL</Link>
            <span className="text-muted-foreground">/</span>
            <Link href="/explore" className="text-muted-foreground hover:text-foreground">explore</Link>
          </div>
        </nav>
        <main className="pt-14 max-w-4xl mx-auto px-4 py-8 text-center">
          <h1 className="text-2xl font-bold mb-4">API Not Found</h1>
          <p className="text-muted-foreground mb-6">No API with ID &ldquo;{id}&rdquo; was found in the registry.</p>
          <Link href="/explore">
            <Button>Back to Explore</Button>
          </Link>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Nav */}
      <nav className="border-b border-border/40 backdrop-blur-sm fixed top-0 w-full z-50 bg-background/80">
        <div className="max-w-4xl mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Link href="/" className="text-xl font-mono font-bold">APIPOOL</Link>
            <span className="text-muted-foreground">/</span>
            <Link href="/explore" className="text-muted-foreground hover:text-foreground">explore</Link>
            <span className="text-muted-foreground">/</span>
            <span className="font-mono text-sm">{id}</span>
          </div>
          <Link href="/explore">
            <Button variant="outline" size="sm">All APIs</Button>
          </Link>
        </div>
      </nav>

      <main className="pt-14 max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-3xl font-bold">{api.name}</h1>
            <Badge variant="secondary">{api.category}</Badge>
            {api.provider.verified && (
              <Badge variant="outline" className="text-green-500 border-green-500/50">Verified</Badge>
            )}
          </div>
          <p className="text-muted-foreground text-lg mb-4">{api.description}</p>
          <div className="flex flex-wrap gap-4 text-sm">
            <div className="flex items-center gap-1">
              <span className="text-yellow-500">★</span>
              <span className="font-mono">{api.metrics.qualityScore.toFixed(1)}</span>
              <span className="text-muted-foreground">quality</span>
            </div>
            <div>
              <span className="font-mono">${api.pricing.price}</span>
              <span className="text-muted-foreground">/{api.pricing.model === "subscription" ? "mo" : "req"}</span>
            </div>
            <div>
              <span className="font-mono">~{(api.metrics.latencyMs / 1000).toFixed(1)}s</span>
              <span className="text-muted-foreground"> avg</span>
            </div>
            <div>
              <span className="font-mono">{api.metrics.totalRequests.toLocaleString()}</span>
              <span className="text-muted-foreground"> requests</span>
            </div>
          </div>
        </div>

        {/* Capabilities */}
        <div className="flex flex-wrap gap-2 mb-8">
          {api.capabilities.map((cap) => (
            <Badge key={cap} variant="secondary">{cap}</Badge>
          ))}
          {api.provider.erc8004Id && <Badge variant="outline">ERC-8004 #{api.provider.erc8004Id}</Badge>}
          {api.a2aCard && <Badge variant="outline">A2A</Badge>}
        </div>

        {/* Provider Info */}
        <Card className="bg-card/50 border-border/40 mb-6">
          <CardHeader>
            <CardTitle className="text-lg">Provider</CardTitle>
          </CardHeader>
          <CardContent className="text-sm space-y-1">
            <div><span className="text-muted-foreground">Name:</span> {api.provider.name}</div>
            <div><span className="text-muted-foreground">Endpoint:</span> <code className="font-mono text-xs bg-muted px-1 py-0.5 rounded">{api.endpoint}</code></div>
            <div><span className="text-muted-foreground">Uptime:</span> {api.metrics.uptimePercent}%</div>
            <div><span className="text-muted-foreground">Success Rate:</span> {(api.metrics.successRate * 100).toFixed(0)}%</div>
          </CardContent>
        </Card>

        {/* Example Request */}
        {detail.endpoint && (
          <>
            <Card className="bg-card/50 border-border/40 mb-6">
              <CardHeader>
                <CardTitle className="text-lg">Example Request</CardTitle>
              </CardHeader>
              <CardContent>
                <pre className="bg-black/50 rounded-lg p-4 overflow-x-auto text-xs font-mono text-green-400 whitespace-pre-wrap">
                  {detail.curlExample}
                </pre>
              </CardContent>
            </Card>

            {/* Example Response */}
            <Card className="bg-card/50 border-border/40 mb-6">
              <CardHeader>
                <CardTitle className="text-lg">Example Response</CardTitle>
              </CardHeader>
              <CardContent>
                <pre className="bg-black/50 rounded-lg p-4 overflow-x-auto text-xs font-mono text-blue-400 whitespace-pre-wrap">
                  {JSON.stringify(detail.exampleResponse, null, 2)}
                </pre>
              </CardContent>
            </Card>

            {/* Try It */}
            {detail.tryItFields.length > 0 && (
              <Card className="bg-card/50 border-primary/30 mb-6">
                <CardHeader>
                  <CardTitle className="text-lg">Try It Live</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {detail.tryItFields.map((field) => (
                    <div key={field.name}>
                      <label className="text-sm text-muted-foreground block mb-1">
                        {field.name}
                        {field.required && <span className="text-red-500 ml-1">*</span>}
                      </label>
                      <Input
                        type={field.type}
                        placeholder={field.placeholder}
                        value={tryItValues[field.name] || ""}
                        onChange={(e) =>
                          setTryItValues((prev) => ({ ...prev, [field.name]: e.target.value }))
                        }
                      />
                    </div>
                  ))}
                  <Button onClick={handleTryIt} disabled={tryItLoading} className="w-full">
                    {tryItLoading ? "Calling API..." : `${detail.method} ${detail.endpoint}`}
                  </Button>
                  {tryItResult && (
                    <pre className="bg-black/50 rounded-lg p-4 overflow-x-auto text-xs font-mono text-emerald-400 max-h-96 overflow-y-auto whitespace-pre-wrap">
                      {tryItResult}
                    </pre>
                  )}
                </CardContent>
              </Card>
            )}
          </>
        )}

        {/* Pricing Detail */}
        <Card className="bg-card/50 border-border/40 mb-6">
          <CardHeader>
            <CardTitle className="text-lg">Pricing</CardTitle>
          </CardHeader>
          <CardContent className="text-sm space-y-1">
            <div><span className="text-muted-foreground">Model:</span> {api.pricing.model}</div>
            <div><span className="text-muted-foreground">Price:</span> ${api.pricing.price} {api.pricing.currency}</div>
            {api.pricing.freeQuota && (
              <div><span className="text-muted-foreground">Free Tier:</span> {api.pricing.freeQuota} requests/day</div>
            )}
          </CardContent>
        </Card>

        {/* Back */}
        <div className="text-center pt-4">
          <Link href="/explore">
            <Button variant="outline">Back to All APIs</Button>
          </Link>
        </div>
      </main>
    </div>
  );
}
