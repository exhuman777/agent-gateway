// APIPOOL Intelligence Layer
// 4 pillars of Smart API routing:
// 1. Self-Learning Routing — scores adapt from real usage patterns
// 2. Predictive Orchestration — detect degradation trends, demote before failure
// 3. Anomaly Detection — flag unusual patterns in provider behavior
// 4. Contextual Understanding — parse natural language queries into capabilities

import { supabase } from './supabase';

// ============================================================
// 1. SELF-LEARNING ROUTING
// Tracks routing decisions + outcomes. Adjusts provider scores
// based on actual agent satisfaction, not just health checks.
// Formula: effective_score = base_quality * learning_multiplier
// ============================================================

export interface RoutingEvent {
  provider_id: string;
  capability: string;
  chosen: boolean;       // was this provider selected?
  response_ok: boolean;  // did the agent report success?
  latency_ms: number;
  timestamp: string;
}

// Record a routing decision for learning
export async function recordRoutingEvent(event: RoutingEvent): Promise<void> {
  await supabase.from('routing_events').insert({
    provider_id: event.provider_id,
    capability: event.capability,
    chosen: event.chosen,
    response_ok: event.response_ok,
    latency_ms: event.latency_ms,
    created_at: event.timestamp,
  });
}

// Calculate learning multiplier from historical routing success
// Range: 0.8 (poor history) to 1.2 (excellent history)
export async function getLearningMultiplier(providerId: string): Promise<number> {
  const { data } = await supabase
    .from('routing_events')
    .select('response_ok, latency_ms')
    .eq('provider_id', providerId)
    .eq('chosen', true)
    .order('created_at', { ascending: false })
    .limit(50);

  if (!data || data.length < 5) return 1.0; // not enough data yet

  const successRate = data.filter(e => e.response_ok).length / data.length;
  const avgLatency = data.reduce((sum, e) => sum + e.latency_ms, 0) / data.length;

  // Reward consistent success, penalize flaky providers
  // successRate: 1.0 → +0.15, 0.5 → -0.05, 0.0 → -0.20
  const successBonus = (successRate - 0.7) * 0.5;

  // Reward fast responses: <500ms → +0.05, >3000ms → -0.05
  const latencyBonus = Math.max(-0.05, Math.min(0.05, (1500 - avgLatency) / 20000));

  return Math.max(0.8, Math.min(1.2, 1.0 + successBonus + latencyBonus));
}

// ============================================================
// 2. PREDICTIVE ORCHESTRATION
// Analyzes health check trends. If latency is trending up or
// success rate is trending down, proactively lower the score
// BEFORE the provider actually fails.
// ============================================================

export interface HealthTrend {
  provider_id: string;
  latency_trend: 'improving' | 'stable' | 'degrading';
  success_trend: 'improving' | 'stable' | 'degrading';
  prediction: 'healthy' | 'at_risk' | 'failing';
  confidence: number;      // 0-1
  predicted_score: number;  // predicted quality score in next check
}

// Analyze recent health checks to predict future performance
export async function predictProviderHealth(providerId: string): Promise<HealthTrend> {
  const { data: events } = await supabase
    .from('health_events')
    .select('*')
    .eq('provider_id', providerId)
    .order('checked_at', { ascending: false })
    .limit(10);

  const defaultTrend: HealthTrend = {
    provider_id: providerId,
    latency_trend: 'stable',
    success_trend: 'stable',
    prediction: 'healthy',
    confidence: 0,
    predicted_score: 0,
  };

  if (!events || events.length < 3) return defaultTrend;

  // Split into recent (last 3) vs older (rest)
  const recent = events.slice(0, 3);
  const older = events.slice(3);

  if (older.length === 0) return defaultTrend;

  // Latency trend: compare recent avg to older avg
  const recentLatency = recent.reduce((s, e) => s + e.latency_ms, 0) / recent.length;
  const olderLatency = older.reduce((s, e) => s + e.latency_ms, 0) / older.length;
  const latencyChange = (recentLatency - olderLatency) / Math.max(olderLatency, 1);

  let latencyTrend: HealthTrend['latency_trend'] = 'stable';
  if (latencyChange > 0.2) latencyTrend = 'degrading';
  else if (latencyChange < -0.2) latencyTrend = 'improving';

  // Success trend: compare recent success rate to older
  const recentSuccess = recent.filter(e => e.is_up).length / recent.length;
  const olderSuccess = older.filter(e => e.is_up).length / older.length;
  const successChange = recentSuccess - olderSuccess;

  let successTrend: HealthTrend['success_trend'] = 'stable';
  if (successChange < -0.15) successTrend = 'degrading';
  else if (successChange > 0.15) successTrend = 'improving';

  // Prediction
  let prediction: HealthTrend['prediction'] = 'healthy';
  if (latencyTrend === 'degrading' && successTrend === 'degrading') prediction = 'failing';
  else if (latencyTrend === 'degrading' || successTrend === 'degrading') prediction = 'at_risk';

  // Confidence based on data points
  const confidence = Math.min(1, events.length / 10);

  // Predicted score: extrapolate current trend
  const currentScore = events[0]?.quality_score || 0;
  let predicted = currentScore;
  if (prediction === 'at_risk') predicted = currentScore * 0.9;
  if (prediction === 'failing') predicted = currentScore * 0.7;

  return {
    provider_id: providerId,
    latency_trend: latencyTrend,
    success_trend: successTrend,
    prediction,
    confidence,
    predicted_score: Math.round(predicted * 100) / 100,
  };
}

