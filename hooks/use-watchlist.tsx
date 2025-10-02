"use client"

import useSWR from "swr"
import { useCallback, useEffect } from "react"

export type Watchlist = {
  coins: string[] // coin symbols like "DOGE"
  domains: string[] // domain strings like "dogecoin.com"
}

const STORAGE_KEY = "memedomains:watchlist"

function loadFromStorage(): Watchlist {
  if (typeof window === "undefined") return { coins: [], domains: [] }
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return { coins: [], domains: [] }
    const parsed = JSON.parse(raw)
    return {
      coins: Array.isArray(parsed.coins) ? parsed.coins : [],
      domains: Array.isArray(parsed.domains) ? parsed.domains : [],
    }
  } catch {
    return { coins: [], domains: [] }
  }
}

function saveToStorage(list: Watchlist) {
  if (typeof window === "undefined") return
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(list))
}

export function useWatchlist() {
  const { data, mutate, isLoading } = useSWR<Watchlist>("watchlist", async () => loadFromStorage(), {
    fallbackData: { coins: [], domains: [] },
    revalidateOnFocus: false,
    revalidateIfStale: false,
  })

  useEffect(() => {
    // sync across tabs
    const onStorage = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY) mutate(loadFromStorage(), { revalidate: false })
    }
    window.addEventListener("storage", onStorage)
    return () => window.removeEventListener("storage", onStorage)
  }, [mutate])

  const addCoin = useCallback(
    async (symbol: string) => {
      const next: Watchlist = {
        coins: Array.from(new Set([...(data?.coins || []), symbol])),
        domains: data?.domains || [],
      }
      saveToStorage(next)
      await mutate(next, { revalidate: false })
    },
    [data, mutate],
  )

  const removeCoin = useCallback(
    async (symbol: string) => {
      const next: Watchlist = {
        coins: (data?.coins || []).filter((s) => s !== symbol),
        domains: data?.domains || [],
      }
      saveToStorage(next)
      await mutate(next, { revalidate: false })
    },
    [data, mutate],
  )

  const addDomain = useCallback(
    async (domain: string) => {
      const next: Watchlist = {
        coins: data?.coins || [],
        domains: Array.from(new Set([...(data?.domains || []), domain])),
      }
      saveToStorage(next)
      await mutate(next, { revalidate: false })
    },
    [data, mutate],
  )

  const removeDomain = useCallback(
    async (domain: string) => {
      const next: Watchlist = {
        coins: data?.coins || [],
        domains: (data?.domains || []).filter((d) => d !== domain),
      }
      saveToStorage(next)
      await mutate(next, { revalidate: false })
    },
    [data, mutate],
  )

  return {
    watchlist: data || { coins: [], domains: [] },
    isLoading,
    addCoin,
    removeCoin,
    addDomain,
    removeDomain,
  }
}
