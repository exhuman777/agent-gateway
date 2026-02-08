// Free tier tracking for APIPOOL paid endpoints
// Counts successful free-tier requests in api_usage table (already logged by every request)
// No separate counter table needed — single source of truth

import { supabase } from "./supabase";
import { FreeTierStatus } from "./types";

const DAILY_LIMIT = parseInt(process.env.X402_FREE_DAILY_LIMIT || "10");

/**
 * Check if caller has free tier calls remaining.
 * Counts today's successful free-tier rows in api_usage for this IP+endpoint.
 */
export async function checkFreeTier(
  ip: string,
  endpoint: string
): Promise<FreeTierStatus> {
  const limit = DAILY_LIMIT;

  try {
    // Count today's free-tier usage from api_usage (the log we already write)
    const todayStart = new Date();
    todayStart.setUTCHours(0, 0, 0, 0);

    const { count, error } = await supabase
      .from("api_usage")
      .select("*", { count: "exact", head: true })
      .eq("caller_ip", ip)
      .eq("endpoint", endpoint)
      .eq("is_free_tier", true)
      .eq("status", "success")
      .gte("created_at", todayStart.toISOString());

    if (error) throw error;

    const used = count || 0;
    const remaining = Math.max(0, limit - used);

    const tomorrow = new Date();
    tomorrow.setUTCDate(tomorrow.getUTCDate() + 1);
    tomorrow.setUTCHours(0, 0, 0, 0);

    return {
      allowed: remaining > 0,
      remaining,
      limit,
      resets_at: tomorrow.toISOString(),
    };
  } catch {
    // If Supabase is down, allow the request (fail open for availability)
    return {
      allowed: true,
      remaining: limit,
      limit,
      resets_at: new Date(Date.now() + 86400000).toISOString(),
    };
  }
}

/**
 * No-op — increment is handled by logUsage() in the search route.
 * Kept for API compatibility.
 */
export async function incrementFreeTier(
  _ip: string,
  _endpoint: string
): Promise<void> {
  // Usage is already logged by logUsage() in the search handler.
  // checkFreeTier counts those logs directly — no separate counter needed.
}
