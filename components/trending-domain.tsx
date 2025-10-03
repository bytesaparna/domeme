"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Medal, TrendingUp } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "./ui/button"
import { BackgroundRippleEffect } from "./ui/background-ripple-effect"

type DomainItem = {
  id: string
  name: string
  visibility: number // higher = more visible = higher rank
  addedAt: number
}

const DEFAULT_DOMAINS: DomainItem[] = [
  { id: "doge.com", name: "doge.com", visibility: 95, addedAt: Date.now() - 10000 },
  { id: "pepe.io", name: "pepe.io", visibility: 88, addedAt: Date.now() - 9000 },
  { id: "shib.in", name: "shib.in", visibility: 82, addedAt: Date.now() - 8000 },
  { id: "mog.xyz", name: "mog.xyz", visibility: 77, addedAt: Date.now() - 7000 },
  { id: "bonk.sol", name: "bonk.sol", visibility: 72, addedAt: Date.now() - 6000 },
  { id: "floki.wow", name: "floki.wow", visibility: 69, addedAt: Date.now() - 5000 },
  { id: "wojak.fun", name: "wojak.fun", visibility: 61, addedAt: Date.now() - 4000 },
  { id: "kabosu.net", name: "kabosu.net", visibility: 57, addedAt: Date.now() - 3000 },
]

function usePersistentDomains(key = "trending-domains") {
  const [items, setItems] = useState<DomainItem[]>(() => {
    try {
      const raw = localStorage.getItem(key)
      if (!raw) return DEFAULT_DOMAINS
      const parsed = JSON.parse(raw) as DomainItem[]
      if (!Array.isArray(parsed) || parsed.length === 0) return DEFAULT_DOMAINS
      return parsed
    } catch {
      return DEFAULT_DOMAINS
    }
  })

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(items))
  }, [key, items])

  return { items, setItems }
}

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
  const { items, setItems } = usePersistentDomains()
  const [input, setInput] = useState("")
  const tickRef = useRef<NodeJS.Timeout | null>(null)

  const sorted = useMemo(() => {
    return [...items].sort((a, b) => {
      if (b.visibility === a.visibility) {
        return a.addedAt - b.addedAt
      }
      return b.visibility - a.visibility
    })
  }, [items])

  useEffect(() => {
    if (tickRef.current) clearInterval(tickRef.current)
    tickRef.current = setInterval(() => {
      setItems((prev) =>
        prev.map((d) => {
          const weight = Math.max(1, d.visibility / 50)
          const shouldBoost = Math.random() < Math.min(0.25, 0.08 * weight)
          if (!shouldBoost) return d
          const boost = Math.floor(2 + Math.random() * 6) // +2 to +7
          return { ...d, visibility: d.visibility + boost }
        }),
      )
    }, 3500)
    return () => {
      if (tickRef.current) clearInterval(tickRef.current)
    }
  }, [setItems])

  function addDomain(nameRaw: string) {
    const name = nameRaw.trim().toLowerCase()
    if (!name || !name.includes(".")) return
    setItems((prev) => {
      const exists = prev.find((p) => p.name === name)
      if (exists) {
        return prev.map((p) => (p.name === name ? { ...p, visibility: p.visibility + 5 } : p))
      }
      const item: DomainItem = { id: name, name, visibility: 50, addedAt: Date.now() }
      return [...prev, item]
    })
    setInput("")
  }

  function boost(name: string, inc = 6) {
    setItems((prev) => prev.map((p) => (p.name === name ? { ...p, visibility: p.visibility + inc } : p)))
  }

  return (
    <motion.section
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="space-y-4 px-36"
      aria-label="Trending Domains"
    >
      <div className={cn("rounded-xl border backdrop-blur-xl", "border-purple-400/30 bg-transparent")}>
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
            <tbody>
              <AnimatePresence initial={false}>
                {sorted.map((d, idx) => (
                  <motion.tr
                    key={d.id}
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
                      <span className="font-medium">{d.name}</span>
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
                            style={{ width: `${Math.min(100, d.visibility)}%` }}
                            aria-hidden
                          />
                        </div>
                        <span className="tabular-nums text-muted-foreground">{d.visibility}</span>
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
                          onClick={() => boost(d.name, 6)}
                          aria-label={`Boost visibility for ${d.name}`}
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

        <div className="flex flex-col items-center px-4 py-3 md:px-6 md:py-10 border-t border-white/10">
          <form
            className="flex flex-col md:flex-row items-stretch md:items-center gap-2 w-1/2"
            onSubmit={(e) => {
              e.preventDefault()
              addDomain(input)
            }}
          >
            <label htmlFor="trend-input" className="sr-only">
              Add trending domain
            </label>
            <div className="relative w-full">
              <input
                id="trend-input"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Add a trending domain (e.g. moon.cat)"
                className={cn(
                  "w-full md:flex-1 rounded-md px-3 py-4 text-sm outline-none pr-16",
                  "bg-purple-300/20 border border-white/10 backdrop-blur-md",
                  "placeholder:text-muted-foreground"
                )}
              />
              <Button
                type="submit"
                className={cn(
                  "absolute right-1 top-1/2 -translate-y-1/2 rounded-md px-3 py-1 text-sm font-medium",
                  "border border-white/10 bg-purple-600 hover:bg-primary text-primary-foreground",
                  "transition-colors px-4"
                )}
              >
                Add
              </Button>
            </div>
          </form>
          <p className="mt-2 text-xs text-muted-foreground">
            Submissions and boosts increase visibility. The table shuffles as demand changes.
          </p>
        </div>

      </div>
    </motion.section>
  )
}
