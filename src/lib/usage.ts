// Usage logging for APIPOOL paid endpoints
// Fire-and-forget — never blocks the response

import { supabase } from "./supabase";
import { UsageLogEntry } from "./types";

/**
 * Log an API usage event (non-blocking)
 * Silently catches errors — usage logging should never break the API
 */
export function logUsage(entry: UsageLogEntry): void {
  // Fire and forget — don't await
  supabase
    .from("api_usage")
    .insert({
      endpoint: entry.endpoint,
      caller_ip: entry.caller_ip,
      caller_wallet: entry.caller_wallet || null,
      payment_tx: entry.payment_tx || null,
      payment_amount: entry.payment_amount || null,
      query: entry.query,
      latency_ms: entry.latency_ms,
      is_free_tier: entry.is_free_tier,
      status: entry.status,
      created_at: entry.created_at || new Date().toISOString(),
    })
    .then(({ error }) => {
      if (error) {
        console.error("[usage] Failed to log:", error.message);
      }
    });
}
