import { NextRequest, NextResponse } from "next/server";
import { syncMarkets } from "@/lib/polymarket";

export const runtime = "nodejs";
export const maxDuration = 30;

const CRON_SECRET = process.env.CRON_SECRET || "health-check-2024";

// POST /api/v1/data/sync - Sync Polymarket data into Supabase
// Called by Vercel cron every 6 hours. Mac Mini not needed.
export async function POST(request: NextRequest) {
  const authHeader = request.headers.get("authorization");

  if (authHeader !== `Bearer ${CRON_SECRET}`) {
    return NextResponse.json({
      success: false,
      error: { code: "UNAUTHORIZED", message: "Invalid cron secret" },
    }, { status: 401 });
  }

  const result = await syncMarkets();

  return NextResponse.json({
    success: true,
    data: {
      synced: result.synced,
      errors: result.errors.length,
      error_details: result.errors.slice(0, 5),
    },
    meta: {
      description: "Polymarket data synced to Supabase. No Mac Mini needed.",
      timestamp: new Date().toISOString(),
    },
  });
}

// GET - Return sync status info
export async function GET() {
  return NextResponse.json({
    success: true,
    data: {
      description: "Polymarket data sync endpoint",
      schedule: "Every 6 hours via Vercel cron",
      source: "Polymarket Gamma API",
      storage: "Supabase PostgreSQL",
      mac_required: false,
    },
    meta: {
      usage: "POST with Authorization: Bearer <CRON_SECRET> to trigger sync",
      timestamp: new Date().toISOString(),
    },
  });
}
