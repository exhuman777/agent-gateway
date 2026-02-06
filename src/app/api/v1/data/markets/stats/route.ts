import { NextResponse } from "next/server";
import { getStats } from "@/lib/polymarket";

export const runtime = "nodejs";

// GET /api/v1/data/markets/stats - Summary stats
// Quick overview for agents to understand what data is available
export async function GET() {
  const stats = await getStats();

  return NextResponse.json({
    success: true,
    data: {
      total_markets: stats.total_markets,
      active_markets: stats.active_markets,
      total_volume_usd: stats.total_volume,
      categories: stats.categories,
      last_sync: stats.last_sync,
      sync_frequency: "Every 6 hours",
    },
    meta: {
      source: "Polymarket (cached in Supabase)",
      mac_required: false,
      endpoints: {
        list: "/api/v1/data/markets",
        trending: "/api/v1/data/markets/trending",
        search: "/api/v1/data/markets/search?q=",
        detail: "/api/v1/data/markets/{slug}",
        stats: "/api/v1/data/markets/stats",
      },
      timestamp: new Date().toISOString(),
    },
  });
}
