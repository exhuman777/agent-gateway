import { NextRequest, NextResponse } from "next/server";
import { routeToProvider, searchAPIs } from "@/lib/registry";

export const runtime = "nodejs";

const CONTEXT = "https://apipool.dev/schema/v1";

// POST /api/v1/route - Smart routing to best provider
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const { capability, preferences, fallback_count } = body;

    if (!capability) {
      return NextResponse.json({
        "@context": CONTEXT,
        "@type": "APIError",
        success: false,
        error: {
          code: "INVALID_INPUT",
          message: "capability is required",
          field: "capability",
        },
      }, { status: 400 });
    }

    const best = await routeToProvider(capability, {
      maxLatencyMs: preferences?.max_latency_ms,
      maxPrice: preferences?.max_price,
      minQualityScore: preferences?.min_quality_score,
    });

    if (!best) {
      return NextResponse.json({
        "@context": CONTEXT,
        "@type": "APIError",
        success: false,
        error: {
          code: "NO_PROVIDER",
          message: `No provider found for capability '${capability}' matching preferences`,
        },
      }, { status: 404 });
    }

    // Get fallback providers if requested
    let fallbacks: typeof best[] = [];
    if (fallback_count && fallback_count > 0) {
      const all = await searchAPIs({
        capabilities: [capability],
        sortBy: "quality",
      });
      fallbacks = all.filter(api => api.id !== best.id).slice(0, fallback_count);
    }

    return NextResponse.json({
      "@context": CONTEXT,
      "@type": "RouteResponse",
      success: true,
      data: {
        provider: {
          id: best.id,
          name: best.name,
          endpoint: best.endpoint,
          pricing: {
            model: best.pricing.model,
            price: best.pricing.price,
            currency: best.pricing.currency,
          },
          metrics: {
            quality_score: best.metrics.qualityScore,
            latency_ms: best.metrics.latencyMs,
            success_rate: best.metrics.successRate,
          },
          a2a_card: best.a2aCard,
        },
        fallbacks: fallbacks.map(f => ({
          id: f.id,
          name: f.name,
          endpoint: f.endpoint,
          quality_score: f.metrics.qualityScore,
        })),
      },
      meta: {
        capability,
        preferences: preferences || {},
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
        message: error instanceof Error ? error.message : "Routing failed",
      },
    }, { status: 500 });
  }
}

// GET /api/v1/route - Return routing schema
export async function GET() {
  return NextResponse.json({
    "@context": CONTEXT,
    "@type": "RouteSchema",
    endpoint: "/api/v1/route",
    method: "POST",
    description: "Find the best API provider for a given capability",
    schema: {
      capability: {
        type: "string",
        required: true,
        description: "The capability you need (e.g., 'research', 'market-analysis')",
      },
      preferences: {
        type: "object",
        required: false,
        properties: {
          max_latency_ms: { type: "number", description: "Maximum acceptable latency" },
          max_price: { type: "number", description: "Maximum price per request" },
          min_quality_score: { type: "number", description: "Minimum quality score (0-5)" },
        },
      },
      fallback_count: {
        type: "number",
        required: false,
        description: "Number of fallback providers to return",
      },
    },
    example: {
      capability: "research",
      preferences: {
        max_latency_ms: 3000,
        max_price: 0.01,
        min_quality_score: 4.0,
      },
      fallback_count: 2,
    },
  });
}
