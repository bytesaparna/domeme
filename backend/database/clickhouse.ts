import { createClient } from '@clickhouse/client';

// ClickHouse client configuration
const clickhouseClient = createClient({
    url: process.env.CLICKHOUSE_URL || 'http://localhost:8123',
    username: process.env.CLICKHOUSE_USERNAME || 'default',
    password: process.env.CLICKHOUSE_PASSWORD || '',
    database: process.env.CLICKHOUSE_DATABASE || 'domeme',
});

// Database schema definitions
export const SCHEMA = {
    // Domains table - domain name is the id
    domains: `
    CREATE TABLE IF NOT EXISTS domains (
      id String,
      created_at DateTime DEFAULT now()
    ) ENGINE = MergeTree()
    ORDER BY id
    PARTITION BY toYYYYMM(created_at)
    PRIMARY KEY id
  `,

    // Domain traits - AI-analyzed trait scores for each domain
    domain_traits: `
    CREATE TABLE IF NOT EXISTS domain_traits (
      domain_id String,
      trait String,
      score Float64,
      created_at DateTime DEFAULT now(),
      updated_at DateTime DEFAULT now()
    ) ENGINE = MergeTree()
    ORDER BY (domain_id, trait)
    PARTITION BY toYYYYMM(created_at)
    PRIMARY KEY (domain_id, trait)
  `,

    // Tweets collection
    tweets: `
    CREATE TABLE IF NOT EXISTS tweets (
      id String,
      content String,
      created_at DateTime DEFAULT now()
    ) ENGINE = MergeTree()
    ORDER BY id
    PARTITION BY toYYYYMM(created_at)
    PRIMARY KEY id
  `,

    // Tweet traits - AI-analyzed trait scores for each tweet
    tweet_traits: `
        CREATE TABLE IF NOT EXISTS tweet_traits (
        tweet_id String,
        trait String,
        score Float64,
        created_at DateTime DEFAULT now()
        ) ENGINE = MergeTree()
        ORDER BY (tweet_id, trait)
        PARTITION BY toYYYYMM(created_at)
        PRIMARY KEY (tweet_id, trait)
  `
};

// Database initialization function
export async function initializeDatabase() {
    try {
        console.log('Initializing ClickHouse database...');

        // Create database if it doesn't exist
        await clickhouseClient.command({
            query: `CREATE DATABASE IF NOT EXISTS ${process.env.CLICKHOUSE_DATABASE || 'domeme'}`,
        });

        // Create all tables
        const tables = [
            { name: 'domains', schema: SCHEMA.domains },
            { name: 'domain_traits', schema: SCHEMA.domain_traits },
            { name: 'tweets', schema: SCHEMA.tweets },
            { name: 'tweet_traits', schema: SCHEMA.tweet_traits }
        ];

        for (const table of tables) {
            console.log(`Creating table: ${table.name}`);
            await clickhouseClient.command({
                query: table.schema,
            });
        }

        console.log('Database initialization completed successfully!');
        return true;
    } catch (error) {
        console.error('Error initializing database:', error);
        throw error;
    }
}

// Helper functions for common operations
export class ClickHouseService {
    private client = clickhouseClient;

    // Insert domain if not exists (domain name is the id)
    async insertDomain(domainName: string) {
        // Use INSERT INTO ... SELECT ... WHERE NOT EXISTS pattern for idempotency
        const query = `
            INSERT INTO domains (id)
            SELECT {domainName:String}
            WHERE NOT EXISTS (
                SELECT id FROM domains WHERE id = {domainName:String}
            )
        `;
        return await this.client.command({
            query,
            query_params: { domainName }
        });
    }

    async insertManyDomains(domainNames: { name: string }[]) {
        // Batch insert domains if not exist (idempotent insert)
        if (domainNames.length === 0) return;

        const valuesClause = domainNames
            .map((_, idx) => `({domain${idx}:String})`)
            .join(',');

        const params: Record<string, string> = {};
        domainNames.forEach((name, idx) => {
            params[`domain${idx}`] = name.name;
        });

        const query = `
            INSERT INTO domains (id)
            SELECT arrayJoin([${domainNames.map((_, idx) => `{domain${idx}:String}`).join(',')}]) AS id
            WHERE id NOT IN (SELECT id FROM domains WHERE id IN (${domainNames.map((_, idx) => `{domain${idx}:String}`).join(',')}))
        `;

        return await this.client.command({
            query,
            query_params: params
        });
    }

