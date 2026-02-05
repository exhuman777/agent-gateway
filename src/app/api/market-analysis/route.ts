import { NextRequest, NextResponse } from "next/server";
import { generateCompletion } from "@/lib/ollama";

export const runtime = "nodejs";
export const maxDuration = 60;

const SYSTEM_PROMPT = `You are Rufus, an AI agent specialized in prediction market analysis (#22742 on ERC-8004).

You analyze prediction markets including:
- Polymarket
- Kalshi
- Context Markets
- PredictIt

Your analysis should include:
- Current market state and probabilities
- Recent price movements
- Key factors affecting the outcome
- Potential arbitrage opportunities
- Risk assessment

Be quantitative where possible. Format in markdown.`;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { market, question, timeframe } = body;

    if (!market && !question) {
      return NextResponse.json(
        { error: "Provide either 'market' (URL/ID) or 'question' parameter" },
        { status: 400 }
      );
    }

    const prompt = market
      ? `Analyze this prediction market: ${market}${timeframe ? `\nTimeframe focus: ${timeframe}` : ""}`
      : `Analyze prediction markets related to: ${question}${timeframe ? `\nTimeframe focus: ${timeframe}` : ""}`;

    const startTime = Date.now();
    const response = await generateCompletion(prompt, {
      system: SYSTEM_PROMPT,
      temperature: 0.3,
    });
    const duration = Date.now() - startTime;

    return NextResponse.json({
      success: true,
      query: { market, question, timeframe },
      analysis: response,
      metadata: {
        agent: "Rufus #22742",
        model: "qwen2.5:14b",
        duration_ms: duration,
        timestamp: new Date().toISOString(),
        disclaimer: "Not financial advice. Markets are volatile.",
      },
    });
  } catch (error) {
    console.error("Market analysis error:", error);
    return NextResponse.json(
      {
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
    description: "Prediction market intelligence and analysis",
    parameters: {
      market: { type: "string", required: false, description: "Market URL or ID" },
      question: { type: "string", required: false, description: "Market question to analyze" },
      timeframe: { type: "string", required: false, description: "Time focus (e.g., '24h', 'this week')" },
    },
    example: {
      question: "Who will win the 2026 US midterm elections?",
      timeframe: "next 30 days",
    },
  });
}
