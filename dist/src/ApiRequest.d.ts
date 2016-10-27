import { ApiEdgeDefinition, OneToOneRelation, OneToManyRelation, ApiEdgeQueryContext } from "api-core";
export declare class PathSegment {
    edge: ApiEdgeDefinition;
    relation: OneToManyRelation;
    inspect: () => string;
}
export declare class EdgePathSegment extends PathSegment {
    edge: ApiEdgeDefinition;
    relation: OneToManyRelation;
    constructor(edge: ApiEdgeDefinition, relation: OneToManyRelation);
    inspect: () => string;
}
export declare class EntryPathSegment extends PathSegment {
    edge: ApiEdgeDefinition;
    relation: OneToManyRelation;
    id: string;
    constructor(edge: ApiEdgeDefinition, id: string, relation: OneToManyRelation);
    inspect: () => string;
}
export declare class RelatedFieldPathSegment extends PathSegment {
    edge: ApiEdgeDefinition;
    relation: OneToOneRelation;
    constructor(edge: ApiEdgeDefinition, relation: OneToOneRelation);
    inspect: () => string;
}
export declare class ApiRequestPath {
    segments: PathSegment[];
    add: (segment: PathSegment) => void;
    inspect: () => string;
}
export declare enum ApiRequestType {
    Create = 0,
    Read = 1,
    Update = 2,
    Delete = 3,
    Exists = 4,
}
export declare class ApiRequestParameter {
    name: string;
    value: any;
    constructor(name: string, value: any);
}
export declare class ApiRequest {
    type: ApiRequestType;
    path: ApiRequestPath;
    context: ApiEdgeQueryContext;
    constructor();
}
