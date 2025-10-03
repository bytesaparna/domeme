import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { Subgraph } from "@/lib/graphql.ts"

type SearchPageProps = {
    searchParams?: { [key: string]: string | string[] | undefined }
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
    const nameParam = typeof searchParams?.name === "string" ? searchParams?.name : ""

    let domains: { name: string; expiresAt: string; tokenizedAt: string }[] = []
    if (nameParam) {
        const subgraphService = new Subgraph()
        domains = await subgraphService.searchDomains(0, 10, nameParam)
    }

    return (
        <div className="min-h-screen bg-black text-slate-100 z-50">

            <Header />
            <h1 className="mb-6 text-2xl font-semibold mt-8 text-center">Search Results for {nameParam}</h1>

            {nameParam && domains.length === 0 && (
                <div className="rounded-lg border border-slate-700/50 bg-slate-900 p-8 text-center">
                    <p className="text-slate-400">No domains found.</p>
                </div>
            )}
            <div className="flex flex-col justify-center items-center pb-20">
                {domains.length > 0 && (
                    <ul className="relative space-y-3 w-1/2">
                        {domains.map((d) => (
                            <li key={d.name} className="flex items-center justify-between rounded-md border border-purple-400/30 bg-black p-4 z-50">
                                <span className="text-slate-200">{d.name}</span>
                                <span className="text-xs text-slate-400">Expires: {new Date(d.expiresAt).toLocaleDateString()}</span>
                                <Button className="bg-purple-400 px-6 z-50">Buy</Button>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    )
}


