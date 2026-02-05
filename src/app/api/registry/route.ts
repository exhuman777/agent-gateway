import { NextRequest, NextResponse } from "next/server";
import { searchAPIs, getCategories, getTopAPIs } from "@/lib/registry";
import type { APICategory } from "@/lib/types";

export const runtime = "nodejs";

// GET /api/registry - Search and list APIs
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);

  const category = searchParams.get("category") as APICategory | null;
  const minQuality = searchParams.get("minQuality");
  const maxPrice = searchParams.get("maxPrice");
  const capabilities = searchParams.get("capabilities");
  const sortBy = searchParams.get("sortBy") as "quality" | "price" | "latency" | "popularity" | null;
  const featured = searchParams.get("featured");

  // Return featured/top APIs
  if (featured === "true") {
    return NextResponse.json({
      apis: getTopAPIs(10),
      categories: getCategories(),
    });
  }

  // Search with filters
  const filters = {
    category: category || undefined,
    minQualityScore: minQuality ? parseFloat(minQuality) : undefined,
    maxPrice: maxPrice ? parseFloat(maxPrice) : undefined,
    capabilities: capabilities ? capabilities.split(",") : undefined,
    sortBy: sortBy || "quality",
  };

  const apis = searchAPIs(filters);

  return NextResponse.json({
    apis,
    total: apis.length,
    filters,
    categories: getCategories(),
  });
}
