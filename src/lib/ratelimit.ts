// Simple in-memory rate limiter for serverless
// In production, use Redis or Upstash

const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

const WINDOW_MS = 60 * 1000; // 1 minute window
const MAX_REQUESTS = 30; // 30 requests per minute for registration
const MAX_REQUESTS_READ = 100; // 100 requests per minute for reads

export function checkRateLimit(
  identifier: string,
  isWrite: boolean = false
): { allowed: boolean; remaining: number; resetIn: number } {
  const now = Date.now();
  const key = `${identifier}-${isWrite ? "write" : "read"}`;
  const limit = isWrite ? MAX_REQUESTS : MAX_REQUESTS_READ;

  const existing = rateLimitMap.get(key);

  if (!existing || now > existing.resetTime) {
    // New window
    rateLimitMap.set(key, { count: 1, resetTime: now + WINDOW_MS });
    return { allowed: true, remaining: limit - 1, resetIn: WINDOW_MS };
  }

  if (existing.count >= limit) {
    return {
      allowed: false,
      remaining: 0,
      resetIn: existing.resetTime - now,
    };
  }

  existing.count++;
  return {
    allowed: true,
    remaining: limit - existing.count,
    resetIn: existing.resetTime - now,
  };
}

export function getClientIP(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    return forwarded.split(",")[0].trim();
  }
  const real = request.headers.get("x-real-ip");
  if (real) {
    return real;
  }
  return "unknown";
}