    // Insert domain traits (AI-analyzed scores)
    async insertDomainTraits(domainId: string, traits: { [trait: string]: number }) {
        const traitEntries = Object.entries(traits).map(([trait, score]) => ({
            domain_id: domainId,
            trait,
            score
        }));

        return await this.client.insert({
            table: 'domain_traits',
            values: traitEntries,
            format: 'JSONEachRow',
        });
    }

    // Insert tweet
    async insertTweet(tweetId: string, content: string) {
        return await this.client.insert({
            table: 'tweets',
            values: [{ id: tweetId, content }],
            format: 'JSONEachRow',
        });
    }

    // Insert tweet traits (AI-analyzed scores)
    async insertTweetTraits(tweetId: string, traits: { [trait: string]: number }) {
        const traitEntries = Object.entries(traits).map(([trait, score]) => ({
            tweet_id: tweetId,
            trait,
            score
        }));

        return await this.client.insert({
            table: 'tweet_traits',
            values: traitEntries,
            format: 'JSONEachRow',
        });
    }

    // Get all domains
    async getAllDomains(limit: number = 1000) {
        const result = await this.client.query({
            query: `SELECT * FROM domains ORDER BY id LIMIT {limit:UInt32}`,
            query_params: { limit },
        });
        return await result.json<{ id: string, created_at: string }>();
    }

    // Get all domains that don't have any traits yet
    async getDomainsWithoutTraits(limit: number = 1000, order_by = 'id') {
        // If domain_traits is empty, LEFT JOIN with NULL condition may not work as expected in ClickHouse.
        // Instead, use an anti-join with NOT IN for better reliability.
        const result = await this.client.query({
            query: `
                SELECT *
                FROM domains
                WHERE id NOT IN (SELECT domain_id FROM domain_traits)
                ORDER BY ${order_by}
                LIMIT {limit:UInt32}
            `,
            query_params: { limit },
        });
        return await result.json<{ id: string, created_at: string }>();
    }

    // Get domain traits
    async getDomainTraits(domainId: string) {
        const result = await this.client.query({
            query: `
        SELECT trait, score 
        FROM domain_traits 
        WHERE domain_id = {domainId:String}
        ORDER BY score DESC
      `,
            query_params: { domainId },
        });
        return await result.json<{ trait: string, score: number }>();
    }

    // Get tweets from last 24 hours with their traits
    async getRecentTweets(hours: number = 24) {
        const result = await this.client.query({
            query: `
        SELECT 
            t.id,
            t.content,
            t.created_at,
            tt.trait,
            tt.score
        FROM tweets t
        LEFT JOIN tweet_traits tt ON t.id = tt.tweet_id
        WHERE t.created_at >= now() - INTERVAL {hours:UInt32} HOUR
        ORDER BY t.created_at DESC, t.id DESC
      `,
            query_params: { hours },
        });

        const rawData = await result.json<{ id: string, content: string, created_at: string, trait: string | null, score: number | null }>();

        // Group tweets and their traits
        const tweetMap = new Map<string, {
            id: string;
            content: string;
            created_at: string;
            traits: { [trait: string]: number };
        }>();

        rawData.data.forEach(row => {
            if (!tweetMap.has(row.id)) {
                tweetMap.set(row.id, {
                    id: row.id,
                    content: row.content,
                    created_at: row.created_at,
                    traits: {}
                });
            }

            // Add trait if it exists
            if (row.trait && row.score !== null) {
                tweetMap.get(row.id)!.traits[row.trait] = row.score;
            }
        });

        // Convert map to array and sort by created_at (latest first)
        const tweets = Array.from(tweetMap.values()).sort((a, b) =>
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );

        return tweets;
    }

