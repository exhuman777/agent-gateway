import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { recordHealthEvent, detectAnomalies } from "@/lib/intelligence";

export const runtime = "nodejs";

const CONTEXT = "https://apipool.dev/schema/v1";

// Cron secret for Vercel cron jobs
const CRON_SECRET = process.env.CRON_SECRET || "health-check-2024";
const APP_BASE_URL = process.env.NEXT_PUBLIC_APP_URL || "https://agent-gateway-zeta.vercel.app";

/** Resolve endpoint URL — handles relative paths like "/api/v1/search" */
function resolveEndpoint(endpoint: string): string {
  try {
    new URL(endpoint);
    return endpoint; // Already absolute
  } catch {
    // Relative path — prepend our app URL
    return `${APP_BASE_URL}${endpoint.startsWith("/") ? "" : "/"}${endpoint}`;
  }
}

// POST /api/v1/health-check - Run health checks on all active APIs
// This should be called by a cron job (Vercel Cron or external)
export async function POST(request: NextRequest) {
  const authHeader = request.headers.get("authorization");

  // Allow Vercel cron or manual trigger with secret
  if (authHeader !== `Bearer ${CRON_SECRET}`) {
    return NextResponse.json({
      "@context": CONTEXT,
      "@type": "APIError",
      success: false,
      error: { code: "UNAUTHORIZED", message: "Invalid cron secret" },
    }, { status: 401 });
  }

  const { data: apis, error } = await supabase
    .from("api_listings")
    .select("*")
    .eq("status", "active");

  if (error || !apis) {
    return NextResponse.json({
      "@context": CONTEXT,
      "@type": "APIError",
      success: false,
      error: { code: "DATABASE_ERROR", message: error?.message || "No APIs" },
    }, { status: 500 });
  }

  const results = [];

  for (const api of apis) {
    const startTime = Date.now();
    let isUp = false;
    let latency = 0;

    try {
      const url = resolveEndpoint(api.endpoint);
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);

      // Try HEAD first, then GET, then POST (for POST-only endpoints like search)
      let response: Response | undefined;
      try {
        response = await fetch(url, {
          method: "HEAD",
          signal: controller.signal,
        });
        if (response.status === 405) throw new Error("HEAD not allowed");
      } catch {
        try {
          response = await fetch(url, {
            method: "GET",
            signal: controller.signal,
          });
          if (response.status === 405) throw new Error("GET not allowed");
        } catch {
          // POST-only endpoint — send minimal probe
          response = await fetch(url, {
            method: "POST",
            signal: controller.signal,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ query: "health-check", count: 1 }),
          });
        }
      }

      clearTimeout(timeoutId);
      latency = Date.now() - startTime;
      // 402 (payment required) means the endpoint is UP, just needs payment
      isUp = response.ok || response.status === 402 || response.status < 500;
    } catch {
      latency = Date.now() - startTime;
      isUp = false;
    }

    // Calculate new metrics
    const oldMetrics = api.metrics || {};
    const totalRequests = (oldMetrics.totalRequests || 0) + 1;
    const successCount = (oldMetrics.successCount || 0) + (isUp ? 1 : 0);
    const successRate = successCount / totalRequests;

    // Weighted average for latency (favor recent)
    const avgLatency = oldMetrics.latencyMs
      ? Math.round(oldMetrics.latencyMs * 0.7 + latency * 0.3)
      : latency;

    // Uptime based on success rate
    const uptimePercent = Math.round(successRate * 100 * 10) / 10;

    // Quality score: weighted formula
    // 40% uptime + 30% success rate + 30% latency score
    const latencyScore = Math.max(0, 5 - (avgLatency / 1000)); // 5 points if <1s
    const qualityScore = Math.round(
      ((uptimePercent / 20) * 0.4 + // 0-5 scale
      (successRate * 5) * 0.3 +
      latencyScore * 0.3)
    * 10) / 10;

    const newMetrics = {
      qualityScore: Math.min(5, Math.max(0, qualityScore)),
      latencyMs: avgLatency,
      uptimePercent,
      totalRequests,
      successRate: Math.round(successRate * 100) / 100,
      successCount,
      lastChecked: new Date().toISOString(),
    };

    await supabase
      .from("api_listings")
      .update({
        metrics: newMetrics,
        updated_at: new Date().toISOString(),
      })
      .eq("id", api.id);

    // INTELLIGENCE: Record health event for predictive orchestration
    await recordHealthEvent({
      provider_id: api.id,
      is_up: isUp,
      latency_ms: latency,
      quality_score: newMetrics.qualityScore,
      status_code: 0,
    });

    // INTELLIGENCE: Check for anomalies
    const anomalies = await detectAnomalies(api.id);

    results.push({
      id: api.id,
      name: api.name,
      isUp,
      latency,
      newQualityScore: newMetrics.qualityScore,
      anomalies: anomalies.length > 0 ? anomalies : undefined,
    });
  }

  return NextResponse.json({
    "@context": CONTEXT,
    "@type": "HealthCheckResult",
    success: true,
    data: {
      checked: results.length,
      results,
    },
    meta: {
      timestamp: new Date().toISOString(),
    },
  });
}

// GET - Return health check status/info
export async function GET() {
  const { data } = await supabase
    .from("api_listings")
    .select("id, name, metrics, updated_at")
    .eq("status", "active");

  return NextResponse.json({
    "@context": CONTEXT,
    "@type": "HealthCheckInfo",
    success: true,
    data: {
      total_active: data?.length || 0,
      apis: data?.map(api => ({
        id: api.id,
        name: api.name,
        quality_score: api.metrics?.qualityScore || 0,
        last_checked: api.metrics?.lastChecked || api.updated_at,
        uptime_percent: api.metrics?.uptimePercent || 0,
      })) || [],
    },
    meta: {
      description: "POST with Authorization: Bearer <CRON_SECRET> to run health checks",
      timestamp: new Date().toISOString(),
    },
  });
}
