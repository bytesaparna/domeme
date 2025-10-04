import { Header } from "@/components/header"
import { Search } from "@/components/search"
import { Button } from "@/components/ui/button"
import { useTrendingDomainsSearch } from "@/hooks/useTrendingDomains"
import { Subgraph } from "@/lib/graphql.ts"

type SearchPageProps = {
    searchParams?: { [key: string]: string | string[] | undefined }
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
    const nameParam = typeof searchParams?.name === "string" ? searchParams?.name : ""
    return (
        <Search name={nameParam} />
    )
}


