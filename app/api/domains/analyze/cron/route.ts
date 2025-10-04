
import { NextRequest, NextResponse } from 'next/server';
import { clickhouseService } from '../../../../../backend/database/clickhouse';
import OpenAI from 'openai';

export const dynamic = 'force-dynamic';

// Initialize OpenAI client
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

interface DomainTraits {
    [trait: string]: number;
}

interface DomainAnalysisResult {
    domain: string;
    traits: DomainTraits;
}

// Analyze domains batch with AI
async function analyzeDomainsBatch(domainNames: string[]): Promise<DomainAnalysisResult[]> {
    const prompt = `Analyze these domain names and assign trait scores (0-100) for each domain. 
        For each domain, identify the most relevant traits and assign scores based on meaning, associations, and potential use cases.
        
        Domain names: ${domainNames.join(', ')}
        
        Return ONLY a JSON array where each object has:
        - "domain": the domain name
        - "traits": an object with trait names as keys and scores (0-100) as values
        
        Example format:
        [
          {
            "domain": "pepe.io",
            "traits": {
              "animal": 90,
              "meme": 95,
              "cute": 85,
              "frog": 100,
              "crypto": 0,
              "tech": 0
            }
          },
          {
            "domain": "doge.com", 
            "traits": {
              "animal": 95,
              "dog": 100,
              "meme": 90,
              "cute": 90,
              "crypto": 80
            }
          }
        ]
        
        Guidelines:
        - Create relevant traits dynamically based on what makes sense for each domain
        - Don't force traits that don't apply (use 0 or omit them)
        - Be specific and thoughtful in your analysis
        - Consider cultural references, internet culture, and domain associations
        - Focus on traits that would be useful for trending/ranking algorithms`;

    const completion = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
            {
                role: "system",
                content: "You are an expert domain analyst. Analyze domain names and dynamically create relevant traits with scores. Always return valid JSON array format."
            },
            {
                role: "user",
                content: prompt
            }
        ],
        temperature: 0.3,
        max_tokens: 8000
    });

    const response = completion.choices[0]?.message?.content;
    if (!response) {
        throw new Error('No response from OpenAI');
    }

    console.log("🤖 OpenAI response for domain analysis:", response);

    // Parse the JSON response
    const results = JSON.parse(response) as DomainAnalysisResult[];

    // Validate that we got results for all domains
    if (!Array.isArray(results) || results.length !== domainNames.length) {
        throw new Error('Invalid response format from OpenAI');
    }

    return results;
}

// Process domains with traits analysis
async function processDomainsWithTraits(domainNames: string[]) {
    console.log('🤖 Starting domain trait analysis with OpenAI...');
    console.log(`📊 Analyzing ${domainNames.length} domains: ${domainNames.join(', ')}`);

    if (domainNames.length === 0) {
        console.log('⚠️ No domains to analyze.');
        return { processed: 0, errors: 0 };
    }

    let processedCount = 0;
    let errorCount = 0;

    // Analyze batch of domains with OpenAI
    const results = await analyzeDomainsBatch(domainNames);

    // Store results in database
    for (const result of results) {
        try {
            await clickhouseService.insertDomainTraits(result.domain, result.traits);

            const significantTraits = Object.entries(result.traits)
                .filter(([_, score]) => score > 0)
                .map(([trait, score]) => `${trait}=${score}`);

            console.log(`✅ Analyzed ${result.domain}:`,
                significantTraits.length > 0 ? significantTraits.join(', ') : 'no significant traits');

            processedCount++;
        } catch (error) {
            console.error(`❌ Error storing traits for ${result.domain}:`, error);
            errorCount++;
        }
    }

    console.log('\n🎉 Domain trait analysis completed!');
    console.log(`📊 Processed ${processedCount} domains with AI-analyzed traits`);
    console.log(`❌ Errors: ${errorCount}`);

    return { processed: processedCount, errors: errorCount };

}

// Vercel Cron Job - runs every 10 minutes
export async function GET(request: NextRequest) {
    try {
        // Verify this is a cron request (Vercel adds this header)
        const authHeader = request.headers.get('authorization');
        if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        console.log('🕐 Starting cron job: Domain analysis for 100 domains...');

        // Check if OpenAI API key is configured
        if (!process.env.OPENAI_API_KEY) {
            console.error('❌ OPENAI_API_KEY environment variable is required');
            return NextResponse.json(
                { error: 'OpenAI API key not configured' },
                { status: 500 }
            );
        }

        // Get 100 domains that don't have traits yet
        const domainsWithoutTraits = await clickhouseService.getDomainsWithoutTraits(100);
        const domainsToAnalyze = domainsWithoutTraits.data.map(d => d.id);

        if (domainsToAnalyze.length === 0) {
            console.log('✅ No domains need analysis - all domains already have traits');
            return NextResponse.json({
                success: true,
                message: 'No domains need analysis',
                processed: 0,
                errors: 0
            });
        }

        // Process domains with AI analysis
        const result = await processDomainsWithTraits(domainsToAnalyze);

        console.log('✅ Cron job completed successfully!');

        return NextResponse.json({
            success: true,
            message: `Cron job completed: processed ${result.processed} domains, ${result.errors} errors`,
            processed: result.processed,
            errors: result.errors,
            timestamp: new Date().toISOString()
        });

    } catch (error) {
        console.error('❌ Cron job failed:', error);
        return NextResponse.json(
            {
                error: 'Cron job failed',
                message: error instanceof Error ? error.message : 'Unknown error',
                timestamp: new Date().toISOString()
            },
            { status: 500 }
        );
    }
}
