import { Button } from "@/components/ui/button"
import { Subgraph } from "@/lib/graphql.ts"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

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
        <div className="min-h-screen bg-black text-slate-100 px-10 py-10 z-50 flex flex-col items-center">
             <Link href="/" className="fixed top-10 right-14 z-50">
                <Button variant="ghost" className="mb-4 text-slate-400 hover:bg-purple-400">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Explore
                </Button>
            </Link>
            <h1 className="mb-6 text-2xl font-semibold">Search Results for {nameParam}</h1>
           
            {nameParam && domains.length === 0 && (
                <div className="rounded-lg border border-slate-700/50 bg-slate-900 p-8 text-center">
                    <p className="text-slate-400">No domains found.</p>
                </div>
            )}

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
    )
}