    // Calculate domain scores based on recent tweet traits
    async calculateDomainScores(hours: number = 24) {
        const result = await this.client.query({
            query: `
        WITH recent_tweet_traits AS (
          SELECT tt.trait, AVG(tt.score) as avg_score, COUNT(*) as tweet_count
          FROM tweet_traits tt
          JOIN tweets t ON tt.tweet_id = t.id
          WHERE t.created_at >= now() - INTERVAL {hours:UInt32} HOUR
          GROUP BY tt.trait
        ),
        domain_scores AS (
          SELECT 
            dt.domain_id,
            dt.trait,
            dt.score as domain_trait_score,
            COALESCE(rtt.avg_score, 0) as tweet_trait_score,
            COALESCE(rtt.tweet_count, 0) as tweet_count,
            (dt.score * COALESCE(rtt.avg_score, 0)) as combined_score
          FROM domain_traits dt
          LEFT JOIN recent_tweet_traits rtt ON dt.trait = rtt.trait
        )
        SELECT 
          domain_id,
          SUM(combined_score) as total_score,
          COUNT(DISTINCT trait) as trait_count,
          SUM(tweet_count) as total_tweet_mentions
        FROM domain_scores
        GROUP BY domain_id
        HAVING total_score > 0
        ORDER BY total_score DESC
      `,
            query_params: { hours },
        });
        return await result.json<{ domain_id: string, total_score: number, trait_count: number, total_tweet_mentions: number }>();
    }

