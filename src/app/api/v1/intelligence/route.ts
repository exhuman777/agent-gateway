import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { parseNaturalQuery, predictProviderHealth, detectAnomalies } from "@/lib/intelligence";

export const runtime = "nodejs";

const CONTEXT = "https://apipool.dev/schema/v1";

// GET /api/v1/intelligence — Overview of the intelligence system
export async function GET() {
  // Count data points
  const { count: routingCount } = await supabase
    .from('routing_events')
    .select('*', { count: 'exact', head: true });

  const { count: healthCount } = await supabase
    .from('health_events')
    .select('*', { count: 'exact', head: true });

  const { count: anomalyCount } = await supabase
    .from('anomaly_log')
    .select('*', { count: 'exact', head: true });

  // Get all active providers and their intelligence status
  const { data: apis } = await supabase
    .from('api_listings')
    .select('id, name')
    .eq('status', 'active');

  const providerStatus = [];
  for (const api of (apis || []).slice(0, 10)) {
    const trend = await predictProviderHealth(api.id);
    const anomalies = await detectAnomalies(api.id);
    providerStatus.push({
      id: api.id,
      name: api.name,
      prediction: trend.prediction,
      confidence: trend.confidence,
      latency_trend: trend.latency_trend,
      success_trend: trend.success_trend,
      active_anomalies: anomalies.length,
      anomaly_types: anomalies.map(a => a.type),
    });
  }

  return NextResponse.json({
    "@context": CONTEXT,
    "@type": "IntelligenceStatus",
    success: true,
    data: {
      version: "1.0",
      pillars: {
        self_learning: {
          status: "active",
          description: "Scores adapt from real routing outcomes",
          formula: "multiplier = 0.8-1.2 based on 50 most recent routing events per provider",
          data_points: routingCount || 0,
        },
        predictive_orchestration: {
          status: "active",
          description: "Health trends analyzed — providers demoted before failure",
          formula: "compares last 3 checks vs baseline, predicts healthy/at_risk/failing",
          data_points: healthCount || 0,
        },
        anomaly_detection: {
          status: "active",
          description: "Latency spikes, error bursts, downtime detected in real-time",
          formula: "recent avg > 2x baseline = latency_spike, 2+ failures in 3 checks = error_burst",
          anomalies_logged: anomalyCount || 0,
        },
        contextual_understanding: {
          status: "active",
          description: "Natural language queries parsed into capabilities without LLM",
          capabilities_mapped: 9,
          example: "query: 'crypto market prices' → capability: 'market-data'",
        },
      },
      master_formula: "effective_score = base_quality × learning_multiplier × predictive_multiplier × anomaly_multiplier",
      providers: providerStatus,
    },
    meta: {
      timestamp: new Date().toISOString(),
    },
  });
}

// POST /api/v1/intelligence — Test contextual understanding
// Send a natural language query, get back parsed capabilities
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { query } = body;

    if (!query) {
      return NextResponse.json({
        "@context": CONTEXT,
        "@type": "APIError",
        success: false,
        error: { code: "MISSING_QUERY", message: "Provide a 'query' string to parse" },
      }, { status: 400 });
    }

    const parsed = parseNaturalQuery(query);

    return NextResponse.json({
      "@context": CONTEXT,
      "@type": "ContextualParsing",
      success: true,
      data: {
        original_query: parsed.original,
        suggested_capability: parsed.suggested_capability,
        all_capabilities: parsed.capabilities,
        confidence: parsed.confidence,
        tokens: parsed.tokens,
        usage: "Use the suggested_capability with POST /api/v1/route to find a provider",
      },
      meta: {
        pillar: "contextual understanding",
        method: "keyword extraction + capability mapping (no LLM)",
        timestamp: new Date().toISOString(),
      },
    });
  } catch {
    return NextResponse.json({
      "@context": CONTEXT,
      "@type": "APIError",
      success: false,
      error: { code: "PARSE_ERROR", message: "Invalid request body" },
    }, { status: 400 });
  }
}
