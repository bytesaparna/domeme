"use client"

import { useMemo, useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { MemecoinCard, getCategory, type Category, ALL_COINS } from "@/components/memecoin-card"
import { TrendChart } from "@/components/trend-chart"
import { Search, Sparkles, TrendingUp, User, Bell } from "lucide-react"
import { motion } from "framer-motion"
import { useWatchlist } from "@/hooks/use-watchlist"

type CategoryKey = "All" | Category

export default function Page() {
  const [active, setActive] = useState<CategoryKey>("All")
  const [searchQuery, setSearchQuery] = useState("")
  const [aiResponse, setAiResponse] = useState("")
  const [isSearching, setIsSearching] = useState(false)
  const { watchlist } = useWatchlist()

  const coins = useMemo(() => {
    let filtered = active === "All" ? ALL_COINS : ALL_COINS.filter((c) => getCategory(c.trendScore) === active)

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(
        (c) =>
          c.name.toLowerCase().includes(query) ||
          c.symbol.toLowerCase().includes(query) ||
          c.domains?.some((d) => d.toLowerCase().includes(query)),
      )
    }

    return filtered
  }, [active, searchQuery])

  const handleAISearch = async () => {
    if (!searchQuery.trim()) return

    setIsSearching(true)
    try {
      const response = await fetch("/api/ai-search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: searchQuery }),
      })
      const data = await response.json()
      setAiResponse(data.text || "")
    } catch (error) {
      console.error("[v0] AI search error:", error)
    } finally {
      setIsSearching(false)
    }
  }

  const categorySummary = useMemo(() => {
    const counts = { Premium: 0, "Not-So-Premium": 0, Budding: 0 }
    ALL_COINS.forEach((c) => {
      const cat = getCategory(c.trendScore)
      counts[cat] += 1
    })
    return [
      { label: "Premium", value: counts["Premium"] },
      { label: "Not-So-Premium", value: counts["Not-So-Premium"] },
      { label: "Budding", value: counts["Budding"] },
    ]
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-slate-900 to-slate-800 text-slate-100">
      <header className="sticky top-0 z-50 border-b border-white/10 bg-slate-950/70 backdrop-blur-xl">
        <div className="mx-auto max-w-7xl px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <div className="rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 p-2">
                <Sparkles className="h-5 w-5 text-white" />
              </div>
              <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-xl font-bold text-transparent md:text-4xl">
                MemeDomains
              </span>
            </Link>

            <nav className="hidden items-center gap-6 md:flex">
              <Link href="/" className="text-sm text-cyan-400 transition hover:text-cyan-300">
                Marketplace
              </Link>
              <Link href="/portfolio" className="text-sm text-slate-400 transition hover:text-slate-300">
                Portfolio
              </Link>
              <Link href="/watchlist" className="relative text-sm text-slate-400 transition hover:text-slate-300">
                Watchlist
                {watchlist?.coins?.length + watchlist?.domains?.length > 0 && (
                  <span className="absolute -right-3 -top-2 rounded-full bg-cyan-500 px-1.5 py-0.5 text-[10px] font-medium text-white">
                    {(watchlist.coins.length + watchlist.domains.length).toString()}
                  </span>
                )}
              </Link>
              <Link href="/profile" className="text-sm text-slate-400 transition hover:text-slate-300">
                Profile
              </Link>
            </nav>

            <div className="flex items-center gap-3">
              <Button variant="ghost" size="icon" className="relative text-slate-400 hover:text-slate-100">
                <Bell className="h-5 w-5" />
                <span className="absolute -right-1 -top-1 h-2 w-2 animate-pulse rounded-full bg-cyan-500"></span>
              </Button>
              <Link href="/profile">
                <Button variant="ghost" size="icon" className="text-slate-400 hover:text-slate-100">
                  <User className="h-5 w-5" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <motion.main
        initial={{ opacity: 0, y: 10, scale: 0.99 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="mx-auto max-w-7xl p-4 md:p-8"
      >
        <div className="mb-6 md:mb-8">
          <div className="mb-4">
            <h1 className="mb-2 bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-pretty text-3xl font-bold text-transparent md:text-4xl">
              Memecoin Domain Marketplace
            </h1>
            <p className="text-pretty text-sm text-slate-400 md:text-base">
              Buy domains inspired by trending memecoins. AI-powered search helps you find the perfect domain instantly.
            </p>
          </div>

          <div className="relative">
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-500" />
                <Input
                  type="text"
                  placeholder="Search domains with AI... (e.g., 'dog themed coins' or 'high trend score')"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleAISearch()}
                  className="border-slate-700 bg-slate-800/50 pl-10 text-slate-100 placeholder:text-slate-500 focus:border-cyan-500 focus:ring-cyan-500"
                />
              </div>
              <Button
                onClick={handleAISearch}
                disabled={isSearching || !searchQuery.trim()}
                className="bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500"
              >
                {isSearching ? (
                  <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                ) : (
                  <Sparkles className="h-5 w-5" />
                )}
              </Button>
            </div>

            {aiResponse && (
              <div className="mt-3 rounded-lg border border-cyan-500/30 bg-slate-800/80 p-4 backdrop-blur-sm">
                <div className="mb-2 flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-cyan-400" />
                  <span className="text-sm font-medium text-cyan-400">AI Insights</span>
                </div>
                <p className="text-sm text-slate-300">{aiResponse}</p>
              </div>
            )}
          </div>
        </div>

        <section className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-3">
          <Card className="border-white/10 bg-white/5 backdrop-blur-md">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-base text-slate-100">
                <TrendingUp className="h-5 w-5 text-cyan-400" />
                Category Distribution
              </CardTitle>
            </CardHeader>
            <CardContent>
              <TrendChart
                data={categorySummary}
                label="Listings"
                colorVar="hsl(var(--chart-1))"
                height={200}
                kind="bar"
              />
            </CardContent>
          </Card>

          <Card className="border-white/10 bg-white/5 backdrop-blur-md">
            <CardHeader className="pb-2">
              <CardTitle className="text-base text-slate-100">Market Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <TrendChart
                data={(() => {
                  const days = 7
                  const points = Array.from({ length: days }, (_, i) => {
                    const sum = ALL_COINS.reduce((acc, c) => acc + c.sparkline[i], 0)
                    return { label: `D${i + 1}`, value: Math.round(sum / ALL_COINS.length) }
                  })
                  return points
                })()}
                label="Buzz"
                colorVar="hsl(var(--chart-2))"
                height={200}
                kind="area"
              />
            </CardContent>
          </Card>

          <Card className="border-white/10 bg-gradient-to-br from-white/5 to-purple-500/10 backdrop-blur-md">
            <CardHeader className="pb-2">
              <CardTitle className="text-base text-slate-100">Top Gainers (24h)</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {ALL_COINS.slice(0, 3).map((coin, idx) => (
                <div key={coin.symbol} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-500">#{idx + 1}</span>
                    <img src={coin.imageUrl || "/placeholder.svg"} alt={coin.name} className="h-6 w-6 rounded-full" />
                    <span className="text-sm font-medium text-slate-300">{coin.name}</span>
                  </div>
                  <Badge className="border-green-500/30 bg-green-500/10 text-green-400">
                    +{Math.floor(Math.random() * 20 + 5)}%
                  </Badge>
                </div>
              ))}
            </CardContent>
          </Card>
        </section>

        <section className="mt-6">
          <div className="mb-4 flex flex-wrap items-center gap-3">
            <span className="text-sm text-slate-400">Filter by category:</span>
            <div role="tablist" aria-label="Category filter" className="flex flex-wrap items-center gap-2">
              {(["All", "Premium", "Not-So-Premium", "Budding"] as CategoryKey[]).map((cat) => {
                const selected = active === cat
                return (
                  <Button
                    key={cat}
                    variant={selected ? "default" : "outline"}
                    size="sm"
                    role="tab"
                    aria-selected={selected}
                    onClick={() => setActive(cat)}
                    className={
                      selected
                        ? "border-cyan-500/50 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500"
                        : "border-slate-700 bg-slate-800/50 text-slate-300 hover:border-slate-600 hover:bg-slate-700/50"
                    }
                  >
                    {cat}
                  </Button>
                )
              })}
            </div>
            <div className="ml-auto">
              <Badge variant="outline" className="border-slate-700 bg-slate-800/50 text-slate-400">
                {coins.length} domains
              </Badge>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {coins.map((coin) => (
              <MemecoinCard key={coin.symbol} coin={coin} />
            ))}
          </div>

          {coins.length === 0 && (
            <div className="rounded-lg border border-slate-700/50 bg-slate-900/50 p-12 text-center backdrop-blur-sm">
              <p className="text-slate-400">No domains found matching your search.</p>
            </div>
          )}
        </section>
      </motion.main>
    </div>
  )
}
