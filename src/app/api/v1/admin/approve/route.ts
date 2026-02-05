import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export const runtime = "nodejs";

const CONTEXT = "https://apipool.dev/schema/v1";

// Simple admin key - in production use proper auth
const ADMIN_KEY = process.env.ADMIN_API_KEY || "rufus-admin-2024";

// POST /api/v1/admin/approve - Approve or reject pending API
export async function POST(request: NextRequest) {
  const authHeader = request.headers.get("authorization");

  if (!authHeader || authHeader !== `Bearer ${ADMIN_KEY}`) {
    return NextResponse.json({
      "@context": CONTEXT,
      "@type": "APIError",
      success: false,
      error: {
        code: "UNAUTHORIZED",
        message: "Invalid or missing admin key",
      },
    }, { status: 401 });
  }

  const body = await request.json();
  const { id, action } = body;

  if (!id || !["approve", "reject"].includes(action)) {
    return NextResponse.json({
      "@context": CONTEXT,
      "@type": "APIError",
      success: false,
      error: {
        code: "BAD_REQUEST",
        message: "Required: id, action (approve|reject)",
      },
    }, { status: 400 });
  }

  const newStatus = action === "approve" ? "active" : "rejected";

  const { error } = await supabase
    .from("api_listings")
    .update({
      status: newStatus,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id);

  if (error) {
    return NextResponse.json({
      "@context": CONTEXT,
      "@type": "APIError",
      success: false,
      error: {
        code: "DATABASE_ERROR",
        message: error.message,
      },
    }, { status: 500 });
  }

  return NextResponse.json({
    "@context": CONTEXT,
    "@type": "AdminAction",
    success: true,
    data: {
      id,
      action,
      new_status: newStatus,
    },
    meta: {
      timestamp: new Date().toISOString(),
    },
  });
}

// GET /api/v1/admin/approve - List pending APIs
export async function GET(request: NextRequest) {
  const authHeader = request.headers.get("authorization");

  if (!authHeader || authHeader !== `Bearer ${ADMIN_KEY}`) {
    return NextResponse.json({
      "@context": CONTEXT,
      "@type": "APIError",
      success: false,
      error: {
        code: "UNAUTHORIZED",
        message: "Invalid or missing admin key",
      },
    }, { status: 401 });
  }

  const { data, error } = await supabase
    .from("api_listings")
    .select("*")
    .eq("status", "pending");

  if (error) {
    return NextResponse.json({
      "@context": CONTEXT,
      "@type": "APIError",
      success: false,
      error: {
        code: "DATABASE_ERROR",
        message: error.message,
      },
    }, { status: 500 });
  }

  return NextResponse.json({
    "@context": CONTEXT,
    "@type": "PendingAPIs",
    success: true,
    data: {
      pending: data || [],
      total: data?.length || 0,
    },
    meta: {
      timestamp: new Date().toISOString(),
    },
  });
}
