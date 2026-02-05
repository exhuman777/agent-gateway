import { APIListing, APIRegistration, SearchFilters, calculateQualityScore } from "./types";
import * as db from "./db";

// Seed data - added on first run
const SEED_APIS: APIListing[] = [
  {
    id: "rufus-research",
    name: "Rufus Research",
    description: "Deep research powered by qwen2.5:14b. Comprehensive analysis on any topic.",
    endpoint: "https://rufus.yesno.events/api/research",
    category: "research",
    capabilities: ["research", "analysis", "summarization"],
    pricing: { model: "x402", price: 0.001, currency: "USDC", freeQuota: 10 },
    provider: {
      id: "rufus",
      name: "Rufus",
      wallet: "0x3058ff5B62E67a27460904783aFd670fF70c6A4A",
      erc8004Id: 22742,
      verified: true,
    },
    metrics: {
      qualityScore: 4.9,
      latencyMs: 2300,
      uptimePercent: 99.2,
      totalRequests: 1247,
      successRate: 0.98,
      lastChecked: new Date().toISOString(),
    },
    a2aCard: "https://rufus.yesno.events/.well-known/agent-card.json",
    status: "active",
    createdAt: "2026-02-01T00:00:00Z",
    updatedAt: new Date().toISOString(),
  },
  {
    id: "rufus-market-analysis",
    name: "Polymarket Intel",
    description: "Prediction market analysis and arbitrage opportunities. Real-time market data.",
    endpoint: "https://rufus.yesno.events/api/market-analysis",
    category: "market-data",
    capabilities: ["market-analysis", "prediction-markets", "arbitrage"],
    pricing: { model: "x402", price: 0.002, currency: "USDC", freeQuota: 5 },
    provider: {
      id: "rufus",
      name: "Rufus",
      wallet: "0x3058ff5B62E67a27460904783aFd670fF70c6A4A",
      erc8004Id: 22742,
      verified: true,
    },
    metrics: {
      qualityScore: 4.8,
      latencyMs: 1100,
      uptimePercent: 99.5,
      totalRequests: 892,
      successRate: 0.97,
      lastChecked: new Date().toISOString(),
    },
    a2aCard: "https://rufus.yesno.events/.well-known/agent-card.json",
    status: "active",
    createdAt: "2026-02-01T00:00:00Z",
    updatedAt: new Date().toISOString(),
  },
  {
    id: "rufus-briefing",
    name: "Intelligence Briefings",
    description: "Daily briefings on crypto, prediction markets, and the agent economy.",
    endpoint: "https://rufus.yesno.events/api/briefing",
    category: "summarization",
    capabilities: ["briefing", "summarization", "crypto", "news"],
    pricing: { model: "x402", price: 0.003, currency: "USDC", freeQuota: 3 },
    provider: {
      id: "rufus",
      name: "Rufus",
      wallet: "0x3058ff5B62E67a27460904783aFd670fF70c6A4A",
      erc8004Id: 22742,
      verified: true,
    },
    metrics: {
      qualityScore: 4.7,
      latencyMs: 3500,
      uptimePercent: 99.0,
      totalRequests: 456,
      successRate: 0.96,
      lastChecked: new Date().toISOString(),
    },
    a2aCard: "https://rufus.yesno.events/.well-known/agent-card.json",
    status: "active",
    createdAt: "2026-02-01T00:00:00Z",
    updatedAt: new Date().toISOString(),
  },
];

// Initialize with seed data if empty
function ensureSeedData(): void {
  const existing = db.getAllAPIs();
  if (existing.length === 0) {
    SEED_APIS.forEach(api => db.saveAPI(api));
  }
}

export function getAllAPIs(): APIListing[] {
  ensureSeedData();
  return db.getAllAPIs();
}

export function getAPIById(id: string): APIListing | undefined {
  ensureSeedData();
  return db.getAPIById(id);
}

export function searchAPIs(filters: SearchFilters): APIListing[] {
  let results = getAllAPIs();

  if (filters.category) {
    results = results.filter((api) => api.category === filters.category);
  }

  if (filters.minQualityScore !== undefined) {
    results = results.filter((api) => api.metrics.qualityScore >= filters.minQualityScore!);
  }

  if (filters.maxPrice !== undefined) {
    results = results.filter((api) => api.pricing.price <= filters.maxPrice!);
  }

  if (filters.capabilities?.length) {
    results = results.filter((api) =>
      filters.capabilities!.some((cap) => api.capabilities.includes(cap))
    );
  }

  // Sort
  switch (filters.sortBy) {
    case "quality":
      results.sort((a, b) => b.metrics.qualityScore - a.metrics.qualityScore);
      break;
    case "price":
      results.sort((a, b) => a.pricing.price - b.pricing.price);
      break;
    case "latency":
      results.sort((a, b) => a.metrics.latencyMs - b.metrics.latencyMs);
      break;
    case "popularity":
      results.sort((a, b) => b.metrics.totalRequests - a.metrics.totalRequests);
      break;
    default:
      results.sort((a, b) => b.metrics.qualityScore - a.metrics.qualityScore);
  }

  return results;
}

export function registerAPI(registration: APIRegistration, providerId: string): APIListing {
  const id = `${providerId}-${Date.now()}`;

  const listing: APIListing = {
    id,
    name: registration.name,
    description: registration.description,
    endpoint: registration.endpoint,
    category: registration.category,
    capabilities: registration.capabilities,
    pricing: registration.pricing,
    provider: {
      id: providerId,
      name: providerId,
      wallet: registration.providerWallet,
      verified: false,
    },
    metrics: {
      qualityScore: 0,
      latencyMs: 0,
      uptimePercent: 0,
      totalRequests: 0,
      successRate: 0,
      lastChecked: new Date().toISOString(),
    },
    a2aCard: registration.a2aCard,
    status: "pending",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  db.saveAPI(listing);
  return listing;
}

export function updateAPIMetrics(id: string, metrics: Partial<APIListing["metrics"]>): void {
  const api = db.getAPIById(id);
  if (api) {
    const newMetrics = { ...api.metrics, ...metrics };
    newMetrics.qualityScore = calculateQualityScore(newMetrics);
    db.updateAPIMetrics(id, newMetrics);
  }
}

export function getCategories(): { name: string; count: number }[] {
  const categories = new Map<string, number>();

  getAllAPIs().forEach((api) => {
    categories.set(api.category, (categories.get(api.category) || 0) + 1);
  });

  return Array.from(categories.entries()).map(([name, count]) => ({ name, count }));
}

export function getTopAPIs(limit = 10): APIListing[] {
  return searchAPIs({ sortBy: "quality" }).slice(0, limit);
}

// Route to best provider for a capability
export function routeToProvider(capability: string, preferences?: {
  maxLatencyMs?: number;
  maxPrice?: number;
  minQualityScore?: number;
}): APIListing | null {
  let candidates = getAllAPIs().filter(api =>
    api.capabilities.includes(capability) && api.status === 'active'
  );

  if (preferences?.maxLatencyMs) {
    candidates = candidates.filter(api => api.metrics.latencyMs <= preferences.maxLatencyMs!);
  }

  if (preferences?.maxPrice) {
    candidates = candidates.filter(api => api.pricing.price <= preferences.maxPrice!);
  }

  if (preferences?.minQualityScore) {
    candidates = candidates.filter(api => api.metrics.qualityScore >= preferences.minQualityScore!);
  }

  // Sort by quality score descending
  candidates.sort((a, b) => b.metrics.qualityScore - a.metrics.qualityScore);

  return candidates[0] || null;
}
