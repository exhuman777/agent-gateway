"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

const CATEGORIES = [
  "research", "market-data", "image-gen", "code", "translation",
  "summarization", "embeddings", "web-scraping", "audio", "video", "other"
];

export default function RegisterPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const [form, setForm] = useState({
    name: "",
    description: "",
    endpoint: "",
    category: "research",
    capabilities: "",
    pricingModel: "x402",
    price: "0.001",
    currency: "USDC",
    freeQuota: "10",
    a2aCard: "",
    providerWallet: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/registry/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          description: form.description,
          endpoint: form.endpoint,
          category: form.category,
          capabilities: form.capabilities.split(",").map((c) => c.trim()).filter(Boolean),
          pricing: {
            model: form.pricingModel,
            price: parseFloat(form.price),
            currency: form.currency,
            freeQuota: parseInt(form.freeQuota) || 0,
          },
          a2aCard: form.a2aCard || undefined,
          providerWallet: form.providerWallet || undefined,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Registration failed");
      }

      setSuccess(true);
      setTimeout(() => router.push("/explore"), 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="max-w-md w-full bg-card/50 border-border/40">
          <CardHeader className="text-center">
            <div className="text-5xl mb-4">✓</div>
            <CardTitle>API Registered!</CardTitle>
            <CardDescription>
              Your API is pending review. Redirecting to explore...
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Nav */}
      <nav className="border-b border-border/40 backdrop-blur-sm fixed top-0 w-full z-50 bg-background/80">
        <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Link href="/" className="text-xl font-mono font-bold">apipool</Link>
            <Badge variant="outline" className="text-xs">register</Badge>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/explore">
              <Button variant="outline" size="sm">Explore APIs</Button>
            </Link>
          </div>
        </div>
      </nav>

      <main className="pt-14 max-w-2xl mx-auto px-4 py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">List Your API</h1>
          <p className="text-muted-foreground">
            Add your API endpoint to the marketplace. Let agents discover and pay for your service.
          </p>
        </div>

        <Card className="bg-card/50 border-border/40">
          <CardHeader>
            <CardTitle>API Details</CardTitle>
            <CardDescription>
              Provide information about your API endpoint
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Basic Info */}
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">API Name *</label>
                  <Input
                    placeholder="My Research API"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    required
                  />
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Description *</label>
                  <Input
                    placeholder="What does your API do?"
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                    required
                  />
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Endpoint URL *</label>
                  <Input
                    placeholder="https://api.example.com/research"
                    value={form.endpoint}
                    onChange={(e) => setForm({ ...form, endpoint: e.target.value })}
                    required
                  />
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Category *</label>
                  <select
                    className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                    required
                  >
                    {CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat.replace("-", " ").replace(/\b\w/g, (c) => c.toUpperCase())}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Capabilities</label>
                  <Input
                    placeholder="research, analysis, summarization (comma-separated)"
                    value={form.capabilities}
                    onChange={(e) => setForm({ ...form, capabilities: e.target.value })}
                  />
                </div>
              </div>

              {/* Pricing */}
              <div className="border-t border-border/40 pt-6">
                <h3 className="font-medium mb-4">Pricing</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Model *</label>
                    <select
                      className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
                      value={form.pricingModel}
                      onChange={(e) => setForm({ ...form, pricingModel: e.target.value })}
                    >
                      <option value="x402">x402 (Pay per request)</option>
                      <option value="per_request">Per Request</option>
                      <option value="subscription">Subscription</option>
                      <option value="free">Free</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">Price *</label>
                    <Input
                      type="number"
                      step="0.0001"
                      placeholder="0.001"
                      value={form.price}
                      onChange={(e) => setForm({ ...form, price: e.target.value })}
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">Currency</label>
                    <select
                      className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
                      value={form.currency}
                      onChange={(e) => setForm({ ...form, currency: e.target.value })}
                    >
                      <option value="USDC">USDC</option>
                      <option value="USD">USD</option>
                      <option value="ETH">ETH</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">Free Quota (req/day)</label>
                    <Input
                      type="number"
                      placeholder="10"
                      value={form.freeQuota}
                      onChange={(e) => setForm({ ...form, freeQuota: e.target.value })}
                    />
                  </div>
                </div>
              </div>

              {/* Integration */}
              <div className="border-t border-border/40 pt-6">
                <h3 className="font-medium mb-4">Integration (Optional)</h3>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">A2A Agent Card URL</label>
                    <Input
                      placeholder="https://api.example.com/.well-known/agent-card.json"
                      value={form.a2aCard}
                      onChange={(e) => setForm({ ...form, a2aCard: e.target.value })}
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Enables A2A protocol discovery
                    </p>
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">Payment Wallet</label>
                    <Input
                      placeholder="0x..."
                      value={form.providerWallet}
                      onChange={(e) => setForm({ ...form, providerWallet: e.target.value })}
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Wallet to receive x402 payments (Base L2)
                    </p>
                  </div>
                </div>
              </div>

              {error && (
                <div className="bg-destructive/10 border border-destructive/50 rounded-md p-3 text-sm text-destructive">
                  {error}
                </div>
              )}

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Registering..." : "Register API"}
              </Button>
            </form>
          </CardContent>
        </Card>

        <p className="text-center text-sm text-muted-foreground mt-6">
          By registering, you agree to our terms of service. APIs are subject to review.
        </p>
      </main>
    </div>
  );
}
