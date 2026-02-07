import { NextRequest, NextResponse } from "next/server";
import { braveWebSearch } from "@/lib/brave";

export const runtime = "nodejs";
export const maxDuration = 30;

// POST /api/research — Real web research via Brave Search
// Returns structured, sourced results from the live web.
// Zero LLMs. 100% real data.
export async function POST(request: NextRequest) {
  const startTime = Date.now();

  try {
    const body = await request.json();
    const { query, context, count } = body;

    if (!query || typeof query !== "string" || query.trim().length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: "Missing or invalid 'query' parameter",
          example: { query: "prediction markets 2026", count: 10 },
        },
        { status: 400 }
      );
    }

    const searchCount = Math.min(count || 10, 20);

    // Build search query — include context if provided
    const searchQuery = context
      ? `${query.trim()} ${context}`
      : query.trim();

    const searchResult = await braveWebSearch(searchQuery, searchCount);
    const duration = Date.now() - startTime;

    // Group results by domain for richer structure
    const domainMap = new Map<string, typeof searchResult.results>();
    for (const r of searchResult.results) {
      try {
        const domain = new URL(r.url).hostname.replace("www.", "");
        if (!domainMap.has(domain)) domainMap.set(domain, []);
        domainMap.get(domain)!.push(r);
      } catch {
        // skip malformed URLs
      }
    }

    const sources = Array.from(domainMap.entries())
      .map(([domain, results]) => ({
        domain,
        count: results.length,
      }))
      .sort((a, b) => b.count - a.count);

    return NextResponse.json({
      success: true,
      research: {
        query: query.trim(),
        context: context || null,
        results: searchResult.results.map((r, i) => ({
          rank: i + 1,
          title: r.title,
          url: r.url,
          snippet: r.description,
          age: r.age,
          favicon: r.favicon,
        })),
        total_estimated: searchResult.total_estimated,
        sources_summary: sources.slice(0, 10),
      },
      metadata: {
        agent: "APIPOOL",
        source: "Brave Search API",
        llm_used: false,
        results_count: searchResult.results.length,
        duration_ms: duration,
        timestamp: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error("Research error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Research failed",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    endpoint: "/api/research",
    method: "POST",
    description:
      "Web research powered by Brave Search API. Returns structured, sourced results from the live web. No LLM — 100% real data.",
    parameters: {
      query: {
        type: "string",
        required: true,
        description: "The research query",
      },
      context: {
        type: "string",
        required: false,
        description: "Additional context to refine results",
      },
      count: {
        type: "number",
        required: false,
        description: "Number of results (1-20)",
        default: 10,
      },
    },
    example_request: {
      query: "prediction markets regulation 2026",
      context: "polymarket legal status",
      count: 5,
    },
    sources: ["Brave Search API"],
    llm_required: false,
  });
}
