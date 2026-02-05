import { NextResponse } from "next/server";
import { getAllAPIs, getCategories } from "@/lib/registry";

export const runtime = "nodejs";

const CONTEXT = "https://apipool.dev/schema/v1";

// GET /api/v1/capabilities - List all available capabilities
export async function GET() {
  const apis = getAllAPIs();

  // Collect unique capabilities with counts
  const capabilityMap = new Map<string, { count: number; providers: string[] }>();

  apis.forEach(api => {
    api.capabilities.forEach(cap => {
      const existing = capabilityMap.get(cap) || { count: 0, providers: [] };
      existing.count++;
      if (!existing.providers.includes(api.provider.name)) {
        existing.providers.push(api.provider.name);
      }
      capabilityMap.set(cap, existing);
    });
  });

  const capabilities = Array.from(capabilityMap.entries())
    .map(([name, data]) => ({
      name,
      provider_count: data.count,
      providers: data.providers,
    }))
    .sort((a, b) => b.provider_count - a.provider_count);

  return NextResponse.json({
    "@context": CONTEXT,
    "@type": "CapabilitiesResponse",
    success: true,
    data: {
      capabilities,
      categories: getCategories(),
      total_apis: apis.length,
    },
    meta: {
      description: "All capabilities available in the registry",
      usage: "Use these capability names with /api/v1/route to find providers",
      timestamp: new Date().toISOString(),
    },
  });
}
