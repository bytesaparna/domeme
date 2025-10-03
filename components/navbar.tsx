'use client'
import { useWatchlist } from "@/hooks/use-watchlist"
import Link from "next/link"

export const Navbar = () => {
  const { watchlist } = useWatchlist()

    return (
        <nav className="hidden items-center gap-10 md:flex">
            <Link href="/" className="font-semibold text-purple-400 transition hover:text-white hover:bg-purple-400 p-2 rounded-2xl">
                Explore
            </Link>
            <Link href="/watchlist" className="relative font-semibold text-slate-400 transition hover:text-slate-300">
                Watchlist
                {watchlist?.coins?.length + watchlist?.domains?.length > 0 && (
                    <span className="absolute -right-6 -top-3 rounded-full bg-purple-500 px-2 py-0.5 text-[10px] font-medium text-white">
                        {(watchlist.coins.length + watchlist.domains.length).toString()}
                    </span>
                )}
            </Link>
            <Link href="/profile" className="font-semibold text-slate-400 transition hover:text-slate-300">
                Profile
            </Link>
        </nav>
    )
}