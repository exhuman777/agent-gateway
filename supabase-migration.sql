-- Agent Gateway: Polymarket Historical Data Tables
-- Run this in Supabase SQL Editor (Dashboard > SQL Editor > New Query)

-- Markets table: stores all tracked Polymarket markets
CREATE TABLE IF NOT EXISTS polymarket_markets (
  id TEXT PRIMARY KEY,
  question TEXT NOT NULL,
  slug TEXT,
  category TEXT DEFAULT 'other',
  end_date TIMESTAMPTZ,
  active BOOLEAN DEFAULT true,
  closed BOOLEAN DEFAULT false,
  yes_price NUMERIC(6,4) DEFAULT 0,
  no_price NUMERIC(6,4) DEFAULT 0,
  volume NUMERIC DEFAULT 0,
  liquidity NUMERIC DEFAULT 0,
  clob_token_ids JSONB,
  tags TEXT[] DEFAULT '{}',
  first_seen TIMESTAMPTZ DEFAULT NOW(),
  last_updated TIMESTAMPTZ DEFAULT NOW()
);

-- Snapshots: price/volume history (one row per market per sync)
CREATE TABLE IF NOT EXISTS polymarket_snapshots (
  id BIGSERIAL PRIMARY KEY,
  market_id TEXT NOT NULL REFERENCES polymarket_markets(id),
  yes_price NUMERIC(6,4),
  no_price NUMERIC(6,4),
  volume NUMERIC,
  liquidity NUMERIC,
  recorded_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for fast lookups
CREATE INDEX IF NOT EXISTS idx_snapshots_market_id ON polymarket_snapshots(market_id);
CREATE INDEX IF NOT EXISTS idx_snapshots_recorded_at ON polymarket_snapshots(recorded_at DESC);
CREATE INDEX IF NOT EXISTS idx_markets_active ON polymarket_markets(active) WHERE active = true;
CREATE INDEX IF NOT EXISTS idx_markets_volume ON polymarket_markets(volume DESC);
CREATE INDEX IF NOT EXISTS idx_markets_slug ON polymarket_markets(slug);

-- Enable RLS
ALTER TABLE polymarket_markets ENABLE ROW LEVEL SECURITY;
ALTER TABLE polymarket_snapshots ENABLE ROW LEVEL SECURITY;

-- Allow public read access (agents need to read)
CREATE POLICY "Public read markets" ON polymarket_markets FOR SELECT USING (true);
CREATE POLICY "Public read snapshots" ON polymarket_snapshots FOR SELECT USING (true);

-- Allow insert/update with anon key (for cron sync)
CREATE POLICY "Anon insert markets" ON polymarket_markets FOR INSERT WITH CHECK (true);
CREATE POLICY "Anon update markets" ON polymarket_markets FOR UPDATE USING (true);
CREATE POLICY "Anon insert snapshots" ON polymarket_snapshots FOR INSERT WITH CHECK (true);

-- Cleanup old snapshots (keep 30 days)
-- Run this periodically or set up a Supabase edge function
-- DELETE FROM polymarket_snapshots WHERE recorded_at < NOW() - INTERVAL '30 days';
