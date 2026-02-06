-- APIPOOL Intelligence Layer — Supabase Migration
-- Run this in Supabase SQL Editor

-- 1. Routing Events — tracks every routing decision for self-learning
CREATE TABLE IF NOT EXISTS routing_events (
  id BIGSERIAL PRIMARY KEY,
  provider_id TEXT NOT NULL,
  capability TEXT NOT NULL,
  chosen BOOLEAN NOT NULL DEFAULT false,
  response_ok BOOLEAN NOT NULL DEFAULT true,
  latency_ms INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_routing_events_provider ON routing_events(provider_id, created_at DESC);
CREATE INDEX idx_routing_events_capability ON routing_events(capability, created_at DESC);

-- 2. Health Events — tracks every health check for predictive orchestration
CREATE TABLE IF NOT EXISTS health_events (
  id BIGSERIAL PRIMARY KEY,
  provider_id TEXT NOT NULL,
  is_up BOOLEAN NOT NULL DEFAULT true,
  latency_ms INTEGER NOT NULL DEFAULT 0,
  quality_score NUMERIC(4,2) NOT NULL DEFAULT 0,
  status_code INTEGER NOT NULL DEFAULT 0,
  checked_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_health_events_provider ON health_events(provider_id, checked_at DESC);

-- 3. Anomaly Log — records detected anomalies
CREATE TABLE IF NOT EXISTS anomaly_log (
  id BIGSERIAL PRIMARY KEY,
  provider_id TEXT NOT NULL,
  anomaly_type TEXT NOT NULL, -- latency_spike, error_burst, response_change, downtime
  severity TEXT NOT NULL,      -- low, medium, high
  message TEXT NOT NULL,
  value NUMERIC NOT NULL DEFAULT 0,
  baseline NUMERIC NOT NULL DEFAULT 0,
  detected_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_anomaly_log_provider ON anomaly_log(provider_id, detected_at DESC);
CREATE INDEX idx_anomaly_log_severity ON anomaly_log(severity, detected_at DESC);

-- Enable RLS
ALTER TABLE routing_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE health_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE anomaly_log ENABLE ROW LEVEL SECURITY;

-- Public read access
CREATE POLICY "routing_events_read" ON routing_events FOR SELECT TO anon USING (true);
CREATE POLICY "health_events_read" ON health_events FOR SELECT TO anon USING (true);
CREATE POLICY "anomaly_log_read" ON anomaly_log FOR SELECT TO anon USING (true);

-- Write access for the app
CREATE POLICY "routing_events_write" ON routing_events FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "health_events_write" ON health_events FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "anomaly_log_write" ON anomaly_log FOR INSERT TO anon WITH CHECK (true);
