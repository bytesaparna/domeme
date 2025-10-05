import { useQuery, useQueryClient } from '@tanstack/react-query';

export interface TrendingDomain {
  domain_id: string;
  total_score: number;
  trait_count: number;
  total_tweet_mentions: number;
}

export interface TrendingDomainsResponse {
  success: boolean;
  domains: TrendingDomain[];
  count: number;
  limit: number;
  hours: number;
  search?: string;
  message: string;
}

interface UseTrendingDomainsParams {
  limit?: number;
  hours?: number;
  search?: string;
  enabled?: boolean;
}

async function fetchTrendingDomains(params: UseTrendingDomainsParams): Promise<TrendingDomainsResponse> {
  const searchParams = new URLSearchParams();

  if (params.limit) searchParams.set('limit', params.limit.toString());
  if (params.hours) searchParams.set('hours', params.hours.toString());
  if (params.search) searchParams.set('search', params.search);

  const response = await fetch(`/api/domains/trending?${searchParams.toString()}`);

  if (!response.ok) {
    throw new Error(`Failed to fetch trending domains: ${response.statusText}`);
  }

  return response.json();
}

export function useTrendingDomains(params: UseTrendingDomainsParams = {}) {
  const {
    limit = 20,
    hours = 24,
    search,
    enabled = true
  } = params;

  return useQuery({
    queryKey: ['trending-domains', { limit, hours, search }],
    queryFn: () => fetchTrendingDomains({ limit, hours, search }),
    enabled,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
    refetchOnWindowFocus: false,
    refetchOnMount: true,
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    refetchInterval: 5 * 1000, // 5 seconds
  });
}

// Hook for getting trending domains with search
export function useTrendingDomainsSearch(searchQuery: string, limit?: number, hours?: number) {
  return useTrendingDomains({
    search: searchQuery,
    limit,
    hours,
    enabled: !!searchQuery && searchQuery.trim().length > 0
  });
}

// Hook for getting all trending domains (no search)
export function useAllTrendingDomains(limit?: number, hours?: number) {
  return useTrendingDomains({
    limit,
    hours,
    enabled: true
  });
}

// Hook for invalidating trending domains cache
export function useInvalidateTrendingDomains() {
  const queryClient = useQueryClient();

  return {
    invalidateAll: () => {
      queryClient.invalidateQueries({ queryKey: ['trending-domains'] });
    },
    invalidateSearch: (searchQuery: string) => {
      queryClient.invalidateQueries({
        queryKey: ['trending-domains', { search: searchQuery }]
      });
    },
    invalidateParams: (limit: number, hours: number, search?: string) => {
      queryClient.invalidateQueries({
        queryKey: ['trending-domains', { limit, hours, search }]
      });
    }
  };
}
