import { NextRequest, NextResponse } from 'next/server';
import { clickhouseService } from '../../../../backend/database/clickhouse';

// Enable caching for this route
export const revalidate = 60; // Revalidate every 1 minute
export const dynamic = 'force-dynamic';

// GET /api/domains/analyze
export async function GET(request: NextRequest) {
    try {
        console.log('📊 Fetching total domains analyzed count...');

        // Get total domains analyzed using the ClickHouse service
        const result = await clickhouseService.getTotalDomainsAnalyzed();

        const totalDomainsAnalyzed = result.data[0]?.total_domains_analyzed || 0;

        console.log(`✅ Found ${totalDomainsAnalyzed} total domains analyzed`);

        const response = NextResponse.json({
            success: true,
            total_domains_analyzed: totalDomainsAnalyzed,
            message: `Total domains analyzed: ${totalDomainsAnalyzed}`
        });

        // Add cache headers for server-side caching
        response.headers.set('Cache-Control', 'public, s-maxage=60, stale-while-revalidate=120');
        response.headers.set('CDN-Cache-Control', 'public, s-maxage=60');
        response.headers.set('Vercel-CDN-Cache-Control', 'public, s-maxage=60');

        return response;

    } catch (error) {
        console.error('❌ Error fetching total domains analyzed:', error);
        return NextResponse.json(
            { error: 'Failed to fetch total domains analyzed' },
            { status: 500 }
        );
    }
}
