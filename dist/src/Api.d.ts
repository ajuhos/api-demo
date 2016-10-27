import { ApiEdgeDefinition, ApiEdgeRelation } from "api-core";
import { ApiRequest } from "./ApiRequest";
import { ApiQuery } from "./ApiQuery";
export declare class Api {
    version: string;
    edges: ApiEdgeDefinition[];
    private parser;
    private queryBuilder;
    constructor(version: string, ...edges: ApiEdgeDefinition[]);
    parseRequest: (requestParts: string[]) => ApiRequest;
    buildQuery: (request: ApiRequest) => ApiQuery;
    edge(edge: ApiEdgeDefinition): this;
    relation(relation: ApiEdgeRelation): this;
}
