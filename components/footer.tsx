"use client"

import { Github, Twitter, Mail } from "lucide-react"
import Link from "next/link"

export function Footer() {
    return (
        <footer className="border-t border-white/10 bg-white/5 backdrop-blur-xl mt-16">
            <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-10 flex flex-col md:flex-row items-center justify-between gap-6 text-slate-400">

                {/* Brand */}
                <div className="text-center md:text-left">
                    <h3 className="text-lg font-semibold text-slate-100">MemeDomains</h3>
                    <p className="text-sm mt-1">Trend before it trend 🚀</p>
                </div>

                {/* Links */}
                <nav className="flex gap-6 text-sm">
                    <Link href="/explore" className="hover:text-slate-200 transition-colors">
                        Explore
                    </Link>
                    <Link href="/watchlist" className="hover:text-slate-200 transition-colors">
                        Watchlist
                    </Link>
                    <Link href="/profile" className="hover:text-slate-200 transition-colors">
                        About
                    </Link>
                </nav>

                {/* Socials */}
                <div className="flex gap-4">
                    <a href="https://twitter.com" target="_blank" rel="noreferrer" className="p-2 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
                        <Twitter className="h-5 w-5 text-blue-400" />
                    </a>
                    <a href="https://github.com" target="_blank" rel="noreferrer" className="p-2 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
                        <Github className="h-5 w-5 text-slate-300" />
                    </a>
                    <a href="mailto:team@memedomains.com" className="p-2 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
                        <Mail className="h-5 w-5 text-pink-400" />
                    </a>
                </div>
            </div>

            {/* Bottom Note */}
            <div className="text-center text-xs text-slate-500 border-t border-white/10 py-4">
                © {new Date().getFullYear()} MemeDomains — All rights reserved.
            </div>
        </footer>
    )
}

export default Footer
