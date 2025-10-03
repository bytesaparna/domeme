"use client"

import { motion } from "framer-motion"
import { Sparkles, LineChart, ShieldCheck, Users, Trophy, Share2 } from "lucide-react"

export function InfoSection() {
    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: { staggerChildren: 0.08, delayChildren: 0.1 },
        },
    }

    const item = {
        hidden: { opacity: 0, y: 16, filter: "blur(2px)" },
        show: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.5, ease: "easeOut" } },
    }

    return (
        <section className="w-full">
            <motion.div
                initial={{ opacity: 0, y: 20, scale: 0.98 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8"
            >
                {/* Header */}
                <motion.div
                    variants={container}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true, amount: 0.4 }}
                    className="mb-6 sm:mb-8"
                >
                    <motion.div
                        variants={item}
                        className="rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xl p-5 sm:p-10 shadow-lg"
                    >
                        <div className="flex items-start gap-3">
                            <div className="rounded-lg bg-cyan-500/15 text-cyan-300 p-2 sm:p-2.5">
                                <Sparkles className="h-5 w-5 sm:h-6 sm:w-6" />
                            </div>
                            <div className="text-slate-200">
                                <h2 className="text-lg sm:text-xl md:text-2xl font-semibold tracking-tight">What is this app?</h2>
                                <p className="mt-1.5 text-sm sm:text-base text-slate-400 leading-relaxed">
                                    A futuristic domain marketplace focused on memecoin names. Discover trending token domains, track
                                    performance with live charts, curate your watchlist, and surface the next big meme—powered by
                                    AI-assisted search and dynamic ranking.
                                </p>
                            </div>
                        </div>
                    </motion.div>
                </motion.div>

                {/* Feature grid */}
                <motion.div
                    variants={container}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true, amount: 0.35 }}
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5"
                >
                    {/* AI Discovery */}
                    <motion.div
                        variants={item}
                        whileHover={{ y: -4, scale: 1.01 }}
                        transition={{ type: "spring", stiffness: 260, damping: 18 }}
                        className="rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xl p-8 shadow-lg"
                    >
                        <div className="flex items-center gap-3">
                            <span className="rounded-lg bg-cyan-500/15 text-cyan-300 p-2">
                                <Sparkles className="h-5 w-5" />
                            </span>
                            <div>
                                <h3 className="font-medium text-slate-100">AI Discovery</h3>
                                <p className="text-sm text-slate-400 mt-0.5">
                                    Filter domains with AI-powered search to find on-trend names faster.
                                </p>
                            </div>
                        </div>
                    </motion.div>

                    {/* Live Trend Table */}
                    <motion.div
                        variants={item}
                        whileHover={{ y: -4, scale: 1.01 }}
                        transition={{ type: "spring", stiffness: 260, damping: 18 }}
                        className="rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xl p-5 shadow-lg"
                    >
                        <div className="flex items-center gap-3">
                            <span className="rounded-lg bg-blue-500/15 text-blue-300 p-2">
                                <LineChart className="h-5 w-5" />
                            </span>
                            <div>
                                <h3 className="font-medium text-slate-100">Live Trend Table</h3>
                                <p className="text-sm text-slate-400 mt-0.5">
                                    Watch ranks shuffle as visibility rises—more buzz means higher placement.
                                </p>
                            </div>
                        </div>
                    </motion.div>

                    {/* Curate & Track */}
                    <motion.div
                        variants={item}
                        whileHover={{ y: -4, scale: 1.01 }}
                        transition={{ type: "spring", stiffness: 260, damping: 18 }}
                        className="rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xl p-5 shadow-lg"
                    >
                        <div className="flex items-center gap-3">
                            <span className="rounded-lg bg-purple-500/15 text-purple-300 p-2">
                                <ShieldCheck className="h-5 w-5" />
                            </span>
                            <div>
                                <h3 className="font-medium text-slate-100">Curate & Track</h3>
                                <p className="text-sm text-slate-400 mt-0.5">
                                    Build your watchlist, boost visibility, and follow performance over time.
                                </p>
                            </div>
                        </div>
                    </motion.div>

                    {/* Community Driven */}
                    <motion.div
                        variants={item}
                        whileHover={{ y: -4, scale: 1.01 }}
                        transition={{ type: "spring", stiffness: 260, damping: 18 }}
                        className="rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xl p-10 shadow-lg"
                    >
                        <div className="flex items-center gap-3">
                            <span className="rounded-lg bg-green-500/15 text-green-300 p-2">
                                <Users className="h-5 w-5" />
                            </span>
                            <div>
                                <h3 className="font-medium text-slate-100">Community Boosts</h3>
                                <p className="text-sm text-slate-400 mt-0.5">
                                    Domains rise in rank when the community submits and boosts them.
                                </p>
                            </div>
                        </div>
                    </motion.div>

                    {/* Gamified Ranking */}
                    <motion.div
                        variants={item}
                        whileHover={{ y: -4, scale: 1.01 }}
                        transition={{ type: "spring", stiffness: 260, damping: 18 }}
                        className="rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xl p-10 shadow-lg"
                    >
                        <div className="flex items-center gap-3">
                            <span className="rounded-lg bg-yellow-500/15 text-yellow-300 p-2">
                                <Trophy className="h-5 w-5" />
                            </span>
                            <div>
                                <h3 className="font-medium text-slate-100">Gamified Ranks</h3>
                                <p className="text-sm text-slate-400 mt-0.5">
                                    Compete for gold, silver, and bronze badges as your domain gains traction.
                                </p>
                            </div>
                        </div>
                    </motion.div>

                    {/* Social Sharing */}
                    <motion.div
                        variants={item}
                        whileHover={{ y: -4, scale: 1.01 }}
                        transition={{ type: "spring", stiffness: 260, damping: 18 }}
                        className="rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xl p-10 shadow-lg"
                    >
                        <div className="flex items-center gap-3">
                            <span className="rounded-lg bg-pink-500/15 text-pink-300 p-2">
                                <Share2 className="h-5 w-5" />
                            </span>
                            <div>
                                <h3 className="font-medium text-slate-100">Share & Flex</h3>
                                <p className="text-sm text-slate-400 mt-0.5">
                                    Tweet your favorite finds directly from the app to spark virality.
                                </p>
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            </motion.div>
        </section>
    )
}

export default InfoSection
