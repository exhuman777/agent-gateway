-- APIPOOL x402 Brave Search — Supabase Migration
-- Run this in Supabase SQL Editor (https://supabase.com/dashboard)

-- 1. API Usage Log — tracks every paid/free API call
CREATE TABLE IF NOT EXISTS api_usage (
  id BIGSERIAL PRIMARY KEY,
  endpoint TEXT NOT NULL,
  caller_ip TEXT NOT NULL,
  caller_wallet TEXT,
  payment_tx TEXT,
  payment_amount NUMERIC(10, 6),
  query TEXT NOT NULL,
  latency_ms INTEGER NOT NULL,
  is_free_tier BOOLEAN NOT NULL DEFAULT true,
  status TEXT NOT NULL DEFAULT 'success',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Index for analytics queries
CREATE INDEX IF NOT EXISTS idx_api_usage_endpoint ON api_usage(endpoint);
CREATE INDEX IF NOT EXISTS idx_api_usage_created ON api_usage(created_at);
CREATE INDEX IF NOT EXISTS idx_api_usage_ip ON api_usage(caller_ip);

-- 2. Free Tier Usage — daily counter per IP per endpoint
CREATE TABLE IF NOT EXISTS free_tier_usage (
  id BIGSERIAL PRIMARY KEY,
  caller_ip TEXT NOT NULL,
  endpoint TEXT NOT NULL,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  call_count INTEGER NOT NULL DEFAULT 0,
  UNIQUE(caller_ip, endpoint, date)
);

-- Index for lookups
CREATE INDEX IF NOT EXISTS idx_free_tier_lookup ON free_tier_usage(caller_ip, endpoint, date);

-- 3. RPC function for atomic increment (avoids race conditions)
CREATE OR REPLACE FUNCTION increment_free_tier(
  p_caller_ip TEXT,
  p_endpoint TEXT,
  p_date DATE
) RETURNS void AS $$
BEGIN
  INSERT INTO free_tier_usage (caller_ip, endpoint, date, call_count)
  VALUES (p_caller_ip, p_endpoint, p_date, 1)
  ON CONFLICT (caller_ip, endpoint, date)
  DO UPDATE SET call_count = free_tier_usage.call_count + 1;
END;
$$ LANGUAGE plpgsql;

-- 4. Auto-cleanup old free tier records (older than 7 days)
-- Run this periodically or set up a cron
-- DELETE FROM free_tier_usage WHERE date < CURRENT_DATE - INTERVAL '7 days';

-- 5. Register Brave Search in api_listings
INSERT INTO api_listings (
  id, name, description, endpoint, category, capabilities, pricing, provider, metrics, status, "createdAt", "updatedAt"
) VALUES (
  'rufus-brave-search',
  'Brave Web Search (x402)',
  'Search the web using Brave Search API. First 10 calls/day free per IP, then $0.005 USDC per call via x402 micropayments on Base.',
  '/api/v1/search',
  'research',
  '["web-search", "research", "news", "information-retrieval"]',
  '{"model": "x402", "price": 0.005, "currency": "USDC", "freeQuota": 10}',
  '{"id": "rufus", "name": "Rufus #22742", "wallet": "0x3058ff5B62E67a27460904783aFd670fF70c6A4A", "erc8004Id": 22742, "verified": true}',
  '{"qualityScore": 4.8, "latencyMs": 300, "uptimePercent": 99.9, "totalRequests": 0, "successRate": 1.0, "lastChecked": "2026-02-06T00:00:00Z"}',
  'active',
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  pricing = EXCLUDED.pricing,
  "updatedAt" = NOW();
