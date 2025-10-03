"use client"

import { useWatchlist } from "@/hooks/use-watchlist"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Trash2, ArrowLeft } from "lucide-react"
import { motion } from "framer-motion"
import { Header } from "@/components/header"

export default function WatchlistPage() {
    const { watchlist, removeCoin, removeDomain } = useWatchlist()

    return (
        <div className="min-h-screen bg-black text-slate-100">
            <Header />
            <div className="flex justify-center mt-8">
                <h2 className="text-2xl font-semibold">Your watchlist</h2>
            </div>
            <main className="mx-auto max-w-6xl p-4 md:p-8">
                <div className="mb-6">
                    <Card className="border-purple-400/30 bg-purple-300/20 backdrop-blur-md">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-slate-100">Domains</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            {watchlist.domains.length === 0 ? (
                                <p className="text-slate-400">No domains saved. Add any domain using “Watch”.</p>
                            ) : (
                                <motion.ul
                                    initial={{ opacity: 0, y: 8 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.3 }}
                                    className="space-y-2"
                                >
                                    {watchlist.domains.map((d) => (
                                        <li
                                            key={d}
                                            className="flex items-center justify-between rounded-md border border-white/10 bg-white/5 px-3 py-2"
                                        >
                                            <span className="text-slate-200">{d}</span>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => removeDomain(d)}
                                                className="border-red-500/40 bg-transparent text-red-400 hover:bg-red-500/10 hover:text-red-300"
                                            >
                                                <Trash2 className="mr-1 h-4 w-4" />
                                                Remove
                                            </Button>
                                        </li>
                                    ))}
                                </motion.ul>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </main>
        </div>
    )
}
