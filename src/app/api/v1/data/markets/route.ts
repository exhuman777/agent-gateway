import { NextRequest, NextResponse } from "next/server";
import { getMarkets } from "@/lib/polymarket";

export const runtime = "nodejs";

// GET /api/v1/data/markets - List all tracked markets
// Pure data endpoint. No LLM. No Mac Mini. Always available.
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);

  const category = searchParams.get("category") || undefined;
  const active = searchParams.get("active");
  const limit = parseInt(searchParams.get("limit") || "50");
  const sortBy = (searchParams.get("sort") || "volume") as "volume" | "liquidity" | "yes_price" | "last_updated";

  const markets = await getMarkets({
    category,
    active: active === "true" ? true : active === "false" ? false : undefined,
    limit: Math.min(limit, 100),
    sortBy,
  });

  return NextResponse.json({
    success: true,
    data: {
      markets: markets.map(m => ({
        id: m.id,
        question: m.question,
        slug: m.slug,
        category: m.category,
        yes_price: m.yes_price,
        no_price: m.no_price,
        volume: m.volume,
        liquidity: m.liquidity,
        active: m.active,
        closed: m.closed,
        end_date: m.end_date,
        last_updated: m.last_updated,
      })),
      count: markets.length,
    },
    meta: {
      source: "Polymarket (cached in Supabase)",
      mac_required: false,
      filters: { category, active, limit, sort: sortBy },
      timestamp: new Date().toISOString(),
    },
  });
}
