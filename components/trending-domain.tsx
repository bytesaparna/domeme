"use client"

import { motion, AnimatePresence } from "framer-motion"
import { Medal, TrendingUp } from "lucide-react"
import { cn } from "@/lib/utils"
import { TweetSection } from "./tweet-section"
import { useAllTrendingDomains } from "@/hooks/useTrendingDomains"


function MedalIcon({ rank }: { rank: number }) {
  if (rank === 1) {
    return <Medal aria-label="Gold" className="h-5 w-5 text-yellow-500" />
  }
  if (rank === 2) {
    return <Medal aria-label="Silver" className="h-5 w-5 text-gray-400" />
  }
  if (rank === 3) {
    return <Medal aria-label="Bronze" className="h-5 w-5 text-orange-600" />
  }
  return null
}
export default function TrendingDomainsTable() {
  const { data: trendingDomains } = useAllTrendingDomains(8, 24);

  console.log(trendingDomains);

  return (
    <motion.section
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="space-y-4 px-24"
      aria-label="Trending Domains"
    >
      {/* Trending domain table */}
      <div className={cn("flex-1 h-[600px] overflow-auto rounded-xl border backdrop-blur-xl border-purple-400/30 bg-transparent")}>
        <div className="flex items-center justify-between px-4 py-3 md:px-6 md:py-4">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-white" aria-hidden />
            <h2 className="text-base md:text-lg font-semibold text-pretty">Trending Domains</h2>
          </div>
          <p className="text-xs md:text-sm text-muted-foreground">Higher visibility = higher rank</p>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="text-xs uppercase tracking-wide text-purple-400">
              <tr className="text-left">
                <th className="px-4 py-2 md:px-6">Rank</th>
                <th className="px-4 py-2 md:px-6">Domain</th>
                <th className="px-4 py-2 md:px-6">Visibility</th>
                <th className="px-4 py-2 md:px-6">
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody className="overflow-auto">
              <AnimatePresence initial={false}>
                {trendingDomains?.domains.map((d, idx) => (
                  <motion.tr
                    key={d.domain_id}
                    layout
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -12 }}
                    transition={{ type: "spring", stiffness: 380, damping: 28, mass: 0.6 }}
                    className={cn(
                      "border-t border-white/10",
                      "hover:bg-white/[0.04] dark:hover:bg-white/[0.04] transition-colors",
                    )}
                  >

                    <td className="px-4 py-3 md:px-6 md:py-4 font-medium">
                      <div className="flex items-center gap-2">
                        <span className="tabular-nums w-6 md:w-8 text-white">{idx + 1}</span>
                        <MedalIcon rank={idx + 1} />
                      </div>
                    </td>
                    <td className="px-4 py-3 md:px-6 md:py-4">
                      <span className="font-medium">{d.domain_id}</span>
                    </td>
                    <td className="px-4 py-3 md:px-6 md:py-4">
                      <div className="flex items-center gap-2">
                        <div
                          className="h-1.5 rounded-full bg-primary/20"
                          aria-hidden
                          style={{ width: 88, minWidth: 88 }}
                        >
                          <div
                            className="h-1.5 rounded-full bg-primary"
                            style={{ width: `${Math.min(100, d.total_score)}%` }}
                            aria-hidden
                          />
                        </div>
                        <span className="tabular-nums text-muted-foreground">{d.total_score}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 md:px-6 md:py-4">
                      <div className="flex items-center gap-2">
                        <button
                          className={cn(
                            "px-2.5 py-1.5 rounded-md text-xs font-medium",
                            "border border-white/10 bg-white/[0.02] hover:bg-white/[0.06] transition-colors",
                            "backdrop-blur-md",
                          )}
                          aria-label={`Boost visibility for ${d.domain_id}`}
                        >
                          Boost
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
      </div>
    </motion.section>
  )
}
