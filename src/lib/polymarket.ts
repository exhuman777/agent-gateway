// Polymarket data fetching + Supabase storage
// This is the core data layer - fetches from Polymarket, stores in Supabase
// No LLM needed. No Mac Mini needed. Runs entirely on Vercel.

import { supabase } from './supabase';

const GAMMA_API = 'https://gamma-api.polymarket.com';

interface GammaMarket {
  id: string;
  question: string;
  slug: string;
  outcomePrices: string; // JSON string: ["0.35", "0.65"]
  volume: number;
  liquidity: number;
  endDate: string;
  active: boolean;
  closed: boolean;
  clobTokenIds: string;
  tags?: string[];
}

export interface StoredMarket {
  id: string;
  question: string;
  slug: string;
  category: string;
  end_date: string;
  active: boolean;
  closed: boolean;
  yes_price: number;
  no_price: number;
  volume: number;
  liquidity: number;
  tags: string[];
  first_seen: string;
  last_updated: string;
}

export interface Snapshot {
  market_id: string;
  yes_price: number;
  no_price: number;
  volume: number;
  liquidity: number;
  recorded_at: string;
}

// Fetch markets from Polymarket Gamma API
async function fetchGammaMarkets(endpoint: string): Promise<GammaMarket[]> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 15000);

  try {
    const res = await fetch(`${GAMMA_API}${endpoint}`, {
      signal: controller.signal,
      headers: { 'Accept': 'application/json' },
    });
    clearTimeout(timeoutId);
    if (!res.ok) return [];
    return await res.json();
  } catch {
    clearTimeout(timeoutId);
    return [];
  }
}

function parsePrices(outcomePrices: string): [number, number] {
  try {
    const prices = JSON.parse(outcomePrices);
    return [parseFloat(prices[0]) || 0, parseFloat(prices[1]) || 0];
  } catch {
    return [0, 0];
  }
}

function categorizeMarket(question: string): string {
  const q = question.toLowerCase();

  // Crypto
  if (/\b(bitcoin|ethereum|crypto|btc|eth|solana|sol|xrp|dogecoin|doge|defi|nft|blockchain|token|altcoin|binance|coinbase|memecoin)\b/.test(q)
    || q.includes('up or down'))
    return 'crypto';

  // Politics & Geopolitics
  if (/\b(trump|biden|president|election|congress|senate|democrat|republican|gop|governor|mayor|vote|poll|legislation|impeach|cabinet|scotus|supreme court|party|primary|inaugur|politician|political|government|minister|parliament|nato|ukraine|russia|china|israel|iran|war|ceasefire|sanction|tariff|executive order|youngkin|desantis|harris|vance|newsom|whitmer)\b/.test(q))
    return 'politics';

  // Sports
  if (/\b(nfl|nba|mlb|nhl|super bowl|world cup|championship|playoff|finals|mvp|soccer|football|basketball|baseball|hockey|tennis|golf|ufc|boxing|olympics|league|team|game|match|tournament|premier league|champions league|f1|formula|grand prix|world series)\b/.test(q))
    return 'sports';

  // Economics & Finance
  if (/\b(fed|federal reserve|inflation|gdp|rate|recession|stock|s&p|nasdaq|dow|treasury|bond|yield|unemployment|jobs|cpi|ppi|interest rate|fomc|housing|market cap|ipo|earnings|revenue|profit|deficit|debt ceiling|trade deficit|tariff)\b/.test(q))
    return 'economics';

  // Tech
  if (/\b(ai|openai|google|apple|tesla|microsoft|meta|nvidia|amazon|spacex|neuralink|chatgpt|gpt|claude|gemini|llm|artificial intelligence|robot|autonomous|self.driving|tech|silicon valley|startup|iphone|android|chip|semiconductor)\b/.test(q))
    return 'tech';

  // Culture & Entertainment
  if (/\b(movie|film|oscar|emmy|grammy|album|song|artist|celebrity|tiktok|youtube|twitter|x\.com|instagram|streamer|podcast|book|tv show|series|netflix|disney|spotify|concert|tour|viral|meme|influencer|elon musk|kanye|drake|taylor swift)\b/.test(q))
    return 'culture';

  // Science & Climate
  if (/\b(climate|temperature|hottest|weather|hurricane|earthquake|volcano|nasa|space|mars|moon|asteroid|pandemic|virus|covid|vaccine|fda|drug|disease|study|research|science|nature|carbon|emission|renewable|solar|wind|energy)\b/.test(q))
    return 'science';

  return 'other';
}

