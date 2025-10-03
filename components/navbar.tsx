'use client'
import { useWatchlist } from "@/hooks/use-watchlist"
import Link from "next/link"
import { usePathname } from "next/navigation"

export const Navbar = () => {
    const { watchlist } = useWatchlist()
    const pathname = usePathname()

    return (
        <nav className="hidden items-center gap-4 md:flex">
            <Link href="/" className={`relative font-semibold ${pathname === "/" ? "text-purple-400" : "text-slate-400"} transition hover:text-slate-300  hover:bg-purple-600 py-2 px-4 rounded-lg`}>
                Home
            </Link>
            <Link href="/explore" className={`relative font-semibold ${pathname === "/explore" ? "text-purple-400" : "text-slate-400"} transition hover:text-slate-300  hover:bg-purple-600 py-2 px-4 rounded-lg`}>
                Explore
            </Link>
            <Link href="/watchlist" className={`relative font-semibold ${pathname === "/watchlist" ? "text-purple-400" : "text-slate-400"} transition hover:text-slate-300 hover:bg-purple-600 py-2 px-4 rounded-lg`}>
                Watchlist
                {watchlist?.coins?.length + watchlist?.domains?.length > 0 && (
                    <span className="absolute -right-6 -top-3 rounded-full bg-purple-500 px-2 py-0.5 text-[10px] font-medium text-white">
                        {(watchlist.coins.length + watchlist.domains.length).toString()}
                    </span>
                )}
            </Link>
            <Link href="/profile" className={`font-semibold ${pathname === "/profile" ? "text-purple-400" : "text-slate-400"} transition hover:text-slate-300  hover:bg-purple-600 py-2 px-4 rounded-lg`}>
                Profile
            </Link>
        </nav>
    )
}