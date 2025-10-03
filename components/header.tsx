'use client'
import { Search, Sparkles } from "lucide-react"
import Link from "next/link"
import { Input } from "./ui/input"
import { Button } from "./ui/button"
import { Navbar } from "./navbar"
import { useState } from "react"
import { useRouter } from "next/navigation"

export const Header = () => {
    const router = useRouter()
    const [searchDomain, setSearchDomain] = useState("")
    const [isSearching, setIsSearching] = useState(false)

    const handleSearch = async () => {
        if (!searchDomain.trim()) return
        setIsSearching(true)
        try {
            // Fetch domain search results
            const domainsRes = await fetch(`/api/search-domains?name=${searchDomain}`)
            if (domainsRes.ok) {
                const domainsData = await domainsRes.json()
                console.log("OK", domainsData)
                // Navigate to search results page only after results are ready
                router.push(`/search?name=${encodeURIComponent(searchDomain)}`)
                return
            } else {
                console.log("NOT OK")
            }
        } catch (error) {
            console.error("[v0] AI search error:", error)
        } finally {
            setIsSearching(false)
        }
    }
    return (
        <header className="sticky top-0 z-50 border-b border-white/10 bg-slate-950/70 backdrop-blur-xl py-4">
            <div className="mx-auto px-4 py-4">
                <div className="flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-2">
                        <div className="rounded-lg bg-gradient-to-br from-white to-purple-600 p-2">
                            <Sparkles className="h-5 w-5 text-white" />
                        </div>
                        <span className="bg-gradient-to-r from-white to-purple-400 bg-clip-text text-xl font-bold text-transparent md:text-4xl">
                            Domeme
                        </span>
                    </Link>
                    <div className="relative w-full mx-20">
                        <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-500" />
                        <Input
                            type="text"
                            placeholder="Search domains with AI... (e.g., 'dog themed coins')"
                            value={searchDomain}
                            onChange={(e) => setSearchDomain(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                            className="w-full border-slate-700 bg-purple-300/20 pl-10 pr-16 text-slate-100 placeholder:text-slate-500 focus:border-purple-500 focus:ring-purple-500 py-6 rounded-md"
                        />
                        <Button
                            onClick={handleSearch}
                            disabled={isSearching || !searchDomain.trim()}
                            className="absolute right-1 top-1/2 -translate-y-1/2 bg-purple-600 hover:from-cyan-500 hover:to-blue-500 p-2"
                        >
                            {isSearching ? (
                                <div className="h-6 w-6 animate-spin rounded-full border-2 border-white border-t-transparent" />
                            ) : (
                                <p className="text-white px-2">Search</p>
                            )}
                        </Button>
                    </div>
                    <Navbar />
                </div>
            </div>
        </header>
    )
}