// Get predictive multiplier: 1.0 = healthy, <1.0 = at risk
export async function getPredictiveMultiplier(providerId: string): Promise<number> {
  const trend = await predictProviderHealth(providerId);
  if (trend.confidence < 0.3) return 1.0; // not enough data

  switch (trend.prediction) {
    case 'healthy': return 1.0;
    case 'at_risk': return 0.9;
    case 'failing': return 0.7;
    default: return 1.0;
  }
}

// Record a health check event for trend analysis
export async function recordHealthEvent(event: {
  provider_id: string;
  is_up: boolean;
  latency_ms: number;
  quality_score: number;
  status_code?: number;
}): Promise<void> {
  await supabase.from('health_events').insert({
    provider_id: event.provider_id,
    is_up: event.is_up,
    latency_ms: event.latency_ms,
    quality_score: event.quality_score,
    status_code: event.status_code || 0,
    checked_at: new Date().toISOString(),
  });
}

// ============================================================
// 3. ANOMALY DETECTION
// Flags unusual behavior: latency spikes, error bursts,
// sudden traffic changes, response format changes.
// Returns anomaly alerts per provider.
// ============================================================

export interface Anomaly {
  provider_id: string;
  type: 'latency_spike' | 'error_burst' | 'response_change' | 'downtime';
  severity: 'low' | 'medium' | 'high';
  message: string;
  detected_at: string;
  value: number;
  baseline: number;
}

// Detect anomalies for a provider based on recent vs baseline behavior
export async function detectAnomalies(providerId: string): Promise<Anomaly[]> {
  const anomalies: Anomaly[] = [];
  const now = new Date().toISOString();

  const { data: recent } = await supabase
    .from('health_events')
    .select('*')
    .eq('provider_id', providerId)
    .order('checked_at', { ascending: false })
    .limit(20);

  if (!recent || recent.length < 5) return anomalies;

  const last3 = recent.slice(0, 3);
  const baseline = recent.slice(3);

  // 1. Latency spike: recent avg > 2x baseline avg
  const recentAvgLat = last3.reduce((s, e) => s + e.latency_ms, 0) / last3.length;
  const baselineAvgLat = baseline.reduce((s, e) => s + e.latency_ms, 0) / baseline.length;

  if (baselineAvgLat > 0 && recentAvgLat > baselineAvgLat * 2) {
    anomalies.push({
      provider_id: providerId,
      type: 'latency_spike',
      severity: recentAvgLat > baselineAvgLat * 3 ? 'high' : 'medium',
      message: `Latency spiked ${Math.round(recentAvgLat)}ms (baseline: ${Math.round(baselineAvgLat)}ms)`,
      detected_at: now,
      value: Math.round(recentAvgLat),
      baseline: Math.round(baselineAvgLat),
    });
  }

  // 2. Error burst: 2+ failures in last 3 checks
  const recentFailures = last3.filter(e => !e.is_up).length;
  const baselineFailRate = baseline.filter(e => !e.is_up).length / baseline.length;

  if (recentFailures >= 2) {
    anomalies.push({
      provider_id: providerId,
      type: 'error_burst',
      severity: recentFailures === 3 ? 'high' : 'medium',
      message: `${recentFailures}/3 recent checks failed (baseline fail rate: ${(baselineFailRate * 100).toFixed(0)}%)`,
      detected_at: now,
      value: recentFailures,
      baseline: Math.round(baselineFailRate * 3),
    });
  }

  // 3. Downtime: all 3 recent checks failed
  if (recentFailures === 3) {
    anomalies.push({
      provider_id: providerId,
      type: 'downtime',
      severity: 'high',
      message: `Provider appears down — 3 consecutive failures`,
      detected_at: now,
      value: 0,
      baseline: baselineAvgLat,
    });
  }

  return anomalies;
}

// Get anomaly-based score penalty: 1.0 = clean, <1.0 = anomalies found
export async function getAnomalyMultiplier(providerId: string): Promise<number> {
  const anomalies = await detectAnomalies(providerId);
  if (anomalies.length === 0) return 1.0;

  const highCount = anomalies.filter(a => a.severity === 'high').length;
  const medCount = anomalies.filter(a => a.severity === 'medium').length;

  // High anomaly = -15%, medium = -5%
  const penalty = highCount * 0.15 + medCount * 0.05;
  return Math.max(0.5, 1.0 - penalty);
}

