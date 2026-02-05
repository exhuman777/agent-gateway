import { NextRequest, NextResponse } from "next/server";
import { registerAPI } from "@/lib/registry";
import type { APIRegistration } from "@/lib/types";

export const runtime = "nodejs";

// POST /api/registry/register - Register a new API
export async function POST(request: NextRequest) {
  try {
    const body: APIRegistration = await request.json();

    // Validate required fields
    if (!body.name || !body.endpoint || !body.category) {
      return NextResponse.json(
        { error: "Missing required fields: name, endpoint, category" },
        { status: 400 }
      );
    }

    // Validate endpoint URL
    try {
      new URL(body.endpoint);
    } catch {
      return NextResponse.json(
        { error: "Invalid endpoint URL" },
        { status: 400 }
      );
    }

    // Validate pricing
    if (!body.pricing || body.pricing.price === undefined) {
      return NextResponse.json(
        { error: "Pricing information required" },
        { status: 400 }
      );
    }

    // Generate provider ID (in production, this would come from auth)
    const providerId = body.providerWallet
      ? body.providerWallet.slice(0, 10)
      : `anon-${Date.now()}`;

    const listing = registerAPI(body, providerId);

    return NextResponse.json({
      success: true,
      listing,
      message: "API registered successfully. Status: pending review.",
    });
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      {
        error: "Registration failed",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

// GET /api/registry/register - Return registration schema
export async function GET() {
  return NextResponse.json({
    endpoint: "/api/registry/register",
    method: "POST",
    description: "Register a new API in the marketplace",
    schema: {
      name: { type: "string", required: true, description: "API display name" },
      description: { type: "string", required: true, description: "What the API does" },
      endpoint: { type: "string", required: true, description: "Full URL of the API endpoint" },
      category: {
        type: "string",
        required: true,
        enum: [
          "research", "market-data", "image-gen", "code", "translation",
          "summarization", "embeddings", "web-scraping", "audio", "video", "other"
        ],
      },
      capabilities: { type: "string[]", required: false, description: "List of capability tags" },
      pricing: {
        type: "object",
        required: true,
        properties: {
          model: { enum: ["per_request", "subscription", "free", "x402"] },
          price: { type: "number", description: "Price per request or subscription price" },
          currency: { enum: ["USD", "USDC", "ETH"] },
          freeQuota: { type: "number", description: "Free requests per day" },
        },
      },
      a2aCard: { type: "string", required: false, description: "URL to A2A agent card" },
      providerWallet: { type: "string", required: false, description: "Wallet for receiving payments" },
    },
    example: {
      name: "My Research API",
      description: "Deep research on any topic",
      endpoint: "https://api.example.com/research",
      category: "research",
      capabilities: ["research", "analysis"],
      pricing: {
        model: "x402",
        price: 0.001,
        currency: "USDC",
        freeQuota: 10,
      },
      a2aCard: "https://api.example.com/.well-known/agent-card.json",
      providerWallet: "0x...",
    },
  });
}
