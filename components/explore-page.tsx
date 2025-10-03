'use client'
import { motion } from "framer-motion"
import { useMemo, useState } from "react"
import { ALL_COINS, Category, getCategory } from "./memecoin-card"
import { Button } from "./ui/button"
import { Badge } from "./ui/badge"
import ExpandableMemecoinDemo from "./expandable-meme-cards"
import { ArrowLeft, ArrowLeftSquare } from "lucide-react"
import Link from "next/link"
import { Header } from "./header"

type CategoryKey = "All" | Category

export const ExplorePage = () => {
    const [active, setActive] = useState<CategoryKey>("All")
    const [searchDomain, setSearchDomain] = useState("")


    const coins = useMemo(() => {
        let filtered = active === "All" ? ALL_COINS : ALL_COINS.filter((c) => getCategory(c.trendScore) === active)

        if (searchDomain.trim()) {
            const query = searchDomain.toLowerCase()
            filtered = filtered.filter(
                (c) =>
                    c.name.toLowerCase().includes(query) ||
                    c.symbol.toLowerCase().includes(query) ||
                    c.domains?.some((d) => d.toLowerCase().includes(query)),
            )
        }

        return filtered
    }, [active, searchDomain])
    return (
        <div className="bg-black min-h-screen">
            <Header />
            <motion.main
                initial={{ opacity: 0, y: 10, scale: 0.99 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                className="p-4 md:px-8"
            >

                <section className="mt-10 px-48">

                    <div className="mb-14 flex flex-wrap items-center gap-3">
                        <span className="text-sm text-slate-400">Filter by category:</span>
                        <div role="tablist" aria-label="Category filter" className="flex flex-wrap items-center gap-2 z-50">
                            {(["All", "Premium", "Rising-Star", "Budding"] as CategoryKey[]).map((cat) => {
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
                        <div className="ml-auto mr-6">
                            <Badge variant="outline" className="border-slate-700 bg-slate-800/50 text-slate-400">
                                {coins.length} domains
                            </Badge>
                        </div>
                        <div className="z-50">
                            <Link href="/">
                                <Button variant="ghost" className=" text-slate-400 hover:bg-purple-400 realtive">
                                    <ArrowLeft className="mr-1 h-4 w-4" />
                                    Back to Home
                                </Button>
                            </Link>
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