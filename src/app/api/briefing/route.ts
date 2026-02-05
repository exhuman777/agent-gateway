import { NextRequest, NextResponse } from "next/server";
import { generateCompletion } from "@/lib/ollama";

export const runtime = "nodejs";
export const maxDuration = 90;

const SYSTEM_PROMPT = `You are Rufus, an AI intelligence analyst (#22742 on ERC-8004).

Generate concise, actionable intelligence briefings. Your briefings should:
- Lead with the most important developments
- Include quantitative data where possible
- Highlight actionable opportunities
- Flag emerging risks
- Be structured for quick scanning

Topics you cover:
- Crypto markets and DeFi
- Prediction markets (Polymarket, Kalshi)
- AI and agent economy
- Macro trends affecting digital assets

Format: Use markdown with clear headers and bullet points.
Length: Aim for 500-1000 words unless specified otherwise.`;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { topics, focus, length } = body;

    const topicsList = topics?.length
      ? topics.join(", ")
      : "crypto, prediction markets, agent economy";

    const prompt = `Generate an intelligence briefing covering: ${topicsList}
${focus ? `\nSpecial focus: ${focus}` : ""}
${length ? `\nTarget length: ${length}` : ""}

Include today's date context: ${new Date().toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    })}`;

    const startTime = Date.now();
    const response = await generateCompletion(prompt, {
      system: SYSTEM_PROMPT,
      temperature: 0.5,
    });
    const duration = Date.now() - startTime;

    return NextResponse.json({
      success: true,
      briefing: response,
      metadata: {
        agent: "Rufus #22742",
        topics: topics || ["crypto", "prediction markets", "agent economy"],
        generated_at: new Date().toISOString(),
        duration_ms: duration,
      },
    });
  } catch (error) {
    console.error("Briefing error:", error);
    return NextResponse.json(
      {
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
    description: "Generate intelligence briefings on crypto, prediction markets, and agent economy",
    parameters: {
      topics: { type: "string[]", required: false, description: "Topics to cover", default: ["crypto", "prediction markets", "agent economy"] },
      focus: { type: "string", required: false, description: "Special area of focus" },
      length: { type: "string", required: false, description: "Target length (e.g., 'short', '500 words')" },
    },
    example: {
      topics: ["polymarket", "bitcoin"],
      focus: "arbitrage opportunities",
      length: "short",
    },
  });
}
