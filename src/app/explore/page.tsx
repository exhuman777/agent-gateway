"use client";

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import type { APIListing } from "@/lib/types";

const CATEGORIES = [
  { id: "all", name: "All", icon: "📦" },
  { id: "research", name: "Research", icon: "🔬" },
  { id: "market-data", name: "Market Data", icon: "📊" },
  { id: "image-gen", name: "Image Gen", icon: "🎨" },
  { id: "code", name: "Code", icon: "💻" },
  { id: "translation", name: "Translation", icon: "🌍" },
  { id: "summarization", name: "Summarization", icon: "📝" },
  { id: "embeddings", name: "Embeddings", icon: "🧮" },
  { id: "web-scraping", name: "Web Scraping", icon: "🕸️" },
];

const SORT_OPTIONS = [
  { id: "quality", name: "Quality Score" },
  { id: "price", name: "Lowest Price" },
  { id: "latency", name: "Fastest" },
  { id: "popularity", name: "Most Popular" },
];

function ExploreContent() {
  const searchParams = useSearchParams();
  const [apis, setApis] = useState<APIListing[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState(searchParams.get("category") || "all");
  const [sortBy, setSortBy] = useState("quality");

  useEffect(() => {
    const fetchAPIs = async () => {
      setLoading(true);
      const params = new URLSearchParams();
      if (category !== "all") params.set("category", category);
      params.set("sortBy", sortBy);

      const res = await fetch(`/api/registry?${params}`);
      const data = await res.json();
      setApis(data.apis || []);
      setLoading(false);
    };

    fetchAPIs();
  }, [category, sortBy]);

  const filteredApis = search
    ? apis.filter(
        (api) =>
          api.name.toLowerCase().includes(search.toLowerCase()) ||
          api.description.toLowerCase().includes(search.toLowerCase()) ||
          api.capabilities.some((c) => c.toLowerCase().includes(search.toLowerCase()))
      )
    : apis;

  return (
    <main className="pt-14 max-w-6xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Explore APIs</h1>
        <p className="text-muted-foreground">
          Discover APIs for your agents. Filter by capability, price, and quality.
        </p>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <Input
          placeholder="Search APIs..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="md:w-80"
        />
        <div className="flex gap-2 overflow-x-auto pb-2">
          {CATEGORIES.map((cat) => (
            <Button
              key={cat.id}
              variant={category === cat.id ? "default" : "outline"}
              size="sm"
              onClick={() => setCategory(cat.id)}
              className="whitespace-nowrap"
            >
              {cat.icon} {cat.name}
            </Button>
          ))}
        </div>
      </div>

      {/* Sort */}
      <div className="flex items-center gap-2 mb-6">
        <span className="text-sm text-muted-foreground">Sort by:</span>
        {SORT_OPTIONS.map((opt) => (
          <Button
            key={opt.id}
            variant={sortBy === opt.id ? "secondary" : "ghost"}
            size="sm"
            onClick={() => setSortBy(opt.id)}
          >
            {opt.name}
          </Button>
        ))}
      </div>

      {/* Results */}
      {loading ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="bg-card/50 border-border/40">
              <CardHeader>
                <Skeleton className="h-6 w-20 mb-2" />
                <Skeleton className="h-6 w-40" />
                <Skeleton className="h-4 w-full mt-2" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-4 w-32" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : filteredApis.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground mb-4">No APIs found matching your criteria.</p>
          <Link href="/register">
            <Button>Be the first to list one</Button>
          </Link>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredApis.map((api) => (
            <Link key={api.id} href={`/api/${api.id}`}>
              <Card className="bg-card/50 border-border/40 hover:border-primary/50 transition-colors cursor-pointer h-full">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <Badge variant="secondary">{api.category}</Badge>
                    <div className="flex items-center gap-1 text-sm">
                      <span className="text-yellow-500">★</span>
                      <span>{api.metrics.qualityScore.toFixed(1)}</span>
                    </div>
                  </div>
                  <CardTitle className="mt-2">{api.name}</CardTitle>
                  <CardDescription className="line-clamp-2">{api.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between text-sm mb-3">
                    <span className="text-muted-foreground">
                      ${api.pricing.price}/{api.pricing.model === "subscription" ? "mo" : "req"}
                    </span>
                    <span className="text-muted-foreground">
                      ~{(api.metrics.latencyMs / 1000).toFixed(1)}s
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {api.provider.verified && (
                      <Badge variant="outline" className="text-xs text-green-500 border-green-500/50">
                        Verified
                      </Badge>
                    )}
                    {api.provider.erc8004Id && (
                      <Badge variant="outline" className="text-xs">ERC-8004</Badge>
                    )}
                    {api.a2aCard && (
                      <Badge variant="outline" className="text-xs">A2A</Badge>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {api.capabilities.slice(0, 3).map((cap) => (
                      <Badge key={cap} variant="secondary" className="text-xs">
                        {cap}
                      </Badge>
                    ))}
                    {api.capabilities.length > 3 && (
                      <Badge variant="secondary" className="text-xs">
                        +{api.capabilities.length - 3}
                      </Badge>
                    )}
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}

      {/* Stats */}
      <div className="mt-12 text-center text-sm text-muted-foreground">
        {filteredApis.length} APIs available • Updated {new Date().toLocaleDateString()}
      </div>
    </main>
  );
}

function LoadingFallback() {
  return (
    <main className="pt-14 max-w-6xl mx-auto px-4 py-8">
      <div className="mb-8">
        <Skeleton className="h-10 w-48 mb-2" />
        <Skeleton className="h-6 w-96" />
      </div>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <Card key={i} className="bg-card/50 border-border/40">
            <CardHeader>
              <Skeleton className="h-6 w-20 mb-2" />
              <Skeleton className="h-6 w-40" />
              <Skeleton className="h-4 w-full mt-2" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-4 w-32" />
            </CardContent>
          </Card>
        ))}
      </div>
    </main>
  );
}

export default function ExplorePage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Nav */}
      <nav className="border-b border-border/40 backdrop-blur-sm fixed top-0 w-full z-50 bg-background/80">
        <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Link href="/" className="text-xl font-mono font-bold">aipool</Link>
            <Badge variant="outline" className="text-xs">explore</Badge>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/register">
              <Button variant="outline" size="sm">List Your API</Button>
            </Link>
            <Link href="/dashboard">
              <Button size="sm">Dashboard</Button>
            </Link>
          </div>
        </div>
      </nav>

      <Suspense fallback={<LoadingFallback />}>
        <ExploreContent />
      </Suspense>
    </div>
  );
}
