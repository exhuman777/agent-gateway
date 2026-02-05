import { NextRequest, NextResponse } from "next/server";
import { generateCompletion } from "@/lib/ollama";

export const runtime = "nodejs";
export const maxDuration = 60;

const SYSTEM_PROMPT = `You are Rufus, an AI research agent (#22742 on ERC-8004).
You provide comprehensive, well-structured research on any topic.
Your responses should be:
- Factual and well-sourced where possible
- Structured with clear sections
- Actionable with concrete insights
- Concise but thorough

Format your response in markdown.`;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { query, context } = body;

    if (!query || typeof query !== "string") {
      return NextResponse.json(
        { error: "Missing or invalid 'query' parameter" },
        { status: 400 }
      );
    }

    const prompt = context
      ? `Context: ${context}\n\nResearch Query: ${query}`
      : `Research Query: ${query}`;

    const startTime = Date.now();
    const response = await generateCompletion(prompt, {
      system: SYSTEM_PROMPT,
      temperature: 0.3,
    });
    const duration = Date.now() - startTime;

    return NextResponse.json({
      success: true,
      query,
      response,
      metadata: {
        agent: "Rufus #22742",
        model: "qwen2.5:14b",
        duration_ms: duration,
        timestamp: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error("Research error:", error);
    return NextResponse.json(
      {
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
    description: "Deep research on any topic using Ollama (qwen2.5:14b)",
    parameters: {
      query: { type: "string", required: true, description: "The research query" },
      context: { type: "string", required: false, description: "Additional context" },
    },
    example: {
      query: "What are the latest developments in prediction markets?",
      context: "Focus on Polymarket and decentralized options",
    },
  });
}
