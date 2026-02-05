import { NextRequest, NextResponse } from "next/server";
import { registerAPI } from "@/lib/registry";
import { checkRateLimit, getClientIP } from "@/lib/ratelimit";
import type { APIRegistration } from "@/lib/types";

export const runtime = "nodejs";

const VALID_CATEGORIES = [
  "research", "market-data", "image-gen", "code", "translation",
  "summarization", "embeddings", "web-scraping", "audio", "video", "other"
];

// Blocked endpoints for security
const BLOCKED_PATTERNS = [
  /^https?:\/\/localhost/i,
  /^https?:\/\/127\./,
  /^https?:\/\/10\./,
  /^https?:\/\/192\.168\./,
  /^https?:\/\/172\.(1[6-9]|2[0-9]|3[01])\./,
];

// POST /api/registry/register - Register a new API
export async function POST(request: NextRequest) {
  try {
    // Rate limiting
    const clientIP = getClientIP(request);
    const rateLimit = checkRateLimit(clientIP, true);

    if (!rateLimit.allowed) {
      return NextResponse.json(
        {
          error: "Rate limit exceeded",
          retry_after_ms: rateLimit.resetIn,
        },
        {
          status: 429,
          headers: {
            "X-RateLimit-Remaining": "0",
            "X-RateLimit-Reset": String(Math.ceil(rateLimit.resetIn / 1000)),
          },
        }
      );
    }

    const body: APIRegistration = await request.json();

    // Validate required fields
    if (!body.name || !body.endpoint || !body.category) {
      return NextResponse.json(
        { error: "Missing required fields: name, endpoint, category" },
        { status: 400 }
      );
    }

    // Validate name length
    if (body.name.length < 3 || body.name.length > 100) {
      return NextResponse.json(
        { error: "Name must be 3-100 characters" },
        { status: 400 }
      );
    }

    // Validate category
    if (!VALID_CATEGORIES.includes(body.category)) {
      return NextResponse.json(
        { error: `Invalid category. Must be one of: ${VALID_CATEGORIES.join(", ")}` },
        { status: 400 }
      );
    }

    // Validate endpoint URL
    let endpointUrl: URL;
    try {
      endpointUrl = new URL(body.endpoint);
    } catch {
      return NextResponse.json(
        { error: "Invalid endpoint URL" },
        { status: 400 }
      );
    }

    // Block internal/private endpoints
    if (BLOCKED_PATTERNS.some(pattern => pattern.test(body.endpoint))) {
      return NextResponse.json(
        { error: "Private/internal endpoints not allowed" },
        { status: 400 }
      );
    }

    // Must be HTTPS in production
    if (endpointUrl.protocol !== "https:" && process.env.NODE_ENV === "production") {
      return NextResponse.json(
        { error: "Endpoint must use HTTPS" },
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

    if (body.pricing.price < 0) {
      return NextResponse.json(
        { error: "Price cannot be negative" },
        { status: 400 }
      );
    }

    // Generate provider ID (in production, this would come from auth)
    const providerId = body.providerWallet
      ? body.providerWallet.slice(0, 10)
      : `anon-${Date.now()}`;

    const listing = await registerAPI(body, providerId);

    return NextResponse.json(
      {
        success: true,
        listing,
        message: "API registered successfully. Status: pending review. An admin will review your submission.",
      },
      {
        headers: {
          "X-RateLimit-Remaining": String(rateLimit.remaining),
        },
      }
    );
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
