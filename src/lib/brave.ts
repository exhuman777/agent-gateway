// Brave Search API client
// Wraps the Brave Web Search API for use by APIPOOL agents

import { BraveSearchResult } from "./types";

const BRAVE_API_URL = "https://api.search.brave.com/res/v1/web/search";

export async function braveWebSearch(
  query: string,
  count: number = 10
): Promise<{ results: BraveSearchResult[]; query: string; total_estimated: number }> {
  const apiKey = process.env.BRAVE_API_KEY;
  if (!apiKey) {
    throw new Error("BRAVE_API_KEY not configured");
  }

  const params = new URLSearchParams({
    q: query,
    count: String(Math.min(count, 20)), // Brave max is 20
  });

  const start = Date.now();

  const response = await fetch(`${BRAVE_API_URL}?${params}`, {
    headers: {
      Accept: "application/json",
      "Accept-Encoding": "gzip",
      "X-Subscription-Token": apiKey,
    },
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Brave API error ${response.status}: ${text}`);
  }

  const data = await response.json();
  const latency = Date.now() - start;

  const results: BraveSearchResult[] = (data.web?.results || []).map(
    (r: Record<string, unknown>) => ({
      title: r.title || "",
      url: r.url || "",
      description: r.description || "",
      age: r.age || undefined,
      language: r.language || undefined,
      favicon: (r.profile as Record<string, unknown>)?.img || undefined,
    })
  );

  return {
    results,
    query,
    total_estimated: data.web?.totalEstimatedMatches || results.length,
  };
}
