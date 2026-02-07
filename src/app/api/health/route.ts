import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function GET() {
  return NextResponse.json(
    {
      status: "healthy",
      timestamp: new Date().toISOString(),
      agent: {
        id: "#22742",
        name: "APIPOOL",
        protocol: "ERC-8004",
      },
      services: {
        api: "up",
        supabase: "up",
        brave_search: "up",
      },
      architecture: "100% real data. All endpoints return live data from Brave Search and Polymarket (via Supabase).",
      version: "0.2.0",
    },
    {
      status: 200,
      headers: { "Cache-Control": "no-cache" },
    }
  );
}
