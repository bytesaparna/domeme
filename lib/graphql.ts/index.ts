import { gql, GraphQLClient } from "graphql-request";

export class Subgraph {
    private client: GraphQLClient;


    constructor() {
        this.client = new GraphQLClient(process.env.DOMA_SUBGRAPH_API_URL!, {
            headers: {
                "API-Key": process.env.DOMA_API_KEY!,
                "Content-Type": "application/json",
            },
        });
    }

    async searchDomains(skip: number, take: number, name: string) {
        console.log("🔍 Searching for domains:", name);
        const query = gql`
        query GetTokenizedNames ($skip: Int, $take: Int, $name: String!) {
      names(skip: $skip, take: $take, name: $name) {
        items {
          name
          expiresAt
          tokenizedAt
        }
      }
    }
        `;
        try {
            console.log("🔍 Requesting domains:", { skip, take, name });
            const data: any = await this.client.request(query, { skip, take, name });
            console.log("🔍 Domains received:", data.names.items);
            const tokenizedNames = data.names.items.map((item: any) => ({
                name: item.name,
                expiresAt: item.expiresAt,
                tokenizedAt: item.tokenizedAt,
            }));
            console.log("🔍 Domains mapped:", tokenizedNames);
            return tokenizedNames;
        } catch (error) {
            console.error("❌ Error searching domains:", error);
            return [];
        }
    }


}