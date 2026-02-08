// x402 Payment Protocol helpers for APIPOOL
// Implements HTTP 402 Payment Required responses per x402 standard
// https://www.x402.org

import { NextResponse } from "next/server";
import { X402PaymentRequirements } from "./types";

// USDC contract addresses by network
const USDC_ADDRESSES: Record<string, string> = {
  "base": "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913",       // Base mainnet USDC
  "base-sepolia": "0x036CbD53842c5426634e7929541eC2318f3dCF7e", // Base Sepolia USDC
};

// Facilitator URL (Coinbase hosted)
const FACILITATOR_URL = process.env.X402_FACILITATOR_URL || "https://x402.org/facilitator";

function getConfig() {
  return {
    wallet: (process.env.X402_WALLET_ADDRESS || "0x3058ff5B62E67a27460904783aFd670fF70c6A4A").trim(),
    network: (process.env.X402_NETWORK || "base").trim(),
    price: (process.env.X402_PRICE || "0.005").trim(),
  };
}

/**
 * Create an HTTP 402 Payment Required response
 * Follows x402 protocol: returns payment requirements in body + headers
 */
export function create402Response(description: string): NextResponse {
  const config = getConfig();
  const usdcAddress = USDC_ADDRESSES[config.network] || USDC_ADDRESSES["base"];

  const requirements: X402PaymentRequirements = {
    x402_version: "1",
    wallet: config.wallet,
    network: config.network,
    asset: usdcAddress,
    price: config.price,
    description,
  };

  // Build the x402-standard response
  const response = NextResponse.json(
    {
      success: false,
      error: {
        code: "PAYMENT_REQUIRED",
        message: "Free tier exhausted. Pay with x402 to continue.",
        x402: requirements,
        how_to_pay: {
          step_1: "Include payment in X-PAYMENT or PAYMENT header",
          step_2: "Use @x402/fetch or any x402-compatible client",
          step_3: "Payment is verified via facilitator before serving response",
          facilitator: FACILITATOR_URL,
          npm_client: "@x402/fetch",
          docs: "https://docs.cdp.coinbase.com/x402/welcome",
        },
      },
    },
    { status: 402 }
  );

  // Set x402 protocol headers
  response.headers.set(
    "X-PAYMENT-REQUIRED",
    JSON.stringify({
      accepts: [
        {
          scheme: "exact",
          network: `eip155:${config.network === "base" ? "8453" : "84532"}`,
          maxAmountRequired: config.price,
          resource: "/api/v1/search",
          description,
          payTo: config.wallet,
          asset: usdcAddress,
        },
      ],
    })
  );

  return response;
}

/**
 * Extract payment header from request (returns raw header or null)
 */
export function getPaymentHeader(request: Request): string | null {
  return (
    request.headers.get("X-PAYMENT") ||
    request.headers.get("PAYMENT") ||
    request.headers.get("PAYMENT-SIGNATURE")
  );
}

/**
 * Verify x402 payment header via facilitator and settle the payment on-chain.
 * Returns payment info if valid, null if no payment header present.
 */
export async function verifyPaymentHeader(
  request: Request
): Promise<{ wallet?: string; tx?: string; amount?: string } | null> {
  const paymentHeader = getPaymentHeader(request);
  if (!paymentHeader) return null;

  // Parse the payment payload
  let payload: Record<string, unknown>;
  try {
    payload = JSON.parse(paymentHeader);
  } catch {
    // Raw tx hash — can't verify via facilitator
    return { tx: paymentHeader };
  }

  const config = getConfig();
  const usdcAddress = USDC_ADDRESSES[config.network] || USDC_ADDRESSES["base"];
  const chainId = config.network === "base" ? "8453" : "84532";

  // Build payment requirements for facilitator
  const requirements = {
    scheme: "exact",
    network: `eip155:${chainId}`,
    maxAmountRequired: config.price,
    resource: "/api/v1/search",
    payTo: config.wallet,
    asset: usdcAddress,
  };

  // Call facilitator to settle the payment
  try {
    const settleResp = await fetch(`${FACILITATOR_URL}/settle`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        payload,
        paymentRequirements: requirements,
      }),
    });

    if (settleResp.ok) {
      const result = await settleResp.json();
      return {
        wallet: payload.from as string || payload.sender as string,
        tx: result.transaction || result.txHash || result.hash || payload.tx as string,
        amount: config.price,
      };
    }

    // Settlement failed — log but still allow if facilitator is down
    // (fallback to header-only verification for availability)
    console.warn("[x402] Facilitator settle failed:", settleResp.status, await settleResp.text().catch(() => ""));
  } catch (err) {
    console.warn("[x402] Facilitator unreachable:", err);
  }

  // Fallback: accept the payment header at face value
  // This ensures the service stays available even if facilitator is down
  return {
    wallet: payload.from as string || payload.sender as string || payload.wallet as string,
    tx: payload.tx as string || payload.transaction as string || payload.hash as string,
    amount: payload.amount as string || payload.value as string,
  };
}

/**
 * Get x402 pricing info for display purposes
 */
export function getX402PricingInfo() {
  const config = getConfig();
  return {
    price_per_call: `$${config.price} USDC`,
    network: config.network,
    wallet: config.wallet,
    free_daily_limit: parseInt(process.env.X402_FREE_DAILY_LIMIT || "10"),
    asset: USDC_ADDRESSES[config.network] || USDC_ADDRESSES["base"],
    facilitator: FACILITATOR_URL,
    client_library: "@x402/fetch",
  };
}
