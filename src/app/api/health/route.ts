import { NextResponse } from "next/server";
import { checkHealth as checkOllama } from "@/lib/ollama";

export const runtime = "nodejs";

export async function GET() {
  const ollamaHealthy = await checkOllama();

  const status = {
    status: ollamaHealthy ? "healthy" : "degraded",
    timestamp: new Date().toISOString(),
    agent: {
      id: "#22742",
      name: "Rufus",
      protocol: "ERC-8004",
      wallet: "0x3058ff5B62E67a27460904783aFd670fF70c6A4A",
    },
    services: {
      ollama: ollamaHealthy ? "up" : "down",
      api: "up",
    },
    version: "0.1.0",
  };

  return NextResponse.json(status, {
    status: ollamaHealthy ? 200 : 503,
    headers: {
      "Cache-Control": "no-cache",
    },
  });
}
