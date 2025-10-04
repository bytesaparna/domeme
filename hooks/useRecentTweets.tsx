import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query';

export interface TweetTrait {
  trait: string;
  score: number;
}

export interface RecentTweet {
  tweet_id: string;
  content: string;
  created_at: string;
  traits: TweetTrait[];
}

export interface RecentTweetsResponse {
  success: boolean;
  tweets: RecentTweet[];
  count: number;
  hours: number;
  message: string;
}

export interface CreateTweetRequest {
  content: string;
}

export interface CreateTweetResponse {
  success: boolean;
  tweetId: string;
  content: string;
  traits: Record<string, number>;
  message: string;
}

interface UseRecentTweetsParams {
  hours?: number;
  enabled?: boolean;
}

async function fetchRecentTweets(params: UseRecentTweetsParams): Promise<RecentTweetsResponse> {
  const searchParams = new URLSearchParams();

  if (params.hours) searchParams.set('hours', params.hours.toString());

  const response = await fetch(`/api/tweet?${searchParams.toString()}`);

  if (!response.ok) {
    throw new Error(`Failed to fetch recent tweets: ${response.statusText}`);
  }

  return response.json();
}

async function createTweet(tweetData: CreateTweetRequest): Promise<CreateTweetResponse> {
  const response = await fetch('/api/tweet', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(tweetData),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || `Failed to create tweet: ${response.statusText}`);
  }

  return response.json();
}

export function useRecentTweets(params: UseRecentTweetsParams = {}) {
  const {
    hours = 24,
    enabled = true
  } = params;

  return useQuery({
    queryKey: ['recent-tweets', { hours }],
    queryFn: () => fetchRecentTweets({ hours }),
    enabled,
    staleTime: 2 * 60 * 1000, // 2 minutes (tweets change frequently)
    gcTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: true,
    refetchOnMount: true,
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
}

// Hook for getting recent tweets with specific time range
export function useRecentTweetsByHours(hours: number) {
  return useRecentTweets({
    hours,
    enabled: true
  });
}

// Hook for creating new tweets
export function useCreateTweet() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createTweet,
    onSuccess: (data) => {
      // Invalidate and refetch recent tweets after successful creation
      queryClient.invalidateQueries({ queryKey: ['recent-tweets'] });

      // Also invalidate trending domains since new tweets might affect trends
      queryClient.invalidateQueries({ queryKey: ['trending-domains'] });

      console.log('✅ Tweet created successfully:', data);
    },
    onError: (error) => {
      console.error('❌ Failed to create tweet:', error);
    },
  });
}

// Hook for invalidating recent tweets cache
export function useInvalidateRecentTweets() {
  const queryClient = useQueryClient();

  return {
    invalidateAll: () => {
      queryClient.invalidateQueries({ queryKey: ['recent-tweets'] });
    },
    invalidateByHours: (hours: number) => {
      queryClient.invalidateQueries({
        queryKey: ['recent-tweets', { hours }]
      });
    }
  };
}
