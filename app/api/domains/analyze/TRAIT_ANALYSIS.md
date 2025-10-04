# Domain Trait Analysis with OpenAI

This script analyzes domain names using OpenAI's GPT-4 to dynamically assign trait scores that can be used for trending calculations.

## Features

- **AI-Powered Analysis**: Uses OpenAI GPT-4 to analyze domain names and assign trait scores (0-100)
- **Dynamic Traits**: AI creates relevant traits dynamically based on domain meaning and associations
- **Batch Processing**: Processes multiple domains in a single API call for efficiency
- **Flexible Input**: Can analyze specific domains or all domains from database
- **Error Handling**: Graceful error handling with fallback to default scores
- **Database Integration**: Stores results directly in ClickHouse database

## Setup

1. **Install Dependencies**:
   ```bash
   pnpm install
   ```

2. **Set Environment Variables**:
   ```bash
   # Required
   OPENAI_API_KEY=your_openai_api_key_here
   
   # ClickHouse (if not using defaults)
   CLICKHOUSE_HOST=http://localhost:8123
   CLICKHOUSE_USERNAME=default
   CLICKHOUSE_PASSWORD=
   CLICKHOUSE_DATABASE=domeme
   ```

3. **Initialize Database**:
   ```bash
   pnpm db:init
   ```

4. **Populate with Sample Data** (optional):
   ```bash
   pnpm db:populate
   ```

## Usage

### Analyze All Domains from Database
```bash
pnpm db:traits
```

### Analyze Specific Domains
```bash
pnpm db:traits pepe.io doge.com shiba.eth
```

This will:
1. Analyze the provided domains or fetch all domains from ClickHouse database
2. Process domains in batches of 10 using OpenAI GPT-4
3. AI dynamically creates relevant traits for each domain
4. Store trait scores in the `domain_traits` table
5. Process domains in batches to optimize API usage

### Example Output
```
🤖 Starting domain trait analysis with OpenAI...
📝 Analyzing provided domains: pepe.io, doge.com, shiba.eth

🔄 Processing batch 1/1
📝 Domains: pepe.io, doge.com, shiba.eth
✅ Analyzed pepe.io: animal=90, meme=95, cute=85, frog=100
✅ Analyzed doge.com: animal=95, dog=100, meme=90, cute=90, funny=85, crypto=80
✅ Analyzed shiba.eth: animal=90, dog=95, crypto=85, japanese=70, cute=85, meme=80

🎉 Domain trait analysis completed successfully!
📊 Processed 3 domains with AI-analyzed traits
```

## Dynamic Trait Creation

The AI dynamically creates relevant traits for each domain based on:
- **Domain meaning and associations**
- **Cultural and internet culture references** 
- **Potential use cases and target audience**
- **Trending algorithm relevance**

Examples of dynamically created traits:
- `pepe.io` → animal, meme, cute, frog, crypto
- `doge.com` → animal, dog, meme, cute, funny, crypto
- `techstartup.io` → tech, business, professional, modern, startup
- `artgallery.com` → art, creative, cultural, aesthetic, gallery

## Database Schema

### domains
- `id` (String): Domain name (e.g., "pepe.io")
- `created_at` (DateTime): Creation timestamp

### domain_traits
- `domain_id` (String): Reference to domain
- `trait` (String): Trait name (e.g., "animal", "meme")
- `score` (Float64): Score from 0-100
- `created_at` (DateTime): Analysis timestamp
- `updated_at` (DateTime): Last update timestamp

## API Rate Limits

- Processes domains in batches of 10
- 2-second delay between batches
- Batch processing reduces API calls and costs
- Graceful error handling for failed analyses

## Cost Estimation

- GPT-4 API calls: ~$0.06 per batch of 10 domains
- For 1000 domains: ~$6 (much more efficient!)
- Batch processing significantly reduces costs and API calls
