import { NextRequest, NextResponse } from 'next/server';
import { clickhouseService } from '../../../../../backend/database/clickhouse';
import { Subgraph } from '../../../../../lib/graphql.ts';


export const dynamic = 'force-dynamic';
export const maxDuration = 60;


// Vercel Cron Job - runs every 30 minutes to populate new domains
export async function GET(request: NextRequest) {
    // Verify this is a cron request (Vercel adds this header)
    const authHeader = request.headers.get('authorization');
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    console.log('🕐 Starting cron job: Domain population...');

    const subgraphService = new Subgraph();

    let fetchMore = true;
    let skip = 0;

    // Fetch recent 100 domains. TODO: Replace this with polling API to get new domains directly from webhook.
    while (fetchMore && skip < 5000) {
        const items = await subgraphService.searchDomains(skip, 100);
        await clickhouseService.insertManyDomains(items.items.map(domain => ({ name: domain.name })));
        fetchMore = items.hasNextPage;
        skip += 100;
    }

    return NextResponse.json({
        success: true,
        message: `${skip} domains populated successfully`,
        timestamp: new Date().toISOString()
    });
}
