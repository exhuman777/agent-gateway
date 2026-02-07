import { NextRequest, NextResponse } from "next/server";
import { braveWebSearch } from "@/lib/brave";
import { getTrendingMarkets, getStats } from "@/lib/polymarket";
import type { BraveSearchResult } from "@/lib/types";

export const runtime = "nodejs";
export const maxDuration = 30;

// POST /api/briefing — Real-time intelligence briefing
// Combines: Polymarket trending data + Brave Search headlines
// Zero LLMs. 100% real data.
export async function POST(request: NextRequest) {
  const startTime = Date.now();

  try {
    const body = await request.json();
    const { topics, focus, count } = body;

    const topicsList = topics?.length
      ? topics
      : ["crypto", "prediction markets", "AI"];

    const searchCount = Math.min(count || 5, 10);

    // Fetch real data in parallel — no LLM, just data
    const [trendingMarkets, stats, ...searchResults] = await Promise.all([
      getTrendingMarkets(10),
      getStats(),
      ...topicsList.slice(0, 3).map((topic: string) =>
        braveWebSearch(
          focus ? `${topic} ${focus} latest news` : `${topic} latest news 2026`,
          searchCount
        ).catch(() => ({ results: [], query: topic, total_estimated: 0 }))
      ),
    ]);

    const duration = Date.now() - startTime;

    // Build structured briefing from real data
    const briefing = {
      date: new Date().toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
      headlines: searchResults.map((sr, i) => ({
        topic: topicsList[i],
        articles: sr.results.slice(0, searchCount).map((r: BraveSearchResult) => ({
          title: r.title,
          url: r.url,
          snippet: r.description,
          age: r.age,
        })),
        total_results: sr.total_estimated,
      })),
      markets: {
        trending: trendingMarkets.slice(0, 5).map((m, i) => ({
          rank: i + 1,
          question: m.question,
          yes_probability: `${(m.yes_price * 100).toFixed(1)}%`,
          volume: m.volume,
          category: m.category,
        })),
        summary: {
          total_tracked: stats.total_markets,
          active: stats.active_markets,
          total_volume_usd: stats.total_volume,
          categories: stats.categories.length,
          last_sync: stats.last_sync,
        },
      },
    };

    return NextResponse.json({
      success: true,
      briefing,
      metadata: {
        agent: "APIPOOL",
        erc8004_id: 22742,
        topics: topicsList,
        focus: focus || null,
        sources: ["Brave Search API", "Polymarket (via Supabase)"],
        llm_used: false,
        duration_ms: duration,
        generated_at: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error("Briefing error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Briefing generation failed",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    endpoint: "/api/briefing",
    method: "POST",
    description:
      "Real-time intelligence briefing combining Polymarket data and Brave Search headlines. No LLM — 100% real data.",
    parameters: {
      topics: {
        type: "string[]",
        required: false,
        description: "Topics to cover",
        default: ["crypto", "prediction markets", "AI"],
      },
      focus: {
        type: "string",
        required: false,
        description: "Narrow focus within topics (e.g., 'arbitrage opportunities')",
      },
      count: {
        type: "number",
        required: false,
        description: "Number of headlines per topic (1-10)",
        default: 5,
      },
    },
    example_request: {
      topics: ["bitcoin", "polymarket"],
      focus: "price movements",
      count: 3,
    },
    example_response: {
      success: true,
      briefing: {
        date: "Friday, February 7, 2026",
        headlines: [
          {
            topic: "bitcoin",
            articles: [
              {
                title: "Bitcoin Surges Past $70K...",
                url: "https://example.com",
                snippet: "...",
                age: "2 hours ago",
              },
            ],
          },
        ],
        markets: {
          trending: [
            {
              rank: 1,
              question: "Will Bitcoin reach $100K by June 2026?",
              yes_probability: "23.5%",
              volume: 5000000,
              category: "crypto",
            },
          ],
        },
      },
    },
    sources: ["Brave Search API", "Polymarket (cached in Supabase)"],
    llm_required: false,
  });
}
