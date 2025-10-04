import { gql, GraphQLClient } from "graphql-request";

export class Subgraph {
    private client: GraphQLClient;


    constructor() {
        this.client = new GraphQLClient(process.env.DOMA_GQL_URL!, {
            headers: {
                "API-Key": process.env.DOMA_API_KEY!,
                "Content-Type": "application/json",
            },
        });
    }

    async searchDomains(skip: number, take: number, name?: string, sortBy?: "DOMAIN" | "EXPIRES_AT" | "VALUE") {
        console.log("🔍 Searching for domains:", name);
        const query = gql`
        query GetTokenizedNames ($skip: Int, $take: Int, $name: String, $sortBy: NamesQuerySortBy) {
      names(skip: $skip, take: $take, name: $name, sortBy: $sortBy) {
        items {
            name
            expiresAt
            tokenizedAt
        }
        totalCount
        pageSize
        currentPage
        totalPages
        hasPreviousPage
        hasNextPage
      }
    }
        `;
        const data = await this.client.request(query, { skip, take, name, sortBy }) as { names: { items: { name: string, expiresAt: string, tokenizedAt: string }[], totalCount: number, pageSize: number, currentPage: number, totalPages: number, hasPreviousPage: boolean, hasNextPage: boolean } };
        return data.names;
    }


}