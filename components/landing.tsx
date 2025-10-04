"use client"
import { motion } from "framer-motion"
import TrendingDomainsTable from "@/components/trending-domain"
import InfoSection from "./info-section"
import Footer from "./footer"
import { Header } from "./header"
import { TweetSection } from "./tweet-section"
import { useTotalDomainsAnalyzed } from "@/hooks/useTotalDomainsAnalyzed"
import { Sparkles, Star } from "lucide-react"

export default function Landing() {
    const { data: totalDoaminsAnalysed } = useTotalDomainsAnalyzed()
    console.log(totalDoaminsAnalysed?.total_domains_analyzed, "Total")
    return (
        <div className="min-h-screen bg-black text-slate-100">
            <Header />
            <motion.main
                initial={{ opacity: 0, y: 10, scale: 0.99 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                className="mx-auto max-w-7xl p-4 md:p-8"
            >
                <div className="mb-8 md:mb-10">
                    <div className="mb-4 text-center mt-8">
                        <h1 className="mb-2 bg-gradient-to-r from-white to-purple-600 bg-clip-text text-pretty text-3xl font-bold text-transparent md:text-4xl">
                            Explore Trending Domain
                        </h1>
                        <p className="text-pretty text-sm text-slate-300 md:text-base font-semibold">
                            Explore domains inspired by trending memecoins. AI-powered search helps you find the perfect domain instantly.
                        </p>
                    </div>
                </div>
                <div className="flex items-center justify-center gap-4 mb-8">
                    <Sparkles className="h-5 w-5 text-purple-400" />
                    <p className="font-semibold text-2xl text-purple-100">Total {totalDoaminsAnalysed?.total_domains_analyzed} + domains analysed and counting.</p>
                </div>
                <div className="flex flex-col gap-4 md:flex-row ">
                    {/* Trending doamin table */}
                    <TrendingDomainsTable />
                    {/* Tweet Section */}
                    <TweetSection />
                </div>
            </motion.main>
            <div className="py-32">
                <InfoSection />
            </div>
            <Footer />
        </div>
    )
}
