import { NextRequest, NextResponse } from "next/server";
import { routeToProvider, searchAPIs } from "@/lib/registry";
import {
  parseNaturalQuery,
  getIntelligentScore,
  recordRoutingEvent,
} from "@/lib/intelligence";

export const runtime = "nodejs";

const CONTEXT = "https://apipool.dev/schema/v1";

// POST /api/v1/route - Intelligent routing to best provider
// Supports both capability strings and natural language queries
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const { capability, query, preferences, fallback_count } = body;

    if (!capability && !query) {
      return NextResponse.json({
        "@context": CONTEXT,
        "@type": "APIError",
        success: false,
        error: {
          code: "INVALID_INPUT",
          message: "Provide 'capability' (exact match) or 'query' (natural language)",
          examples: {
            exact: { capability: "prediction-markets" },
            natural: { query: "I need crypto market price data" },
          },
        },
      }, { status: 400 });
    }

    // PILLAR 4: Contextual Understanding
    // If natural language query provided, parse it into capabilities
    let resolvedCapability = capability;
    let contextualParsing = null;

    if (query && !capability) {
      const parsed = parseNaturalQuery(query);
      resolvedCapability = parsed.suggested_capability;
      contextualParsing = {
        original_query: parsed.original,
        resolved_capability: parsed.suggested_capability,
        all_matches: parsed.capabilities.slice(0, 5),
        confidence: parsed.confidence,
        tokens: parsed.tokens,
      };
    }

    // Find candidates
    const candidates = await searchAPIs({
      capabilities: [resolvedCapability],
      sortBy: "quality",
    });

    // Apply preference filters
    let filtered = candidates;
    if (preferences?.max_latency_ms) {
      filtered = filtered.filter(api => api.metrics.latencyMs <= preferences.max_latency_ms);
    }
    if (preferences?.max_price) {
      filtered = filtered.filter(api => api.pricing.price <= preferences.max_price);
    }
    if (preferences?.min_quality_score) {
      filtered = filtered.filter(api => api.metrics.qualityScore >= preferences.min_quality_score);
    }

    if (filtered.length === 0) {
      return NextResponse.json({
        "@context": CONTEXT,
        "@type": "APIError",
        success: false,
        error: {
          code: "NO_PROVIDER",
          message: `No provider found for capability '${resolvedCapability}' matching preferences`,
          ...(contextualParsing && { contextual_parsing: contextualParsing }),
        },
      }, { status: 404 });
    }

    // PILLARS 1-3: Apply intelligent scoring to all candidates
    const scored = await Promise.all(
      filtered.map(async (api) => {
        const intelligence = await getIntelligentScore(
          api.id,
          api.metrics.qualityScore
        );
        return { api, intelligence };
      })
    );

    // Sort by effective (intelligent) score
    scored.sort((a, b) => b.intelligence.effective_score - a.intelligence.effective_score);

    const best = scored[0];

    // Record the routing decision for self-learning
    await recordRoutingEvent({
      provider_id: best.api.id,
      capability: resolvedCapability,
      chosen: true,
      response_ok: true, // assume ok, agent can report back
      latency_ms: best.api.metrics.latencyMs,
      timestamp: new Date().toISOString(),
    });

    // Get fallbacks
    const fallbacks = scored.slice(1, 1 + (fallback_count || 2));

    return NextResponse.json({
      "@context": CONTEXT,
      "@type": "RouteResponse",
      success: true,
      data: {
        provider: {
          id: best.api.id,
          name: best.api.name,
          endpoint: best.api.endpoint,
          pricing: {
            model: best.api.pricing.model,
            price: best.api.pricing.price,
            currency: best.api.pricing.currency,
          },
          metrics: {
            quality_score: best.api.metrics.qualityScore,
            latency_ms: best.api.metrics.latencyMs,
            success_rate: best.api.metrics.successRate,
          },
          a2a_card: best.api.a2aCard,
        },
        intelligence: {
          effective_score: best.intelligence.effective_score,
          base_score: best.intelligence.base_score,
          learning_multiplier: best.intelligence.learning_multiplier,
          predictive_multiplier: best.intelligence.predictive_multiplier,
          anomaly_multiplier: best.intelligence.anomaly_multiplier,
          data_points: best.intelligence.intelligence.data_points,
          prediction: best.intelligence.intelligence.prediction,
          anomalies: best.intelligence.intelligence.anomalies,
        },
        fallbacks: fallbacks.map(f => ({
          id: f.api.id,
          name: f.api.name,
          endpoint: f.api.endpoint,
          effective_score: f.intelligence.effective_score,
        })),
      },
      meta: {
        capability: resolvedCapability,
        ...(contextualParsing && { contextual_parsing: contextualParsing }),
        preferences: preferences || {},
        intelligence_version: "1.0",
        pillars: [
          "self-learning routing",
          "predictive orchestration",
          "anomaly detection",
          "contextual understanding",
        ],
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
    description: "Intelligent API routing — find best provider using 4-pillar scoring",
    intelligence: {
      version: "1.0",
      pillars: {
        self_learning: "Scores adapt from real routing outcomes — providers that consistently deliver get boosted",
        predictive: "Health trends are analyzed — providers showing degradation are demoted before they fail",
        anomaly_detection: "Latency spikes, error bursts, downtime are detected and penalize scores in real-time",
        contextual: "Natural language queries are parsed into capabilities — no need to know exact capability strings",
      },
      formula: "effective_score = base_quality × learning_multiplier × predictive_multiplier × anomaly_multiplier",
    },
    schema: {
      capability: {
        type: "string",
        required: false,
        description: "Exact capability string (e.g., 'prediction-markets')",
      },
      query: {
        type: "string",
        required: false,
        description: "Natural language query (e.g., 'I need crypto market data')",
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
        default: 2,
        description: "Number of fallback providers to return",
      },
    },
    examples: [
      {
        description: "Exact capability match",
        body: { capability: "prediction-markets" },
      },
      {
        description: "Natural language query",
        body: { query: "I need the latest crypto prediction market prices" },
      },
      {
        description: "With preferences",
        body: {
          capability: "research",
          preferences: { max_latency_ms: 3000, min_quality_score: 4.0 },
          fallback_count: 2,
        },
      },
    ],
  });
}