// Sync: fetch top markets from Polymarket and store in Supabase
export async function syncMarkets(): Promise<{ synced: number; errors: string[] }> {
  const errors: string[] = [];

  // Fetch trending by volume (top 50)
  const trending = await fetchGammaMarkets(
    '/markets?_limit=50&closed=false&active=true&archived=false&order=volume&ascending=false'
  );

  // Fetch recently created (catch new markets)
  const recent = await fetchGammaMarkets(
    '/markets?_limit=20&closed=false&active=true&archived=false&order=startDate&ascending=false'
  );

  // Also fetch recently closed (for historical completeness)
  const closed = await fetchGammaMarkets(
    '/markets?_limit=20&closed=true&order=endDate&ascending=false'
  );

  // Deduplicate
  const allMarketsMap = new Map<string, GammaMarket>();
  [...trending, ...recent, ...closed].forEach(m => allMarketsMap.set(m.id, m));
  const allMarkets = Array.from(allMarketsMap.values());

  let synced = 0;

  for (const market of allMarkets) {
    const [yesPrice, noPrice] = parsePrices(market.outcomePrices);

    // Upsert market
    const { error: marketError } = await supabase
      .from('polymarket_markets')
      .upsert({
        id: market.id,
        question: market.question,
        slug: market.slug,
        category: categorizeMarket(market.question),
        end_date: market.endDate,
        active: market.active,
        closed: market.closed,
        yes_price: yesPrice,
        no_price: noPrice,
        volume: market.volume || 0,
        liquidity: market.liquidity || 0,
        clob_token_ids: market.clobTokenIds ? JSON.parse(market.clobTokenIds) : null,
        tags: market.tags || [],
        last_updated: new Date().toISOString(),
      }, { onConflict: 'id' });

    if (marketError) {
      errors.push(`Market ${market.id}: ${marketError.message}`);
      continue;
    }

    // Record snapshot
    const { error: snapError } = await supabase
      .from('polymarket_snapshots')
      .insert({
        market_id: market.id,
        yes_price: yesPrice,
        no_price: noPrice,
        volume: market.volume || 0,
        liquidity: market.liquidity || 0,
      });

    if (snapError) {
      errors.push(`Snapshot ${market.id}: ${snapError.message}`);
    }

    synced++;
  }

  return { synced, errors };
}

// Query: get all tracked markets
export async function getMarkets(opts: {
  category?: string;
  active?: boolean;
  limit?: number;
  sortBy?: 'volume' | 'liquidity' | 'yes_price' | 'last_updated';
} = {}): Promise<StoredMarket[]> {
  let query = supabase
    .from('polymarket_markets')
    .select('*');

  if (opts.category) query = query.eq('category', opts.category);
  if (opts.active !== undefined) query = query.eq('active', opts.active);

  const sortField = opts.sortBy || 'volume';
  query = query.order(sortField, { ascending: false });
  query = query.limit(opts.limit || 50);

  const { data, error } = await query;
  if (error) return [];
  return data || [];
}

// Query: get single market with history
export async function getMarketBySlug(slug: string): Promise<{
  market: StoredMarket | null;
  history: Snapshot[];
}> {
  const { data: market } = await supabase
    .from('polymarket_markets')
    .select('*')
    .eq('slug', slug)
    .single();

  if (!market) return { market: null, history: [] };

  const { data: history } = await supabase
    .from('polymarket_snapshots')
    .select('*')
    .eq('market_id', market.id)
    .order('recorded_at', { ascending: true })
    .limit(500);

  return { market, history: history || [] };
}

// Query: get single market by ID
export async function getMarketById(marketId: string): Promise<{
  market: StoredMarket | null;
  history: Snapshot[];
}> {
  const { data: market } = await supabase
    .from('polymarket_markets')
    .select('*')
    .eq('id', marketId)
    .single();

  if (!market) return { market: null, history: [] };

  const { data: history } = await supabase
    .from('polymarket_snapshots')
    .select('*')
    .eq('market_id', market.id)
    .order('recorded_at', { ascending: true })
    .limit(500);

  return { market, history: history || [] };
}

// Query: search markets by text
export async function searchMarkets(query: string, limit = 20): Promise<StoredMarket[]> {
  const { data } = await supabase
    .from('polymarket_markets')
    .select('*')
    .ilike('question', `%${query}%`)
    .order('volume', { ascending: false })
    .limit(limit);

  return data || [];
}

// Query: trending markets (highest volume, active)
export async function getTrendingMarkets(limit = 10): Promise<StoredMarket[]> {
  const { data } = await supabase
    .from('polymarket_markets')
    .select('*')
    .eq('active', true)
    .eq('closed', false)
    .order('volume', { ascending: false })
    .limit(limit);

  return data || [];
}

// Query: get categories with counts
export async function getCategories(): Promise<{ category: string; count: number }[]> {
  const { data } = await supabase
    .from('polymarket_markets')
    .select('category')
    .eq('active', true);

  if (!data) return [];

  const counts = new Map<string, number>();
  data.forEach(row => {
    counts.set(row.category, (counts.get(row.category) || 0) + 1);
  });

  return Array.from(counts.entries())
    .map(([category, count]) => ({ category, count }))
    .sort((a, b) => b.count - a.count);
}

// Query: market stats summary
export async function getStats(): Promise<{
  total_markets: number;
  active_markets: number;
  total_volume: number;
  categories: { category: string; count: number }[];
  last_sync: string | null;
}> {
  const { count: total } = await supabase
    .from('polymarket_markets')
    .select('*', { count: 'exact', head: true });

  const { count: active } = await supabase
    .from('polymarket_markets')
    .select('*', { count: 'exact', head: true })
    .eq('active', true)
    .eq('closed', false);

  const { data: volumeData } = await supabase
    .from('polymarket_markets')
    .select('volume')
    .eq('active', true);

  const totalVolume = (volumeData || []).reduce((sum, m) => sum + (m.volume || 0), 0);

  const categories = await getCategories();

  const { data: lastSnap } = await supabase
    .from('polymarket_snapshots')
    .select('recorded_at')
    .order('recorded_at', { ascending: false })
    .limit(1);

  return {
    total_markets: total || 0,
    active_markets: active || 0,
    total_volume: totalVolume,
    categories,
    last_sync: lastSnap?.[0]?.recorded_at || null,
  };
}
