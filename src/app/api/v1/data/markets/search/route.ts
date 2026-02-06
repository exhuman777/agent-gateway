import { NextRequest, NextResponse } from "next/server";
import { searchMarkets } from "@/lib/polymarket";

export const runtime = "nodejs";

// GET /api/v1/data/markets/search?q=bitcoin - Search markets
// Searches pre-stored Supabase data. No LLM. No Mac Mini.
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q") || "";
  const limit = Math.min(parseInt(searchParams.get("limit") || "20"), 50);

  if (!query) {
    return NextResponse.json({
      success: false,
      error: {
        code: "MISSING_QUERY",
        message: "Provide ?q=search+term to search markets",
        example: "/api/v1/data/markets/search?q=bitcoin",
      },
    }, { status: 400 });
  }

  const markets = await searchMarkets(query, limit);

  return NextResponse.json({
    success: true,
    data: {
      query,
      markets: markets.map(m => ({
        id: m.id,
        question: m.question,
        slug: m.slug,
        category: m.category,
        yes_price: m.yes_price,
        no_price: m.no_price,
        yes_percent: `${(m.yes_price * 100).toFixed(1)}%`,
        volume: m.volume,
        active: m.active,
        end_date: m.end_date,
      })),
      count: markets.length,
    },
    meta: {
      source: "Polymarket (cached in Supabase)",
      mac_required: false,
      timestamp: new Date().toISOString(),
    },
  });
}
