import { ApiEdgeQueryContext, ApiEdgeQueryResponse } from "api-core";
export interface QueryScope {
    context: ApiEdgeQueryContext;
    response: ApiEdgeQueryResponse | null;
}
export interface QueryStep {
    execute(scope: QueryScope): Promise<QueryScope>;
}
export declare class ApiQuery {
    steps: QueryStep[];
    unshift: (step: QueryStep) => ApiQuery;
    push: (step: QueryStep) => ApiQuery;
    execute: () => Promise<ApiEdgeQueryResponse>;
}
