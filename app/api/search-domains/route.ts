import { Subgraph } from '@/lib/graphql.ts';
import { NextRequest, NextResponse } from 'next/server';

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const name = searchParams.get('name');
        const skip = parseInt(searchParams.get('skip') || '0');
        const take = parseInt(searchParams.get('take') || '10');

        if (!name) {
            return NextResponse.json(
                { error: 'Name parameter is required' },
                { status: 400 }
            );
        }

        // Use the existing SubgraphService class
        const subgraphService = new Subgraph();

        // Search domains using the existing method
        const domains = await subgraphService.searchDomains(skip, take, name);

        return NextResponse.json({
            domains,
            count: domains.length,
            searchTerm: name,
            pagination: {
                skip,
                take,
                hasMore: domains.length === take
            }
        });

    } catch (error) {
        console.error('Error searching domains:', error);
        return NextResponse.json(
            { error: 'Failed to search domains' },
            { status: 500 }
        );
    }
}