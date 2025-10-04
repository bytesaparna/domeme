import { NextRequest, NextResponse } from 'next/server';
import { clickhouseService } from '../../../../backend/database/clickhouse';
import { unstable_cache } from 'next/cache';

// Enable caching for this route with parameter-based cache keys
export const revalidate = 3; // Revalidate every 3 seconds
export const dynamic = 'force-dynamic'; // Allow dynamic rendering but with caching

// Cached function for fetching trending domains
const getCachedTrendingDomains = unstable_cache(
    async (limit: number, hours: number, searchQuery?: string) => {
        console.log(`📊 Fetching trending domains (limit: ${limit}, hours: ${hours}${searchQuery ? `, search: "${searchQuery}"` : ''})...`);
        
        const trendingDomains = await clickhouseService.getTrendingDomains(limit, hours, searchQuery);
        console.log(`✅ Found ${trendingDomains.data.length} trending domains`);
        
        return {
            success: true,
            domains: trendingDomains.data,
            count: trendingDomains.data.length,
            limit,
            hours,
            search: searchQuery,
            message: `Retrieved ${trendingDomains.data.length} trending domains from the last ${hours} hours${searchQuery ? ` matching "${searchQuery}"` : ''}`
        };
    },
    ['trending-domains'],
    {
        revalidate: 3, // 3 seconds
        tags: ['trending-domains']
    }
);

// GET /api/domains/trending?limit=20&hours=24&search=domain
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const limit = parseInt(searchParams.get('limit') || '20', 10);
        const hours = parseInt(searchParams.get('hours') || '24', 10);
        const searchQuery = searchParams.get('search') || undefined;

        // Use cached function with parameter-based caching
        const result = await getCachedTrendingDomains(limit, hours, searchQuery);

        const response = NextResponse.json(result);

        // Add cache headers for server-side caching
        response.headers.set('Cache-Control', 'public, s-maxage=300, stale-while-revalidate=600');
        response.headers.set('CDN-Cache-Control', 'public, s-maxage=300');
        response.headers.set('Vercel-CDN-Cache-Control', 'public, s-maxage=300');

        return response;

    } catch (error) {
        console.error('❌ Error fetching trending domains:', error);
        return NextResponse.json(
            { error: 'Failed to fetch trending domains' },
            { status: 500 }
        );
    }
}
