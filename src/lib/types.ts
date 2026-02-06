// API Registry Types

export interface APIListing {
  id: string;
  name: string;
  description: string;
  endpoint: string;
  category: APICategory;
  capabilities: string[];
  pricing: APIPricing;
  provider: APIProvider;
  metrics: APIMetrics;
  a2aCard?: string;
  status: "active" | "inactive" | "pending";
  createdAt: string;
  updatedAt: string;
}

export type APICategory =
  | "research"
  | "market-data"
  | "image-gen"
  | "code"
  | "translation"
  | "summarization"
  | "embeddings"
  | "web-scraping"
  | "audio"
  | "video"
  | "other";

export interface APIPricing {
  model: "per_request" | "subscription" | "free" | "x402";
  price: number;
  currency: "USD" | "USDC" | "ETH";
  freeQuota?: number; // requests per day
  subscriptionPrice?: number; // if model is subscription
}

export interface APIProvider {
  id: string;
  name: string;
  wallet?: string; // for payments
  erc8004Id?: number;
  verified: boolean;
}

export interface APIMetrics {
  qualityScore: number; // 0-5
  latencyMs: number; // average
  uptimePercent: number; // last 30 days
  totalRequests: number;
  successRate: number; // 0-1
  lastChecked: string;
}

export interface APIRegistration {
  name: string;
  description: string;
  endpoint: string;
  category: APICategory;
  capabilities: string[];
  pricing: APIPricing;
  a2aCard?: string;
  providerWallet?: string;
}

export interface SearchFilters {
  category?: APICategory;
  minQualityScore?: number;
  maxPrice?: number;
  capabilities?: string[];
  sortBy?: "quality" | "price" | "latency" | "popularity";
}

// Quality scoring weights
export const QUALITY_WEIGHTS = {
  uptime: 0.3,
  latency: 0.25,
  successRate: 0.25,
  userRating: 0.2,
};

// Brave Search result
export interface BraveSearchResult {
  title: string;
  url: string;
  description: string;
  age?: string;
  language?: string;
  favicon?: string;
}

// Usage log entry for paid API calls
export interface UsageLogEntry {
  endpoint: string;
  caller_ip: string;
  caller_wallet?: string;
  payment_tx?: string;
  payment_amount?: number;
  query: string;
  latency_ms: number;
  is_free_tier: boolean;
  status: "success" | "error" | "payment_required";
  created_at?: string;
}

// Free tier status
export interface FreeTierStatus {
  allowed: boolean;
  remaining: number;
  limit: number;
  resets_at: string;
}

// x402 payment requirements
export interface X402PaymentRequirements {
  x402_version: string;
  wallet: string;
  network: string;
  asset: string;
  price: string;
  description: string;
}

export function calculateQualityScore(metrics: Partial<APIMetrics>): number {
  const uptime = (metrics.uptimePercent || 0) / 100;
  const latencyScore = Math.max(0, 1 - (metrics.latencyMs || 5000) / 10000);
  const successRate = metrics.successRate || 0;
  const userRating = (metrics.qualityScore || 0) / 5;

  return (
    uptime * QUALITY_WEIGHTS.uptime +
    latencyScore * QUALITY_WEIGHTS.latency +
    successRate * QUALITY_WEIGHTS.successRate +
    userRating * QUALITY_WEIGHTS.userRating
  ) * 5; // Scale to 0-5
}
