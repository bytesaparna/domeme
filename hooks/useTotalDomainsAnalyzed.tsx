import { useQuery } from '@tanstack/react-query';

export interface TotalDomainsAnalyzedResponse {
  success: boolean;
  total_domains_analyzed: number;
  message: string;
}

async function fetchTotalDomainsAnalyzed(): Promise<TotalDomainsAnalyzedResponse> {
  const response = await fetch('/api/domains/analyze');
  
  if (!response.ok) {
    throw new Error(`Failed to fetch total domains analyzed: ${response.statusText}`);
  }

  return response.json();
}

export function useTotalDomainsAnalyzed() {
  return useQuery({
    queryKey: ['total-domains-analyzed'],
    queryFn: fetchTotalDomainsAnalyzed,
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 5 * 60 * 1000, // 5 minutes (formerly cacheTime)
    refetchOnWindowFocus: false,
    refetchOnMount: true,
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
}

// Hook for getting total domains analyzed with custom options
export function useTotalDomainsAnalyzedWithOptions(options?: {
  enabled?: boolean;
  staleTime?: number;
  refetchInterval?: number;
}) {
  const {
    enabled = true,
    staleTime = 2 * 60 * 1000, // 2 minutes
    refetchInterval
  } = options || {};

  return useQuery({
    queryKey: ['total-domains-analyzed'],
    queryFn: fetchTotalDomainsAnalyzed,
    enabled,
    staleTime,
    gcTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
    refetchOnMount: true,
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    ...(refetchInterval && { refetchInterval }),
  });
}
