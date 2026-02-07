import { NextRequest, NextResponse } from "next/server";

// CORS headers for all API routes
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-PAYMENT, X-Requested-With",
  "Access-Control-Max-Age": "86400",
};

export function middleware(request: NextRequest) {
  // Handle CORS preflight (OPTIONS) requests
  if (request.method === "OPTIONS") {
    return new NextResponse(null, {
      status: 204,
      headers: corsHeaders,
    });
  }

  // For all other requests, clone the response and add CORS headers
  const response = NextResponse.next();

  for (const [key, value] of Object.entries(corsHeaders)) {
    response.headers.set(key, value);
  }

  return response;
}

// Only apply middleware to API routes
export const config = {
  matcher: "/api/:path*",
};
