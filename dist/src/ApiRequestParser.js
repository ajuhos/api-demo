"use strict";
const api_core_1 = require("api-core");
const ApiRequest_1 = require("./ApiRequest");
class ApiRequestPathParser {
    constructor(api) {
        this.api = api;
    }
    findEdgeByName(name) {
        return this.api.edges.find(edge => edge.pluralName === name);
    }
    findRelationByName(edge, name) {
        return edge.relations.find(rel => rel.name === name);
    }
    parse(segments) {
        let requestPath = new ApiRequest_1.ApiRequestPath();
        let lastEdge = null, lastRelation = null, wasEntry = false;
        while (segments.length) {
            let segment = segments.shift();
            if (lastEdge) {
                let relation = this.findRelationByName(lastEdge, segment);
                if (relation) {
                    if (relation instanceof api_core_1.OneToOneRelation) {
                        requestPath.add(new ApiRequest_1.RelatedFieldPathSegment(lastEdge, relation));
                        lastEdge = relation.to;
                        lastRelation = relation;
                        wasEntry = true;
                    }
                    else if (wasEntry && relation instanceof api_core_1.OneToManyRelation) {
                        lastEdge = relation.to;
                        lastRelation = relation;
                        wasEntry = false;
                    }
                    else {
                        throw new api_core_1.ApiEdgeError(400, "Unsupported Relation: " + segment);
                    }
                }
                else if (!wasEntry) {
                    requestPath.add(new ApiRequest_1.EntryPathSegment(lastEdge, segment, lastRelation));
                    wasEntry = true;
                }
                else {
                    throw new api_core_1.ApiEdgeError(400, `Missing Relation: ${lastEdge.name} -> ${segment}`);
                }
            }
            else {
                let edge = this.findEdgeByName(segment);
                if (edge) {
                    lastEdge = edge;
                    wasEntry = false;
                }
                else {
                    throw new api_core_1.ApiEdgeError(400, "Missing Edge: " + segment);
                }
            }
        }
        if (lastEdge && !wasEntry) {
            requestPath.add(new ApiRequest_1.EdgePathSegment(lastEdge, lastRelation));
            lastEdge = null;
        }
        return requestPath;
    }
}
exports.ApiRequestPathParser = ApiRequestPathParser;
class ApiRequestParser {
    constructor(api) {
        this.api = api;
        this.pathParser = new ApiRequestPathParser(api);
    }
    parse(segments) {
        let request = new ApiRequest_1.ApiRequest();
        request.path = this.pathParser.parse(segments);
        return request;
    }
}
exports.ApiRequestParser = ApiRequestParser;
//# sourceMappingURL=ApiRequestParser.js.map