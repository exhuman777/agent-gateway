import { NextRequest, NextResponse } from "next/server";
import { braveWebSearch } from "@/lib/brave";
import { create402Response, verifyPaymentHeader, getX402PricingInfo } from "@/lib/x402";
import { checkFreeTier, incrementFreeTier } from "@/lib/freetier";
import { logUsage } from "@/lib/usage";
import { getClientIP } from "@/lib/ratelimit";

export const runtime = "nodejs";

const CONTEXT = "https://apipool.dev/schema/v1";

// POST /api/v1/search - Brave Web Search (x402 paid)
// First 10 calls/day per IP are free, then requires x402 payment
export async function POST(request: NextRequest) {
  const start = Date.now();
  const ip = getClientIP(request);

  try {
    const body = await request.json();
    const { query, count } = body;

    if (!query || typeof query !== "string" || query.trim().length === 0) {
      return NextResponse.json({
        "@context": CONTEXT,
        "@type": "APIError",
        success: false,
        error: {
          code: "INVALID_INPUT",
          message: "Provide a 'query' string to search the web",
          example: { query: "bitcoin price today", count: 5 },
        },
      }, { status: 400 });
    }

    const searchCount = Math.min(Math.max(count || 10, 1), 20);

    // Check free tier
    const freeTier = await checkFreeTier(ip, "/api/v1/search");

    let isFreeTier = false;
    let paymentInfo: { wallet?: string; tx?: string; amount?: string } | null = null;

    if (freeTier.allowed) {
      // Free tier still available
      isFreeTier = true;
      await incrementFreeTier(ip, "/api/v1/search");
    } else {
      // Free tier exhausted — check for x402 payment
      paymentInfo = await verifyPaymentHeader(request);

      if (!paymentInfo) {
        // No payment — return 402
        const latency = Date.now() - start;
        logUsage({
          endpoint: "/api/v1/search",
          caller_ip: ip,
          query: query.trim(),
          latency_ms: latency,
          is_free_tier: false,
          status: "payment_required",
        });

        return create402Response(
          `Brave Web Search: "${query.trim()}" — $0.005 USDC per query`
        );
      }
    }

    // Execute the search
    const searchResult = await braveWebSearch(query.trim(), searchCount);
    const latency = Date.now() - start;

    // Log usage (non-blocking)
    logUsage({
      endpoint: "/api/v1/search",
      caller_ip: ip,
      caller_wallet: paymentInfo?.wallet,
      payment_tx: paymentInfo?.tx,
      payment_amount: paymentInfo ? parseFloat(process.env.X402_PRICE || "0.005") : undefined,
      query: query.trim(),
      latency_ms: latency,
      is_free_tier: isFreeTier,
      status: "success",
    });

    // Build response
    const response: Record<string, unknown> = {
      "@context": CONTEXT,
      "@type": "SearchResponse",
      success: true,
      data: {
        query: query.trim(),
        results: searchResult.results,
        count: searchResult.results.length,
        total_estimated: searchResult.total_estimated,
      },
      meta: {
        source: "Brave Search API",
        latency_ms: latency,
        is_free_tier: isFreeTier,
        timestamp: new Date().toISOString(),
      },
    };

    // Add free tier info if using free tier
    if (isFreeTier) {
      const updatedFreeTier = await checkFreeTier(ip, "/api/v1/search");
      (response.meta as Record<string, unknown>).free_tier = {
        remaining: updatedFreeTier.remaining,
        limit: updatedFreeTier.limit,
        resets_at: updatedFreeTier.resets_at,
      };
    }

    // Add payment info if paid
    if (paymentInfo) {
      (response.meta as Record<string, unknown>).payment = {
        status: "verified",
        amount: process.env.X402_PRICE || "0.005",
        currency: "USDC",
        tx: paymentInfo.tx,
      };
    }

    return NextResponse.json(response);
  } catch (error) {
    const latency = Date.now() - start;
    logUsage({
      endpoint: "/api/v1/search",
      caller_ip: ip,
      query: "error",
      latency_ms: latency,
      is_free_tier: false,
      status: "error",
    });

    return NextResponse.json({
      "@context": CONTEXT,
      "@type": "APIError",
      success: false,
      error: {
        code: "SEARCH_ERROR",
        message: error instanceof Error ? error.message : "Search failed",
      },
    }, { status: 500 });
  }
}

// GET /api/v1/search — Schema and pricing info
export async function GET() {
  const pricing = getX402PricingInfo();

  return NextResponse.json({
    "@context": CONTEXT,
    "@type": "SearchSchema",
    endpoint: "/api/v1/search",
    method: "POST",
    description: "Web search powered by Brave Search API. First 10 calls/day free, then x402 micropayments.",
    pricing: {
      model: "x402",
      price_per_call: pricing.price_per_call,
      free_daily_limit: pricing.free_daily_limit,
      currency: "USDC",
      network: pricing.network,
      wallet: pricing.wallet,
      asset: pricing.asset,
      facilitator: pricing.facilitator,
      client_library: pricing.client_library,
    },
    schema: {
      query: {
        type: "string",
        required: true,
        description: "Search query string",
      },
      count: {
        type: "number",
        required: false,
        default: 10,
        max: 20,
        description: "Number of results to return (1-20)",
      },
    },
    examples: [
      {
        description: "Basic search (free tier)",
        body: { query: "bitcoin price today" },
      },
      {
        description: "Search with count",
        body: { query: "AI agent frameworks 2026", count: 5 },
      },
    ],
    x402_flow: {
      step_1: "POST /api/v1/search with query — first 10/day are free",
      step_2: "After free tier exhausted, server returns 402 with payment requirements",
      step_3: "Client sends payment via X-PAYMENT header using @x402/fetch",
      step_4: "Server verifies payment and returns search results",
    },
  });
}
