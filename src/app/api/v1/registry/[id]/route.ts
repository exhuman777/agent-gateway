import { NextRequest, NextResponse } from "next/server";
import { getAPIById } from "@/lib/registry";

export const runtime = "nodejs";

const CONTEXT = "https://apipool.dev/schema/v1";

// GET /api/v1/registry/[id] - Get single API by ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const api = await getAPIById(id);

  if (!api) {
    return NextResponse.json({
      "@context": CONTEXT,
      "@type": "APIError",
      success: false,
      error: {
        code: "NOT_FOUND",
        message: `API with id '${id}' not found`,
      },
    }, { status: 404 });
  }

  return NextResponse.json({
    "@context": CONTEXT,
    "@type": "APIListing",
    success: true,
    data: {
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
        last_checked: api.metrics.lastChecked,
      },
      a2a_card: api.a2aCard,
      status: api.status,
      created_at: api.createdAt,
      updated_at: api.updatedAt,
    },
    meta: {
      timestamp: new Date().toISOString(),
    },
  });
}
