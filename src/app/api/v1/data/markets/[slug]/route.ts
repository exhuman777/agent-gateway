import { NextRequest, NextResponse } from "next/server";
import { getMarketBySlug, getMarketById } from "@/lib/polymarket";

export const runtime = "nodejs";

// GET /api/v1/data/markets/[slug] - Single market with price history
// Pre-computed data. No LLM needed. Agent-friendly structured response.
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;

  // Try by slug first, then by ID
  let result = await getMarketBySlug(slug);
  if (!result.market) {
    result = await getMarketById(slug);
  }

  if (!result.market) {
    return NextResponse.json({
      success: false,
      error: {
        code: "NOT_FOUND",
        message: `Market '${slug}' not found. Try /api/v1/data/markets/search?q=your+query`,
      },
    }, { status: 404 });
  }

  const m = result.market;
  const history = result.history;

  // Compute simple analytics from history
  const priceChange24h = history.length >= 2
    ? (() => {
        const now = history[history.length - 1];
        const dayAgo = history.find(s =>
          new Date(s.recorded_at).getTime() < Date.now() - 24 * 60 * 60 * 1000
        ) || history[0];
        return {
          yes: Number((now.yes_price - dayAgo.yes_price).toFixed(4)),
          no: Number((now.no_price - dayAgo.no_price).toFixed(4)),
        };
      })()
    : null;

  return NextResponse.json({
    success: true,
    data: {
      market: {
        id: m.id,
        question: m.question,
        slug: m.slug,
        category: m.category,
        yes_price: m.yes_price,
        no_price: m.no_price,
        yes_percent: `${(m.yes_price * 100).toFixed(1)}%`,
        no_percent: `${(m.no_price * 100).toFixed(1)}%`,
        volume: m.volume,
        liquidity: m.liquidity,
        active: m.active,
        closed: m.closed,
        end_date: m.end_date,
        last_updated: m.last_updated,
      },
      analytics: {
        price_change_24h: priceChange24h,
        total_snapshots: history.length,
        tracking_since: history[0]?.recorded_at || m.first_seen,
      },
      history: history.map(s => ({
        yes: s.yes_price,
        no: s.no_price,
        volume: s.volume,
        at: s.recorded_at,
      })),
    },
    meta: {
      source: "Polymarket (cached in Supabase)",
      mac_required: false,
      description: "Full market data with price history. No LLM involved.",
      timestamp: new Date().toISOString(),
    },
  });
}
