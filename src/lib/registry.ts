import { APIListing, APIRegistration, SearchFilters, calculateQualityScore } from "./types";
import * as db from "./db";

export async function getAllAPIs(): Promise<APIListing[]> {
  return db.getAllAPIs();
}

export async function getAPIById(id: string): Promise<APIListing | null> {
  return db.getAPIById(id);
}

export async function searchAPIs(filters: SearchFilters): Promise<APIListing[]> {
  const results = await db.searchAPIs({
    category: filters.category,
    capability: filters.capabilities?.[0],
    minQuality: filters.minQualityScore,
    maxPrice: filters.maxPrice,
  });

  // Additional sorting
  switch (filters.sortBy) {
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
      // Already sorted by quality
      break;
  }

  return results;
}

export async function registerAPI(registration: APIRegistration, providerId: string): Promise<APIListing> {
  const id = `${providerId}-${Date.now()}`;

  const listing: APIListing = {
    id,
    name: registration.name,
    description: registration.description,
    endpoint: registration.endpoint,
    category: registration.category,
    capabilities: registration.capabilities || [],
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

  await db.saveAPI(listing);
  return listing;
}

export async function updateAPIMetrics(id: string, metrics: Partial<APIListing["metrics"]>): Promise<void> {
  await db.updateAPIMetrics(id, metrics);
}

export async function getCategories(): Promise<{ name: string; count: number }[]> {
  return db.getCategories();
}

export async function getTopAPIs(limit = 10): Promise<APIListing[]> {
  const results = await searchAPIs({ sortBy: "quality" });
  return results.slice(0, limit);
}

export async function routeToProvider(capability: string, preferences?: {
  maxLatencyMs?: number;
  maxPrice?: number;
  minQualityScore?: number;
}): Promise<APIListing | null> {
  let candidates = await db.searchAPIs({ capability });

  if (preferences?.maxLatencyMs) {
    candidates = candidates.filter(api => api.metrics.latencyMs <= preferences.maxLatencyMs!);
  }

  if (preferences?.maxPrice) {
    candidates = candidates.filter(api => api.pricing.price <= preferences.maxPrice!);
  }

  if (preferences?.minQualityScore) {
    candidates = candidates.filter(api => api.metrics.qualityScore >= preferences.minQualityScore!);
  }

  // Already sorted by quality from db.searchAPIs
  return candidates[0] || null;
}
