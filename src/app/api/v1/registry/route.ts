import { NextRequest, NextResponse } from "next/server";
import { searchAPIs, getCategories, getAllAPIs, registerAPI } from "@/lib/registry";
import type { APICategory, APIRegistration } from "@/lib/types";

export const runtime = "nodejs";

const CONTEXT = "https://apipool.dev/schema/v1";

// GET /api/v1/registry - Agent-friendly registry
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);

  const category = searchParams.get("category") as APICategory | null;
  const capability = searchParams.get("capability");
  const minQuality = searchParams.get("min_quality");
  const maxPrice = searchParams.get("max_price");
  const maxLatency = searchParams.get("max_latency");
  const sortBy = searchParams.get("sort") as "quality" | "price" | "latency" | "popularity" | null;
  const limit = searchParams.get("limit");

  const filters = {
    category: category || undefined,
    minQualityScore: minQuality ? parseFloat(minQuality) : undefined,
    maxPrice: maxPrice ? parseFloat(maxPrice) : undefined,
    capabilities: capability ? [capability] : undefined,
    sortBy: sortBy || "quality",
  };

  let apis = searchAPIs(filters);

  // Filter by latency if specified
  if (maxLatency) {
    const maxMs = parseInt(maxLatency);
    apis = apis.filter(api => api.metrics.latencyMs <= maxMs);
  }

  // Limit results
  if (limit) {
    apis = apis.slice(0, parseInt(limit));
  }

  return NextResponse.json({
    "@context": CONTEXT,
    "@type": "APIRegistryResponse",
    success: true,
    data: {
      apis: apis.map(api => ({
        "@type": "APIListing",
        id: api.id,
        name: api.name,
        description: api.description,
        endpoint: api.endpoint,
        category: api.category,
        capabilities: api.capabilities,
        pricing: {
          model: api.pricing.model,
          price: api.pricing.price,
          currency: api.pricing.currency,
          free_quota: api.pricing.freeQuota,
        },
        provider: {
          id: api.provider.id,
          name: api.provider.name,
          wallet: api.provider.wallet,
          erc8004_id: api.provider.erc8004Id,
          verified: api.provider.verified,
        },
        metrics: {
          quality_score: api.metrics.qualityScore,
          latency_ms: api.metrics.latencyMs,
          uptime_percent: api.metrics.uptimePercent,
          total_requests: api.metrics.totalRequests,
          success_rate: api.metrics.successRate,
        },
        a2a_card: api.a2aCard,
        status: api.status,
      })),
      total: apis.length,
      categories: getCategories(),
    },
    meta: {
      version: "1.0.0",
      timestamp: new Date().toISOString(),
    },
  });
}

// POST /api/v1/registry - Register new API
export async function POST(request: NextRequest) {
  try {
    const body: APIRegistration = await request.json();

    if (!body.name || !body.endpoint || !body.category) {
      return NextResponse.json({
        "@context": CONTEXT,
        "@type": "APIError",
        success: false,
        error: {
          code: "INVALID_INPUT",
          message: "Missing required fields: name, endpoint, category",
          fields: ["name", "endpoint", "category"].filter(f => !body[f as keyof APIRegistration]),
        },
      }, { status: 400 });
    }

    try {
      new URL(body.endpoint);
    } catch {
      return NextResponse.json({
        "@context": CONTEXT,
        "@type": "APIError",
        success: false,
        error: {
          code: "INVALID_ENDPOINT",
          message: "Invalid endpoint URL",
          field: "endpoint",
        },
      }, { status: 400 });
    }

    if (!body.pricing || body.pricing.price === undefined) {
      return NextResponse.json({
        "@context": CONTEXT,
        "@type": "APIError",
        success: false,
        error: {
          code: "INVALID_INPUT",
          message: "Pricing information required",
          field: "pricing",
        },
      }, { status: 400 });
    }

    const providerId = body.providerWallet
      ? body.providerWallet.slice(0, 10)
      : `anon-${Date.now()}`;

    const listing = registerAPI(body, providerId);

    return NextResponse.json({
      "@context": CONTEXT,
      "@type": "APIRegistrationResponse",
      success: true,
      data: {
        id: listing.id,
        status: listing.status,
        endpoint: listing.endpoint,
      },
      meta: {
        message: "API registered. Status: pending health check.",
        timestamp: new Date().toISOString(),
      },
    });
  } catch (error) {
    return NextResponse.json({
      "@context": CONTEXT,
      "@type": "APIError",
      success: false,
      error: {
        code: "INTERNAL_ERROR",
        message: error instanceof Error ? error.message : "Registration failed",
      },
    }, { status: 500 });
  }
}
