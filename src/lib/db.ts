import { supabase } from './supabase';
import { APIListing } from './types';

// Convert database row to APIListing
function rowToListing(row: any): APIListing {
  return {
    id: row.id,
    name: row.name,
    description: row.description,
    endpoint: row.endpoint,
    category: row.category,
    capabilities: row.capabilities || [],
    pricing: row.pricing,
    provider: row.provider,
    metrics: {
      qualityScore: row.metrics?.qualityScore || 0,
      latencyMs: row.metrics?.latencyMs || 0,
      uptimePercent: row.metrics?.uptimePercent || 0,
      totalRequests: row.metrics?.totalRequests || 0,
      successRate: row.metrics?.successRate || 0,
      lastChecked: row.updated_at,
    },
    a2aCard: row.a2a_card,
    status: row.status,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

// Convert APIListing to database row
function listingToRow(listing: APIListing) {
  return {
    id: listing.id,
    name: listing.name,
    description: listing.description,
    endpoint: listing.endpoint,
    category: listing.category,
    capabilities: listing.capabilities,
    pricing: listing.pricing,
    provider: listing.provider,
    metrics: listing.metrics,
    a2a_card: listing.a2aCard,
    status: listing.status,
  };
}

export async function getAllAPIs(): Promise<APIListing[]> {
  const { data, error } = await supabase
    .from('api_listings')
    .select('*')
    .eq('status', 'active');

  if (error) {
    console.error('Error fetching APIs:', error);
    return [];
  }

  return (data || []).map(rowToListing);
}

export async function getAPIById(id: string): Promise<APIListing | null> {
  const { data, error } = await supabase
    .from('api_listings')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    console.error('Error fetching API:', error);
    return null;
  }

  return data ? rowToListing(data) : null;
}

export async function saveAPI(api: APIListing): Promise<void> {
  const row = listingToRow(api);

  const { error } = await supabase
    .from('api_listings')
    .upsert(row, { onConflict: 'id' });

  if (error) {
    console.error('Error saving API:', error);
    throw error;
  }
}

export async function deleteAPI(id: string): Promise<boolean> {
  const { error } = await supabase
    .from('api_listings')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting API:', error);
    return false;
  }

  return true;
}

export async function updateAPIMetrics(id: string, metrics: Partial<APIListing['metrics']>): Promise<void> {
  const { data: existing } = await supabase
    .from('api_listings')
    .select('metrics')
    .eq('id', id)
    .single();

  if (!existing) return;

  const newMetrics = { ...existing.metrics, ...metrics };

  const { error } = await supabase
    .from('api_listings')
    .update({
      metrics: newMetrics,
      updated_at: new Date().toISOString()
    })
    .eq('id', id);

  if (error) {
    console.error('Error updating metrics:', error);
  }
}

export async function searchAPIs(filters: {
  category?: string;
  capability?: string;
  minQuality?: number;
  maxPrice?: number;
}): Promise<APIListing[]> {
  let query = supabase
    .from('api_listings')
    .select('*')
    .eq('status', 'active');

  if (filters.category) {
    query = query.eq('category', filters.category);
  }

  if (filters.capability) {
    query = query.contains('capabilities', [filters.capability]);
  }

  const { data, error } = await query;

  if (error) {
    console.error('Error searching APIs:', error);
    return [];
  }

  let results = (data || []).map(rowToListing);

  // Client-side filtering for JSONB fields
  if (filters.minQuality !== undefined) {
    results = results.filter(api => api.metrics.qualityScore >= filters.minQuality!);
  }

  if (filters.maxPrice !== undefined) {
    results = results.filter(api => api.pricing.price <= filters.maxPrice!);
  }

  // Sort by quality score
  results.sort((a, b) => b.metrics.qualityScore - a.metrics.qualityScore);

  return results;
}

export async function getCategories(): Promise<{ name: string; count: number }[]> {
  const { data, error } = await supabase
    .from('api_listings')
    .select('category')
    .eq('status', 'active');

  if (error) {
    console.error('Error fetching categories:', error);
    return [];
  }

  const counts = new Map<string, number>();
  (data || []).forEach(row => {
    counts.set(row.category, (counts.get(row.category) || 0) + 1);
  });

  return Array.from(counts.entries()).map(([name, count]) => ({ name, count }));
}
