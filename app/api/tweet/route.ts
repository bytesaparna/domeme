import { NextRequest, NextResponse } from 'next/server';
import { clickhouseService, clickhouseClient } from '../../../backend/database/clickhouse';
import OpenAI from 'openai';
import { v4 as uuidv4 } from 'uuid';

// Initialize OpenAI client
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

interface TweetTraits {
    [trait: string]: number;
}

// Get all unique traits from domain_traits table
async function getUniqueTraits(): Promise<string[]> {
    try {
        const result = await clickhouseClient.query({
            query: `
                SELECT DISTINCT trait 
                FROM domain_traits 
                ORDER BY trait
            `
        });
        const data = await result.json<{ trait: string }>();
        return data.data.map((row: { trait: string }) => row.trait);
    } catch (error) {
        console.error('Error fetching unique traits:', error);
        return [];
    }
}

// Analyze tweet content and score it based on traits
async function analyzeTweetWithTraits(tweetContent: string, availableTraits: string[]): Promise<TweetTraits> {
    try {
        const prompt = `Analyze this tweet content and assign trait scores (0-100) based on the provided traits.

Tweet content: "${tweetContent}"

Available traits: ${availableTraits.join(', ')}

For each trait, assign a score from 0-100 based on how well the tweet content matches that trait:
- 0-20: No relevance or very weak connection
- 21-40: Some relevance but weak connection
- 41-60: Moderate relevance and connection
- 61-80: Strong relevance and good connection
- 81-100: Very strong relevance and excellent connection

Return ONLY a JSON object where keys are trait names and values are scores (0-100).

Example format:
{
  "meme": 85,
  "crypto": 70,
  "animal": 0,
  "tech": 20
}

Guidelines:
- Be thoughtful and accurate in your scoring
- Consider the context, tone, and meaning of the tweet
- Don't force high scores for traits that don't apply
- Focus on the actual content and sentiment of the tweet`;

        const completion = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [
                {
                    role: "system",
                    content: "You are an expert content analyst. Analyze tweet content and assign trait scores accurately. Always return valid JSON format."
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

        console.log("🤖 OpenAI response for tweet analysis:", response);

        // Parse the JSON response
        const traits = JSON.parse(response) as TweetTraits;

        // Validate that we got a proper object
        if (typeof traits !== 'object' || traits === null) {
            throw new Error('Invalid response format from OpenAI');
        }

        return traits;
    } catch (error) {
        console.error('❌ Error analyzing tweet with traits:', error);
        throw new Error('Failed to analyze tweet with traits');
    }
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { content } = body;

        if (!content || typeof content !== 'string') {
            return NextResponse.json(
                { error: 'Tweet content is required' },
                { status: 400 }
            );
        }

        console.log('📝 Creating tweet with content:', content);

        // Generate unique tweet ID
        const tweetId = uuidv4();

        // Step 1: Get all unique traits from domain_traits table
        console.log('🔍 Fetching unique traits from domain_traits table...');
        const uniqueTraits = await getUniqueTraits();
        console.log(`📊 Found ${uniqueTraits.length} unique traits:`, uniqueTraits);

        if (uniqueTraits.length === 0) {
            return NextResponse.json(
                { error: 'No traits found in database. Please populate domain traits first.' },
                { status: 400 }
            );
        }

        // Step 2: Analyze tweet content with AI based on the traits
        console.log('🤖 Analyzing tweet content with AI...');
        const tweetTraits = await analyzeTweetWithTraits(content, uniqueTraits);
        console.log('📊 Tweet trait scores:', tweetTraits);

        // Step 3: Store tweet in tweets table
        console.log('💾 Storing tweet in database...');
        await clickhouseService.insertTweet(tweetId, content);

        // Step 4: Store tweet traits in tweet_traits table
        console.log('💾 Storing tweet traits in database...');
        if (Object.keys(tweetTraits).length > 0) {
            await clickhouseService.insertTweetTraits(tweetId, tweetTraits);
        }

        console.log('✅ Tweet created successfully!');

        return NextResponse.json({
            success: true,
            tweetId,
            content,
            traits: tweetTraits,
            message: 'Tweet created and analyzed successfully'
        });

    } catch (error) {
        console.error('❌ Error creating tweet:', error);
        return NextResponse.json(
            { error: 'Failed to create tweet' },
            { status: 500 }
        );
    }
}

// GET /api/tweet/recent?hours=24
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const hours = parseInt(searchParams.get('hours') || '24', 10);

        console.log(`📊 Fetching recent tweets from last ${hours} hours...`);

        // Get recent tweets with traits using the ClickHouse service
        const tweets = await clickhouseService.getRecentTweets(hours);

        console.log(`✅ Found ${tweets.length} recent tweets`);

        return NextResponse.json({
            success: true,
            tweets,
            count: tweets.length,
            hours,
            message: `Retrieved ${tweets.length} tweets from the last ${hours} hours`
        });

    } catch (error) {
        console.error('❌ Error fetching recent tweets:', error);
        return NextResponse.json(
            { error: 'Failed to fetch recent tweets' },
            { status: 500 }
        );
    }
}


