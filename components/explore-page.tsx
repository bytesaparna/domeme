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
import { Card, CardTitle } from "./ui/card"
import { PixelatedCanvas } from "./ui/pixelated-canvas"
import { useRouter } from "next/navigation"
import { useAllTrendingDomains } from "@/hooks/useTrendingDomains"
import { useWatchlist } from "@/hooks/use-watchlist"


const CATEGORIES = [
    {
        name: "AI",
        imageUrl: "/ai.png",
    },
    {
        name: "Football",
        imageUrl: "/football.png",
    },
    {
        name: "Ape",
        imageUrl: "/beauty.png",
    },
]

export const ExplorePage = () => {
    const router = useRouter()
    const { data: trendingDomains } = useAllTrendingDomains(50, 24);
    const { watchlist, addDomain, removeDomain } = useWatchlist();

    const handleClick = (name: string) => {
        // Navigate to search page with category name
        router.push(`/search?name=${encodeURIComponent(name)}`)
        return
    }

    const handleWatchlistToggle = (domainId: string) => {
        if (watchlist.domains.includes(domainId)) {
            removeDomain(domainId);
        } else {
            addDomain(domainId);
        }
    }

    return (
        <div className="bg-black min-h-screen">
            <Header />
            <motion.main
                initial={{ opacity: 0, y: 10, scale: 0.99 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                className="p-4 md:px-8"
            >
                <div className="my-12 flex flex-col gap-24 px-8 md:px-16 lg:px-48">
                    <section >
                        <h2 className="text-purple-300 text-3xl font-bold mb-8">
                            Trending Categories
                        </h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
                            {CATEGORIES.map((c) => (
                                <div
                                    key={c.name}
                                    onClick={() => handleClick(c.name)}
                                    className="cursor-pointer transform transition-transform hover:scale-105 hover:shadow-xl rounded-xl overflow-hidden border border-purple-500/30 shadow-lg text-center"
                                >
                                    <img
                                        src={c.imageUrl}
                                        alt={c.name}
                                        className="w-full h-72 object-cover rounded-t-xl"
                                    />
                                    <div className="py-4">
                                        <span className="text-white text-xl sm:text-2xl font-semibold">
                                            {c.name}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                    <section className="mt-12">
                        <h2 className="text-purple-300 text-3xl font-bold mb-8">
                            Trending Domains
                        </h2>

                        <div className="relative grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                            {trendingDomains?.domains.map((d) => (
                                <div
                                    key={d.domain_id}
                                    className="bg-gray-900/5 border border-purple-400/30 rounded-2xl p-6 cursor-pointer hover:shadow-xl transition-shadow duration-300"
                                >
                                    <h3 className="text-white text-2xl font-bold mb-4 truncate">
                                        {d.domain_id}
                                    </h3>
                                    <div className="text-gray-400 text-sm space-y-1">
                                        <p>
                                            <span className="text-white font-semibold">Score:</span> {d.total_score}
                                        </p>
                                        <p>
                                            <span className="text-white font-semibold">Tweet Mentions:</span> {d.total_tweet_mentions}
                                        </p>
                                        <p>
                                            <span className="text-white font-semibold">Trait Count:</span> {d.trait_count}
                                        </p>
                                    </div>
                                    <div className="flex gap-4 justify-end mb-2">
                                    <Button 
                                            onClick={() => handleWatchlistToggle(d.domain_id)}
                                            className={`text-xs font-bold px-4 ${
                                                watchlist.domains.includes(d.domain_id)
                                                    ? 'bg-green-600 hover:bg-green-700 text-white'
                                                    : 'bg-purple-200 hover:bg-purple-300 text-black'
                                            }`}
                                        >
                                            {watchlist.domains.includes(d.domain_id) ? '✓ Watching' : 'Watch'}
                                        </Button>
                                        <Link href={`https://dashboard-testnet.doma.xyz/domain/${d.domain_id}`} target="blank"> 
                                            <Button className=" bg-purple-500 hover:bg-purple-600 text-white text-xs font-bold px-6">
                                                Buy
                                            </Button>
                                        </Link>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>

                </div>
            </motion.main>
        </div>
    )
}