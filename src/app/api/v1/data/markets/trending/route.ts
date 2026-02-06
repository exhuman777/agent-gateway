import { NextRequest, NextResponse } from "next/server";
import { getTrendingMarkets } from "@/lib/polymarket";

export const runtime = "nodejs";

// GET /api/v1/data/markets/trending - Top markets by volume
// Pure data from Supabase. No LLM. No Mac Mini. Always available.
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const limit = Math.min(parseInt(searchParams.get("limit") || "10"), 50);

  const markets = await getTrendingMarkets(limit);

  return NextResponse.json({
    success: true,
    data: {
      markets: markets.map((m, i) => ({
        rank: i + 1,
        id: m.id,
        question: m.question,
        slug: m.slug,
        category: m.category,
        yes_price: m.yes_price,
        no_price: m.no_price,
        yes_percent: `${(m.yes_price * 100).toFixed(1)}%`,
        volume: m.volume,
        liquidity: m.liquidity,
        end_date: m.end_date,
      })),
      count: markets.length,
    },
    meta: {
      source: "Polymarket (cached in Supabase)",
      mac_required: false,
      description: "Top prediction markets by trading volume. Updated every 6 hours.",
      timestamp: new Date().toISOString(),
    },
  });
}
