'use client'
import { useTrendingDomainsSearch } from "@/hooks/useTrendingDomains"
import { Header } from "./header"
import { Button } from "./ui/button"
import Link from "next/link"

type SearchProps = {
    name: string
}
export const Search = ({ name }: SearchProps) => {
    const { data: domainSearchData, isLoading, isError } = useTrendingDomainsSearch(name)
    console.log(domainSearchData?.domains, "DOMAINS")

    return (
        <div className="min-h-screen bg-black text-slate-100 z-50">

            <Header />
            <h1 className="mb-6 text-2xl font-semibold mt-8 text-center">Search Results for {name}</h1>

            {name && domainSearchData?.domains.length === 0 && (
                <div className="rounded-lg border border-slate-700/50 bg-slate-900 p-8 text-center">
                    <p className="text-slate-400">No domains found.</p>
                </div>
            )}
            <div className="flex flex-col justify-center items-center pb-20">
                {domainSearchData && domainSearchData.domains.length > 0 && (
                    <ul className="relative space-y-3">
                        {domainSearchData.domains.map((d) => (
                            <li
                                key={d.domain_id}
                                className="grid grid-cols-[1fr_auto_auto_auto_auto] items-center gap-8 rounded-md border border-purple-400/30 bg-black p-4 z-50"
                            >
                                <span className="text-slate-200 truncate">{d.domain_id}</span>
                                <div className="flex flex-col">
                                    <span className="text-xs text-gray-400">Score</span>
                                    <span className="text-slate-200 whitespace-nowrap">{d.total_score}</span>
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-xs text-gray-400">Tweet mentions</span>
                                    <span className="text-slate-200 whitespace-nowrap">{d.total_tweet_mentions}</span>
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-xs text-gray-400">Trait counts</span>
                                    <span className="text-slate-200 whitespace-nowrap">{d.trait_count}</span>
                                </div>
                                <Link href={`https://dashboard-testnet.doma.xyz/domain/${d.domain_id}`} target="blank">
                                    <Button className="bg-purple-400 px-6 z-50">Buy</Button>
                                </Link>
                            </li>
                        ))}
                    </ul>
                )}
            </div>

        </div>
    )
}