import { Api } from "./Api";
import { ApiRequest, ApiRequestPath } from "./ApiRequest";
export declare class ApiRequestPathParser {
    api: Api;
    constructor(api: Api);
    private findEdgeByName(name);
    private findRelationByName(edge, name);
    parse(segments: string[]): ApiRequestPath;
}
export declare class ApiRequestParser {
    api: Api;
    private pathParser;
    constructor(api: Api);
    parse(segments: string[]): ApiRequest;
}
