import { generateText } from "ai"

export async function POST(req: Request) {
  try {
    const { query } = await req.json()

    if (!query) {
      return Response.json({ error: "Query is required" }, { status: 400 })
    }

    const { text } = await generateText({
      model: "openai/gpt-4o-mini",
      prompt: `You are a helpful assistant for a memecoin domain marketplace. The user is searching for: "${query}".
      
Available memecoins and their info:
- Doge (DOGE): Trend score 82/100, Premium category, dog-themed, iconic
- Shiba Inu (SHIB): Trend score 69/100, Not-So-Premium, dog-themed
- Pepe (PEPE): Trend score 72/100, Premium, frog meme
- Bonk (BONK): Trend score 52/100, Not-So-Premium, dog-themed
- Floki (FLOKI): Trend score 37/100, Budding, dog-themed
- Mog (MOG): Trend score 43/100, Budding, cat-themed

Provide a helpful, concise recommendation (2-3 sentences) about which domains match their search. Be specific about coin names and why they match.`,
      maxTokens: 150,
    })

    return Response.json({ text })
  } catch (error) {
    console.error("[v0] AI search error:", error)
    return Response.json({ error: "AI search failed" }, { status: 500 })
  }
}
