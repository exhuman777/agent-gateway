"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";

interface HealthStatus {
  status: string;
  services: {
    ollama: string;
    api: string;
  };
  agent: {
    id: string;
    name: string;
  };
}

export default function Dashboard() {
  const [health, setHealth] = useState<HealthStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [result, setResult] = useState("");
  const [researching, setResearching] = useState(false);

  useEffect(() => {
    fetch("/api/health")
      .then((res) => res.json())
      .then(setHealth)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const runResearch = async () => {
    if (!query.trim()) return;
    setResearching(true);
    setResult("");

    try {
      const res = await fetch("/api/research", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query }),
      });
      const data = await res.json();
      setResult(data.response || data.error || "No response");
    } catch (error) {
      setResult(`Error: ${error instanceof Error ? error.message : "Unknown"}`);
    } finally {
      setResearching(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Nav */}
      <nav className="border-b border-border/40 backdrop-blur-sm fixed top-0 w-full z-50 bg-background/80">
        <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Link href="/" className="text-xl font-mono font-bold">agent.gateway</Link>
            <Badge variant="outline" className="text-xs">dashboard</Badge>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/docs" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Docs
            </Link>
            <Button variant="outline" size="sm">Settings</Button>
          </div>
        </div>
      </nav>

      <main className="pt-14 max-w-6xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Dashboard</h1>

        {/* Status Cards */}
        <div className="grid md:grid-cols-3 gap-4 mb-8">
          <Card className="bg-card/50 border-border/40">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Status</CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <Skeleton className="h-8 w-24" />
              ) : (
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${health?.status === "healthy" ? "bg-green-500" : "bg-yellow-500"}`} />
                  <span className="text-2xl font-bold capitalize">{health?.status || "unknown"}</span>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="bg-card/50 border-border/40">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Ollama</CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <Skeleton className="h-8 w-24" />
              ) : (
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${health?.services.ollama === "up" ? "bg-green-500" : "bg-red-500"}`} />
                  <span className="text-2xl font-bold capitalize">{health?.services.ollama || "unknown"}</span>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="bg-card/50 border-border/40">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Agent</CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <Skeleton className="h-8 w-24" />
              ) : (
                <div className="flex items-center gap-2">
                  <span className="text-2xl font-bold">{health?.agent.name} {health?.agent.id}</span>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Research Interface */}
        <Card className="bg-card/50 border-border/40 mb-8">
          <CardHeader>
            <CardTitle>Research</CardTitle>
            <CardDescription>Query the research API directly</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2 mb-4">
              <Input
                placeholder="Enter your research query..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && runResearch()}
                className="flex-1"
              />
              <Button onClick={runResearch} disabled={researching || !query.trim()}>
                {researching ? "Researching..." : "Research"}
              </Button>
            </div>

            {result && (
              <div className="bg-background rounded-lg border border-border/40 p-4 max-h-96 overflow-y-auto">
                <pre className="whitespace-pre-wrap text-sm font-mono">{result}</pre>
              </div>
            )}
          </CardContent>
        </Card>

        {/* API Endpoints */}
        <Card className="bg-card/50 border-border/40">
          <CardHeader>
            <CardTitle>API Endpoints</CardTitle>
            <CardDescription>Available endpoints for agents and integrations</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-background rounded-lg border border-border/40">
                <div>
                  <code className="text-sm font-mono text-primary">GET /api/health</code>
                  <p className="text-sm text-muted-foreground mt-1">Check service health</p>
                </div>
                <Badge variant="secondary">Public</Badge>
              </div>

              <div className="flex items-center justify-between p-3 bg-background rounded-lg border border-border/40">
                <div>
                  <code className="text-sm font-mono text-primary">POST /api/research</code>
                  <p className="text-sm text-muted-foreground mt-1">Deep research on any topic</p>
                </div>
                <Badge>Auth Required</Badge>
              </div>

              <div className="flex items-center justify-between p-3 bg-background rounded-lg border border-border/40">
                <div>
                  <code className="text-sm font-mono text-primary">POST /api/market-analysis</code>
                  <p className="text-sm text-muted-foreground mt-1">Prediction market intelligence</p>
                </div>
                <Badge>Auth Required</Badge>
              </div>

              <div className="flex items-center justify-between p-3 bg-background rounded-lg border border-border/40">
                <div>
                  <code className="text-sm font-mono text-primary">POST /api/briefing</code>
                  <p className="text-sm text-muted-foreground mt-1">Generate intelligence briefings</p>
                </div>
                <Badge>Auth Required</Badge>
              </div>

              <div className="flex items-center justify-between p-3 bg-background rounded-lg border border-border/40">
                <div>
                  <code className="text-sm font-mono text-primary">GET /.well-known/agent-card.json</code>
                  <p className="text-sm text-muted-foreground mt-1">A2A agent discovery</p>
                </div>
                <Badge variant="secondary">Public</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
