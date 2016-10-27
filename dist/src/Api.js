"use strict";
const ApiRequestParser_1 = require("./ApiRequestParser");
const ApiQueryBuilder_1 = require("./ApiQueryBuilder");
class Api {
    constructor(version, ...edges) {
        this.edges = [];
        this.parseRequest = (requestParts) => {
            return this.parser.parse(requestParts);
        };
        this.buildQuery = (request) => {
            return this.queryBuilder.build(request);
        };
        this.version = version;
        this.edges = edges;
        this.parser = new ApiRequestParser_1.ApiRequestParser(this);
        this.queryBuilder = new ApiQueryBuilder_1.ApiQueryBuilder(this);
    }
    edge(edge) {
        this.edges.push(edge);
        return this;
    }
    ;
    relation(relation) {
        relation.from.relations.push(relation);
        relation.to.relations.push(relation);
        return this;
    }
}
exports.Api = Api;
//# sourceMappingURL=Api.js.map