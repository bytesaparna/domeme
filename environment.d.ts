declare namespace NodeJS {
    interface ProcessEnv {
        DOMA_GQL_URL: string;
        DOMA_API_KEY: string;
        D3_API_URL: string;
        D3_API_KEY: string;

        CLICKHOUSE_URL: string;
        CLICKHOUSE_USERNAME: string;
        CLICKHOUSE_PASSWORD: string;
        CLICKHOUSE_DATABASE: string;

        OPENAI_API_KEY: string;
    }
}
