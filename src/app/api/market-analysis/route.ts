import { NextRequest, NextResponse } from "next/server";
import { searchMarkets, getTrendingMarkets, getMarketById } from "@/lib/polymarket";
import { braveWebSearch } from "@/lib/brave";

export const runtime = "nodejs";
export const maxDuration = 30;

// POST /api/market-analysis — Real prediction market analysis
// Uses: Supabase (Polymarket data) + Brave Search (news context)
// Zero LLMs. 100% real data.
export async function POST(request: NextRequest) {
  const startTime = Date.now();

  try {
    const body = await request.json();
    const { market, question, timeframe } = body;

    if (!market && !question) {
      return NextResponse.json(
        {
          success: false,
          error: "Provide either 'market' (market ID) or 'question' (search term)",
          example: { question: "bitcoin", timeframe: "24h" },
        },
        { status: 400 }
      );
    }

    // If market ID provided, fetch that specific market
    if (market) {
      const { market: marketData, history } = await getMarketById(market);

      if (!marketData) {
        return NextResponse.json(
          { success: false, error: `Market not found: ${market}` },
          { status: 404 }
        );
      }

      // Compute analytics from real snapshot data
      const latestSnapshot = history[history.length - 1];
      const oldestSnapshot = history[0];
      const priceChange =
        latestSnapshot && oldestSnapshot
          ? latestSnapshot.yes_price - oldestSnapshot.yes_price
          : 0;

      // Check for arbitrage (YES + NO should be ~1.0)
      const priceSumDeviation = Math.abs(marketData.yes_price + marketData.no_price - 1.0);
      const hasArbitrageSignal = priceSumDeviation > 0.02;

      // Fetch news context for this market
      const newsContext = await braveWebSearch(
        `${marketData.question} prediction market`,
        5
      ).catch(() => ({ results: [], query: "", total_estimated: 0 }));

      const duration = Date.now() - startTime;

      return NextResponse.json({
        success: true,
        analysis: {
          market: {
            id: marketData.id,
            question: marketData.question,
            category: marketData.category,
            active: marketData.active,
            end_date: marketData.end_date,
          },
          prices: {
            yes: marketData.yes_price,
            no: marketData.no_price,
            yes_percent: `${(marketData.yes_price * 100).toFixed(1)}%`,
            no_percent: `${(marketData.no_price * 100).toFixed(1)}%`,
          },
          volume: marketData.volume,
          liquidity: marketData.liquidity,
          price_history: {
            snapshots: history.length,
            price_change: priceChange,
            price_change_percent:
              oldestSnapshot && oldestSnapshot.yes_price > 0
                ? `${((priceChange / oldestSnapshot.yes_price) * 100).toFixed(1)}%`
                : "N/A",
            first_recorded: oldestSnapshot?.recorded_at || null,
            last_recorded: latestSnapshot?.recorded_at || null,
          },
          signals: {
            arbitrage_opportunity: hasArbitrageSignal,
            price_sum_deviation: priceSumDeviation.toFixed(4),
            high_volume: marketData.volume > 100000,
            high_liquidity: marketData.liquidity > 50000,
          },
          news_context: newsContext.results.slice(0, 3).map((r) => ({
            title: r.title,
            url: r.url,
            snippet: r.description,
            age: r.age,
          })),
        },
        metadata: {
          agent: "APIPOOL",
          sources: ["Polymarket (via Supabase)", "Brave Search API"],
          llm_used: false,
          duration_ms: duration,
          disclaimer: "Not financial advice. Markets are volatile.",
          timestamp: new Date().toISOString(),
        },
      });
    }

    // If question provided, search markets + provide overview
    const markets = await searchMarkets(question, 10);

    // Also get trending for context
    const trending = await getTrendingMarkets(5);

    // Fetch news about the question
    const newsContext = await braveWebSearch(
      `${question} ${timeframe || ""} prediction market`.trim(),
      5
    ).catch(() => ({ results: [], query: "", total_estimated: 0 }));

    const duration = Date.now() - startTime;

    // Compute aggregate stats for matched markets
    const totalVolume = markets.reduce((sum, m) => sum + m.volume, 0);
    const avgYesPrice =
      markets.length > 0
        ? markets.reduce((sum, m) => sum + m.yes_price, 0) / markets.length
        : 0;

    // Check for arbitrage across markets
    const arbitrageMarkets = markets.filter(
      (m) => Math.abs(m.yes_price + m.no_price - 1.0) > 0.02
    );

    return NextResponse.json({
      success: true,
      analysis: {
        query: question,
        timeframe: timeframe || "all",
        matched_markets: markets.map((m) => ({
          id: m.id,
          question: m.question,
          category: m.category,
          yes_price: m.yes_price,
          yes_percent: `${(m.yes_price * 100).toFixed(1)}%`,
          volume: m.volume,
          active: m.active,
          end_date: m.end_date,
        })),
        aggregate: {
          markets_found: markets.length,
          total_volume: totalVolume,
          avg_yes_probability: `${(avgYesPrice * 100).toFixed(1)}%`,
          arbitrage_signals: arbitrageMarkets.length,
        },
        trending_context: trending.slice(0, 3).map((m) => ({
          question: m.question,
          yes_percent: `${(m.yes_price * 100).toFixed(1)}%`,
          volume: m.volume,
        })),
        news_context: newsContext.results.slice(0, 5).map((r) => ({
          title: r.title,
          url: r.url,
          snippet: r.description,
          age: r.age,
        })),
      },
      metadata: {
        agent: "APIPOOL",
        sources: ["Polymarket (via Supabase)", "Brave Search API"],
        llm_used: false,
        duration_ms: duration,
        disclaimer: "Not financial advice. Markets are volatile.",
        timestamp: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error("Market analysis error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Analysis failed",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    endpoint: "/api/market-analysis",
    method: "POST",
    description:
      "Prediction market analysis using real Polymarket data and Brave Search news context. No LLM — 100% real data.",
    parameters: {
      market: {
        type: "string",
        required: false,
        description: "Market ID for specific market analysis",
      },
      question: {
        type: "string",
        required: false,
        description: "Search term to find and analyze related markets",
      },
      timeframe: {
        type: "string",
        required: false,
        description: "Time focus for news context (e.g., '24h', 'this week')",
      },
    },
    note: "Provide either 'market' or 'question' — at least one is required.",
    example_request: {
      question: "bitcoin",
      timeframe: "this week",
    },
    sources: ["Polymarket (cached in Supabase)", "Brave Search API"],
    llm_required: false,
  });
}
