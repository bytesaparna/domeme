"use client"

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { TrendChart } from "./trend-chart"
import { Heart, TrendingUp, Plus } from "lucide-react"
import { useState } from "react"
import { useWatchlist } from "@/hooks/use-watchlist"
import { motion } from "framer-motion"

export type Memecoin = {
  name: string
  symbol: string
  trendScore: number
  sparkline: number[]
  imageUrl: string
  domains?: string[]
}

export type Category = "Premium" | "Not-So-Premium" | "Budding"

export function getCategory(score: number): Category {
  if (score >= 70) return "Premium"
  if (score >= 40) return "Not-So-Premium"
  return "Budding"
}

function priceForCategory(cat: Category) {
  switch (cat) {
    case "Premium":
      return "₹ 49,999+"
    case "Not-So-Premium":
      return "₹ 9,999 – 49,999"
    default:
      return "₹ 999 – 9,999"
  }
}

function getDomainSuggestions(name: string) {
  const base = name.toLowerCase().replace(/\s+/g, "")
  return [`${base}coin.com`, `get${base}.io`, `${base}domains.xyz`, `${base}hq.ai`]
}

export function MemecoinCard({ coin }: { coin: Memecoin }) {
  const [isFavorite, setIsFavorite] = useState(false)
  const { addCoin, addDomain } = useWatchlist()
  const category = getCategory(coin.trendScore)
  const colorVar =
    category === "Premium"
      ? "hsl(var(--chart-1))"
      : category === "Not-So-Premium"
        ? "hsl(var(--chart-3))"
        : "hsl(var(--chart-2))"
  const trendData = coin.sparkline.map((v, idx) => ({ label: `D${idx + 1}`, value: v }))
  const suggestions = coin.domains || getDomainSuggestions(coin.name)

  function handleBuy(domain: string) {
    console.log("[v0] Buy clicked for domain:", domain, "coin:", coin.symbol)
    alert(`Proceeding to buy ${domain} for ${priceForCategory(category)}`)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 16, scale: 0.98 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ type: "spring", stiffness: 140, damping: 18, mass: 0.7 }}
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.985 }}
    >
      <Card className="group h-full overflow-hidden border-white/10 bg-white/5 backdrop-blur-md transition-all hover:border-cyan-500/40 hover:bg-white/10 hover:shadow-xl hover:shadow-cyan-500/10">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <img
                  src={coin.imageUrl || "/placeholder.svg"}
                  alt={`${coin.name} logo`}
                  width={40}
                  height={40}
                  className="h-10 w-10 rounded-lg object-cover"
                />
                <div className="absolute -bottom-1 -right-1 rounded-full bg-slate-900 p-0.5">
                  <TrendingUp className="h-3 w-3 text-green-400" />
                </div>
              </div>
              <div>
                <CardTitle className="text-balance text-base text-slate-100">{coin.name}</CardTitle>
                <div className="flex items-center gap-2">
                  <p className="text-xs text-slate-400">{coin.symbol.toUpperCase()}</p>
                  <Badge
                    variant="outline"
                    className={
                      category === "Premium"
                        ? "border-cyan-500/30 bg-cyan-500/10 text-cyan-400"
                        : category === "Not-So-Premium"
                          ? "border-amber-500/30 bg-amber-500/10 text-amber-400"
                          : "border-purple-500/30 bg-purple-500/10 text-purple-400"
                    }
                  >
                    {category}
                  </Badge>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => {
                  addCoin(coin.symbol)
                }}
                aria-label={`Add ${coin.symbol} to watchlist`}
                className="text-cyan-400 hover:text-cyan-300"
                title="Add coin to watchlist"
              >
                <Plus className="h-5 w-5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsFavorite(!isFavorite)}
                className={isFavorite ? "text-pink-400" : "text-slate-500"}
                aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
                title="Favorite"
              >
                <Heart className={`h-5 w-5 ${isFavorite ? "fill-pink-400" : ""}`} />
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent className="pt-0">
          <div className="mb-4 rounded-lg border border-white/10 bg-white/5 p-3">
            <TrendChart
              data={trendData}
              label={`${coin.symbol.toUpperCase()} trend`}
              colorVar={colorVar}
              height={132}
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <p className="text-xs text-slate-400">Available domains</p>
              <span className="text-xs font-medium text-cyan-400">{priceForCategory(category)}</span>
            </div>
            {suggestions.slice(0, 3).map((d) => (
              <div
                key={d}
                className="flex items-center justify-between gap-2 rounded-md border border-white/10 bg-white/5 px-3 py-2 transition-colors hover:border-cyan-500/30 hover:bg-white/10"
              >
                <span className="text-sm font-medium text-slate-300">{d}</span>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      addDomain(d)
                    }}
                    className="border-cyan-500/40 bg-transparent text-cyan-400 hover:bg-cyan-500/10 hover:text-cyan-300"
                    aria-label={`Add ${d} to watchlist`}
                  >
                    Watch
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => handleBuy(d)}
                    className="bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500"
                    aria-label={`Buy ${d}`}
                  >
                    Buy
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>

        <CardFooter className="border-t border-white/10 pt-3 text-xs text-slate-400">
          <div className="flex w-full items-center justify-between">
            <span>Trend score</span>
            <Badge variant="outline" className="border-slate-600 bg-white/5 font-mono text-slate-300">
              {coin.trendScore}/100
            </Badge>
          </div>
        </CardFooter>
      </Card>
    </motion.div>
  )
}

export const ALL_COINS: Memecoin[] = [
  {
    name: "Doge",
    symbol: "DOGE",
    trendScore: 82,
    sparkline: [65, 70, 66, 74, 80, 85, 82],
    imageUrl: "/dogecoin-logo.png",
  },
  {
    name: "Shiba Inu",
    symbol: "SHIB",
    trendScore: 69,
    sparkline: [40, 45, 50, 58, 60, 66, 69],
    imageUrl: "/shiba-inu-coin-logo.png",
  },
  {
    name: "Pepe",
    symbol: "PEPE",
    trendScore: 72,
    sparkline: [55, 61, 68, 70, 73, 76, 72],
    imageUrl: "/pepe-coin-logo.png",
  },
  {
    name: "Bonk",
    symbol: "BONK",
    trendScore: 52,
    sparkline: [38, 42, 44, 47, 50, 51, 52],
    imageUrl: "/bonk-coin-logo.png",
  },
  {
    name: "Floki",
    symbol: "FLOKI",
    trendScore: 37,
    sparkline: [22, 26, 25, 28, 30, 33, 37],
    imageUrl: "/floki-coin-logo.png",
  },
  {
    name: "Mog",
    symbol: "MOG",
    trendScore: 43,
    sparkline: [31, 36, 34, 39, 41, 40, 43],
    imageUrl: "/mog-coin-logo.png",
  },
]