    // Get trending domains based on calculated scores with optional fuzzy search
    async getTrendingDomains(limit: number = 20, hours: number = 24, searchQuery?: string) {
        // Build the WHERE clause for domain filtering if search query is provided
        const domainFilter = searchQuery ? `AND d.id ILIKE {searchQuery:String}` : '';

        // First, try to get trending domains based on recent tweet activity
        const result = await this.client.query({
            query: `
        WITH recent_tweet_traits AS (
          SELECT tt.trait as trait, AVG(tt.score) as avg_score, COUNT(*) as tweet_count
          FROM tweet_traits tt
          JOIN tweets t ON tt.tweet_id = t.id
          WHERE t.created_at >= now() - INTERVAL {hours:UInt32} HOUR
          GROUP BY tt.trait
        ),
        domain_scores AS (
          SELECT 
            dt.domain_id as domain_id,
            dt.trait as trait,
            dt.score as domain_trait_score,
            COALESCE(rtt.avg_score, 0) as tweet_trait_score,
            COALESCE(rtt.tweet_count, 0) as tweet_count,
            (dt.score * COALESCE(rtt.avg_score, 0)) as combined_score
          FROM domain_traits dt
          LEFT JOIN recent_tweet_traits rtt ON dt.trait = rtt.trait
          JOIN domains d ON dt.domain_id = d.id
          WHERE 1=1 ${domainFilter}
        ),
        aggregated_scores AS (
          SELECT 
            domain_id,
            SUM(combined_score) as total_score,
            COUNT(DISTINCT ds.trait) as trait_count,
            SUM(tweet_count) as total_tweet_mentions
          FROM domain_scores ds
          GROUP BY domain_id
          HAVING total_score > 0
        ),
        domain_quality AS (
          SELECT 
            domain_id,
            total_score,
            trait_count,
            total_tweet_mentions,
            -- Extract domain name without TLD (e.g., 'pepe123.com' -> 'pepe123')
            SUBSTRING(domain_id, 1, POSITION('.' IN domain_id) - 1) as domain_name,
            -- Calculate alphabetic ratio (higher is better)
            length(replaceRegexpAll(SUBSTRING(domain_id, 1, POSITION('.' IN domain_id) - 1), '[^a-zA-Z]', '')) / 
            GREATEST(length(SUBSTRING(domain_id, 1, POSITION('.' IN domain_id) - 1)), 1) as alphabetic_ratio,
            -- Calculate numeric count (lower is better)
            length(replaceRegexpAll(SUBSTRING(domain_id, 1, POSITION('.' IN domain_id) - 1), '[^0-9]', '')) as numeric_count
          FROM aggregated_scores
        ),
        scored_domains AS (
          SELECT 
            domain_id,
            total_score,
            trait_count,
            total_tweet_mentions,
            alphabetic_ratio,
            numeric_count,
            -- Quality multiplier: favor purely alphabetic domains
            -- Domains with 100% alphabetic get 1.0x, domains with numbers get exponentially lower multipliers
            CASE 
              WHEN alphabetic_ratio = 1 THEN 1.0
              WHEN alphabetic_ratio >= 0.8 THEN POW(alphabetic_ratio, 2)
              WHEN alphabetic_ratio >= 0.6 THEN POW(alphabetic_ratio, 3)
              ELSE POW(alphabetic_ratio, 4)
            END as quality_multiplier
          FROM domain_quality
          WHERE alphabetic_ratio >= 0.5  -- Filter out domains with less than 50% alphabetic characters
        ),
        normalized_scores AS (
          SELECT 
            domain_id,
            total_score,
            trait_count,
            total_tweet_mentions,
            alphabetic_ratio,
            quality_multiplier,
            -- Normalize using min-max normalization within the result set
            (total_score - MIN(total_score) OVER ()) / 
            GREATEST((MAX(total_score) OVER () - MIN(total_score) OVER ()), 0.0001) as normalized_score
          FROM scored_domains
        )
        SELECT 
          domain_id,
          total_score,
          trait_count,
          total_tweet_mentions,
          -- Final weighted score: combine normalized score with quality multiplier
          (normalized_score * 0.7 + quality_multiplier * 0.3) * total_score as final_score
        FROM normalized_scores
        ORDER BY final_score DESC
        LIMIT {limit:UInt32}
      `,
            query_params: {
                hours,
                limit,
                ...(searchQuery && { searchQuery: `%${searchQuery}%` })
            },
        });

        const trendingData = await result.json<{ domain_id: string, total_score: number, trait_count: number, total_tweet_mentions: number }>();

        // If no results from trending analysis, fallback to individual domain trait scores
        if (trendingData.data.length === 0) {
            console.log('📊 No trending domains found, falling back to individual domain trait scores...');

            const fallbackResult = await this.client.query({
                query: `
                    WITH domain_quality AS (
                        SELECT 
                            dt.domain_id,
                            SUM(dt.score) as total_score,
                            COUNT(DISTINCT dt.trait) as trait_count,
                            -- Calculate alphabetic ratio
                            length(replaceRegexpAll(SUBSTRING(dt.domain_id, 1, POSITION('.' IN dt.domain_id) - 1), '[^a-zA-Z]', '')) / 
                            GREATEST(length(SUBSTRING(dt.domain_id, 1, POSITION('.' IN dt.domain_id) - 1)), 1) as alphabetic_ratio
                        FROM domain_traits dt
                        JOIN domains d ON dt.domain_id = d.id
                        WHERE 1=1 ${domainFilter}
                        GROUP BY dt.domain_id
                    ),
                    scored_domains AS (
                        SELECT 
                            domain_id,
                            total_score,
                            trait_count,
                            0 as total_tweet_mentions,
                            -- Quality multiplier
                            CASE 
                              WHEN alphabetic_ratio = 1 THEN 1.0
                              WHEN alphabetic_ratio >= 0.8 THEN POW(alphabetic_ratio, 2)
                              WHEN alphabetic_ratio >= 0.6 THEN POW(alphabetic_ratio, 3)
                              ELSE POW(alphabetic_ratio, 4)
                            END as quality_multiplier
                        FROM domain_quality
                        WHERE alphabetic_ratio >= 0.5
                    ),
                    normalized_scores AS (
                        SELECT 
                            domain_id,
                            total_score,
                            trait_count,
                            total_tweet_mentions,
                            quality_multiplier,
                            (total_score - MIN(total_score) OVER ()) / 
                            GREATEST((MAX(total_score) OVER () - MIN(total_score) OVER ()), 0.0001) as normalized_score
                        FROM scored_domains
                    )
                    SELECT 
                        domain_id,
                        total_score,
                        trait_count,
                        total_tweet_mentions,
                        (normalized_score * 0.7 + quality_multiplier * 0.3) * total_score as final_score
                    FROM normalized_scores
                    ORDER BY final_score DESC
                    LIMIT {limit:UInt32}
                `,
                query_params: {
                    limit,
                    ...(searchQuery && { searchQuery: `%${searchQuery}%` })
                },
            });

            return await fallbackResult.json<{ domain_id: string, total_score: number, trait_count: number, total_tweet_mentions: number }>();
        }

        return trendingData;
    }

    // Get count of total domains analyzed (unique domains in domain_traits table)
    async getTotalDomainsAnalyzed() {
        const result = await this.client.query({
            query: `
                SELECT COUNT(DISTINCT domain_id) as total_domains_analyzed
                FROM domain_traits
            `
        });
        return await result.json<{ total_domains_analyzed: number }>();
    }
}

// Export the service instance
export const clickhouseService = new ClickHouseService();

// Export the client for direct queries if needed
export { clickhouseClient };