// ============================================================
// 4. CONTEXTUAL UNDERSTANDING
// Parses natural language queries into structured capabilities.
// No LLM needed — keyword extraction + capability mapping.
// Agent can say "I need crypto market prices" instead of
// knowing the exact capability string "prediction-markets".
// ============================================================

// Capability keyword map — maps natural language to capabilities
const CAPABILITY_MAP: Record<string, string[]> = {
  'prediction-markets': [
    'prediction', 'predict', 'odds', 'betting', 'polymarket', 'forecast',
    'probability', 'will', 'chance', 'likelihood', 'outcome',
  ],
  'market-data': [
    'market', 'price', 'volume', 'trading', 'data', 'ticker',
    'historical', 'chart', 'trend', 'trending', 'analytics',
  ],
  'research': [
    'research', 'investigate', 'analyze', 'study', 'deep dive',
    'comprehensive', 'report', 'findings', 'explore', 'understand',
  ],
  'analysis': [
    'analysis', 'analyze', 'evaluate', 'assess', 'compare',
    'breakdown', 'insight', 'intelligence', 'interpret',
  ],
  'summarization': [
    'summarize', 'summary', 'brief', 'briefing', 'tldr',
    'overview', 'digest', 'recap', 'condensed',
  ],
  'market-analysis': [
    'arbitrage', 'opportunity', 'spread', 'inefficiency',
    'alpha', 'signal', 'strategy',
  ],
  'price-history': [
    'history', 'historical', 'past', 'timeline', 'change',
    'movement', 'trajectory', 'over time',
  ],
  'crypto': [
    'crypto', 'bitcoin', 'ethereum', 'btc', 'eth', 'blockchain',
    'defi', 'token', 'coin', 'web3',
  ],
  'news': [
    'news', 'latest', 'update', 'current', 'today', 'headline',
    'breaking', 'recent', 'event',
  ],
};

export interface ParsedQuery {
  original: string;
  capabilities: string[];         // matched capability strings
  confidence: number;              // 0-1 how confident the match is
  tokens: string[];                // extracted keywords
  suggested_capability: string;    // best single match
}

// Parse a natural language query into capabilities
export function parseNaturalQuery(query: string): ParsedQuery {
  const normalized = query.toLowerCase().trim();
  const tokens = normalized.split(/\s+/).filter(t => t.length > 2);

  const scores: Record<string, number> = {};

  for (const [capability, keywords] of Object.entries(CAPABILITY_MAP)) {
    let score = 0;
    for (const keyword of keywords) {
      if (normalized.includes(keyword)) {
        // Exact word match scores higher
        score += keyword.split(' ').length > 1 ? 2 : 1;
      }
    }
    if (score > 0) scores[capability] = score;
  }

  // Sort by score
  const ranked = Object.entries(scores)
    .sort(([, a], [, b]) => b - a);

  const capabilities = ranked.map(([cap]) => cap);
  const topScore = ranked[0]?.[1] || 0;

  // Confidence: based on number of keyword hits vs query length
  const totalHits = Object.values(scores).reduce((s, v) => s + v, 0);
  const confidence = Math.min(1, totalHits / Math.max(tokens.length, 1) * 0.5);

  return {
    original: query,
    capabilities,
    confidence,
    tokens,
    suggested_capability: capabilities[0] || 'research', // fallback
  };
}

// ============================================================
// INTELLIGENT SCORE — combines all 4 pillars
// This is the master scoring function that routing uses.
// ============================================================

export interface IntelligentScore {
  provider_id: string;
  base_score: number;            // from health checks (Q formula)
  learning_multiplier: number;   // from routing history
  predictive_multiplier: number; // from trend analysis
  anomaly_multiplier: number;    // from anomaly detection
  effective_score: number;       // final score used for routing
  intelligence: {
    data_points: number;
    prediction: string;
    anomalies: number;
  };
}

// Calculate the full intelligent score for a provider
export async function getIntelligentScore(
  providerId: string,
  baseScore: number
): Promise<IntelligentScore> {
  // Run all 3 scoring pillars in parallel
  const [learning, predictive, anomaly] = await Promise.all([
    getLearningMultiplier(providerId),
    getPredictiveMultiplier(providerId),
    getAnomalyMultiplier(providerId),
  ]);

  const effective = Math.round(
    baseScore * learning * predictive * anomaly * 100
  ) / 100;

  // Get data for intelligence report
  const { count: dataPoints } = await supabase
    .from('health_events')
    .select('*', { count: 'exact', head: true })
    .eq('provider_id', providerId);

  const trend = await predictProviderHealth(providerId);
  const anomalies = await detectAnomalies(providerId);

  return {
    provider_id: providerId,
    base_score: baseScore,
    learning_multiplier: Math.round(learning * 1000) / 1000,
    predictive_multiplier: Math.round(predictive * 1000) / 1000,
    anomaly_multiplier: Math.round(anomaly * 1000) / 1000,
    effective_score: Math.max(0, Math.min(5, effective)),
    intelligence: {
      data_points: dataPoints || 0,
      prediction: trend.prediction,
      anomalies: anomalies.length,
    },
  };
}
