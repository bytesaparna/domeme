"use client"

import { useMemo, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { MemecoinCard, getCategory, type Category, ALL_COINS } from "@/components/memecoin-card"
import { Search, Sparkles } from "lucide-react"
import { motion } from "framer-motion"
import ExpandableMemecoinDemo from "@/components/expandable-meme-cards"
import { Navbar } from "@/components/navbar"
import TrendingDomainsTable from "@/components/trending-domain"

type CategoryKey = "All" | Category

export default function Landing() {
    const [active, setActive] = useState<CategoryKey>("All")
    const [searchQuery, setSearchQuery] = useState("")
    const [aiResponse, setAiResponse] = useState("")
    const [isSearching, setIsSearching] = useState(false)

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

    return (
        <div className="min-h-screen bg-black text-slate-100 px-10">
            <header className="sticky top-0 z-50 border-b border-white/10 bg-slate-950/70 backdrop-blur-xl py-4">
                <div className="mx-auto px-4 py-4">
                    <div className="flex items-center justify-between">
                        <Link href="/" className="flex items-center gap-2">
                            <div className="rounded-lg bg-gradient-to-br from-white to-purple-600 p-2">
                                <Sparkles className="h-5 w-5 text-white" />
                            </div>
                            <span className="bg-gradient-to-r from-white to-purple-400 bg-clip-text text-xl font-bold text-transparent md:text-4xl">
                                Domeme
                            </span>
                        </Link>

                        <div className="relative w-full mx-20">
                            <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-500" />
                            <Input
                                type="text"
                                placeholder="Search domains with AI... (e.g., 'dog themed coins')"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                onKeyDown={(e) => e.key === "Enter" && handleAISearch()}
                                className="w-full border-slate-700 bg-purple-300/20 pl-10 pr-16 text-slate-100 placeholder:text-slate-500 focus:border-purple-500 focus:ring-purple-500 py-6 rounded-md"
                            />
                            <Button
                                onClick={handleAISearch}
                                disabled={isSearching || !searchQuery.trim()}
                                className="absolute right-1 top-1/2 -translate-y-1/2 bg-purple-600 hover:from-cyan-500 hover:to-blue-500 p-2"
                            >
                                {isSearching ? (
                                    <div className="h-6 w-6 animate-spin rounded-full border-2 border-white border-t-transparent" />
                                ) : (
                                    <>
                                        {/* <Sparkles className="h-6 w-6 text-white" /> */}
                                        <p className="text-white px-2">Search</p>
                                    </>
                                )}
                            </Button>
                        </div>
                        <Navbar />
                    </div>
                </div>
            </header>

            <motion.main
                initial={{ opacity: 0, y: 10, scale: 0.99 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                className="mx-auto max-w-7xl p-4 md:p-8"
            >
                <div className="mb-10 md:mb-20">
                    <div className="mb-4 text-center mt-8">
                        <h1 className="mb-2 bg-gradient-to-r from-white to-purple-600 bg-clip-text text-pretty text-3xl font-bold text-transparent md:text-4xl">
                            Buy Memecoin Domain
                        </h1>
                        <p className="text-pretty text-sm text-slate-300 md:text-base font-semibold">
                            Buy domains inspired by trending memecoins. AI-powered search helps you find the perfect domain instantly.
                        </p>
                    </div>

                    <div className="relative">
                        {/* Get responses */}
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

                <TrendingDomainsTable />

                <section className="mt-36 px-48">
                    <div className="mb-14 flex flex-wrap items-center gap-3">
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
                                                ? "border-cyan-500/50 bg-purple-500 hover:from-cyan-500 hover:to-blue-500"
                                                : "border-slate-700 bg-slate-800/50 text-slate-300 hover:border-slate-600 hover:bg-purple-400/50"
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

                    <div>
                        {coins.map((coin) => (
                            <ExpandableMemecoinDemo key={coin.symbol} coin={coin} />
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
