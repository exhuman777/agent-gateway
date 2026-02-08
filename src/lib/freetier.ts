// Free tier tracking for APIPOOL paid endpoints
// Uses Supabase to track daily call counts per IP per endpoint
// Falls back to in-memory tracking if Supabase is unavailable

import { supabase } from "./supabase";
import { FreeTierStatus } from "./types";

const DAILY_LIMIT = parseInt(process.env.X402_FREE_DAILY_LIMIT || "10");

// In-memory fallback (for when Supabase is slow/down)
const memoryFallback = new Map<string, { count: number; date: string }>();

function todayUTC(): string {
  return new Date().toISOString().split("T")[0]; // "2026-02-06"
}

/**
 * Check if caller has free tier calls remaining
 */
export async function checkFreeTier(
  ip: string,
  endpoint: string
): Promise<FreeTierStatus> {
  const today = todayUTC();
  const limit = DAILY_LIMIT;

  try {
    const { data, error } = await supabase
      .from("free_tier_usage")
      .select("call_count")
      .eq("caller_ip", ip)
      .eq("endpoint", endpoint)
      .eq("date", today)
      .single();

    if (error && error.code !== "PGRST116") {
      // PGRST116 = no rows found (that's fine, means 0 usage)
      throw error;
    }

    const used = data?.call_count || 0;
    const remaining = Math.max(0, limit - used);

    // Calculate when free tier resets (next midnight UTC)
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
    // Fallback to in-memory
    const key = `${ip}:${endpoint}:${today}`;
    const mem = memoryFallback.get(key);
    const used = mem?.date === today ? mem.count : 0;
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
  }
}

/**
 * Increment the free tier counter for a caller.
 * Uses delete-then-insert because RLS blocks UPDATE on anon role.
 */
export async function incrementFreeTier(
  ip: string,
  endpoint: string
): Promise<void> {
  const today = todayUTC();

  try {
    // Read current count
    const { data: existing } = await supabase
      .from("free_tier_usage")
      .select("call_count")
      .eq("caller_ip", ip)
      .eq("endpoint", endpoint)
      .eq("date", today)
      .single();

    const newCount = (existing?.call_count || 0) + 1;

    // Delete existing row (RLS allows DELETE)
    if (existing) {
      await supabase
        .from("free_tier_usage")
        .delete()
        .eq("caller_ip", ip)
        .eq("endpoint", endpoint)
        .eq("date", today);
    }

    // Insert with incremented count (RLS allows INSERT)
    await supabase.from("free_tier_usage").insert({
      caller_ip: ip,
      endpoint,
      date: today,
      call_count: newCount,
    });
  } catch {
    // Update in-memory fallback
    const key = `${ip}:${endpoint}:${today}`;
    const mem = memoryFallback.get(key);
    if (mem?.date === today) {
      mem.count++;
    } else {
      memoryFallback.set(key, { count: 1, date: today });
    }
  }
}
