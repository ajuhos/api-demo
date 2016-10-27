"use strict";
const ApiQuery_1 = require("./ApiQuery");
const ApiRequest_1 = require("./ApiRequest");
const api_core_1 = require("api-core");
class QueryEdgeQueryStep {
    constructor(query) {
        this.execute = (scope) => {
            return new Promise((resolve, reject) => {
                this.query.context = scope.context;
                this.query.execute().then((response) => {
                    scope.context = new api_core_1.ApiEdgeQueryContext();
                    scope.response = response;
                    resolve(scope);
                }).catch(reject);
            });
        };
        this.inspect = () => `QUERY /${this.query.edge.pluralName}`;
        this.query = query;
    }
}
class RelateQueryStep {
    constructor(relation) {
        this.execute = (scope) => {
            return new Promise((resolve, reject) => {
                if (!scope.response)
                    return reject(new api_core_1.ApiEdgeError(404, "Missing Related Entry"));
                scope.context.filter(this.relation.relationId, api_core_1.ApiEdgeQueryFilterType.Equals, scope.response.data.id);
                resolve(scope);
            });
        };
        this.inspect = () => `RELATE ${this.relation.relationId}`;
        this.relation = relation;
    }
}
class CheckResponseQueryStep {
    constructor() {
        this.execute = (scope) => {
            return new Promise((resolve, reject) => {
                if (!scope.response)
                    return reject(new api_core_1.ApiEdgeError(404, "Missing Related Entry"));
                resolve(scope);
            });
        };
        this.inspect = () => `CHECK`;
    }
}
class NotImplementedQueryStep {
    constructor(description) {
        this.execute = (scope) => {
            return new Promise(resolve => {
                resolve(scope);
            });
        };
        this.inspect = () => `NOT IMPLEMENTED: ${this.description}`;
        this.description = description;
    }
}
class SetResponseQueryStep {
    constructor(response) {
        this.execute = (scope) => {
            return new Promise(resolve => {
                scope.response = this.response;
                scope.context = new api_core_1.ApiEdgeQueryContext();
                resolve(scope);
            });
        };
        this.inspect = () => `SET RESPONSE`;
        this.response = response;
    }
}
class ProvideIdQueryStep {
    constructor(fieldName = "id") {
        this.execute = (scope) => {
            return new Promise((resolve, reject) => {
                if (!scope.response)
                    return reject(new api_core_1.ApiEdgeError(404, "Missing Entry"));
                scope.context.id = scope.response.data[this.fieldName];
                resolve(scope);
            });
        };
        this.inspect = () => `PROVIDE ID: ${this.fieldName}`;
        this.fieldName = fieldName;
    }
}
class ExtendContextQueryStep {
    constructor(context) {
        this.execute = (scope) => {
            return new Promise(resolve => {
                scope.context.id = this.context.id || scope.context.id;
                if (this.context.pagination) {
                    scope.context.pagination = this.context.pagination;
                }
                this.context.fields.forEach(f => scope.context.fields.push(f));
                this.context.populatedFields.forEach(f => scope.context.populatedFields.push(f));
                this.context.filters.forEach(f => scope.context.filters.push(f));
                resolve(scope);
            });
        };
        this.inspect = () => {
            if (this.context.id) {
                return `EXTEND CONTEXT (id=${this.context.id})`;
            }
            else {
                return `APPLY PARAMETERS`;
            }
        };
        this.context = context;
    }
}
class GenericQueryStep {
    constructor(description, step, context) {
        this.execute = (scope) => {
            return this.step.apply(this.context, [scope]);
        };
        this.inspect = () => this.description;
        this.description = description;
        this.step = step;
        this.context = context;
    }
}
class ApiQueryBuilder {
    constructor(api) {
        this.buildReadQuery = (request) => {
            let query = new ApiQuery_1.ApiQuery();
            let segments = request.path.segments, lastSegment = segments[segments.length - 1];
            let baseQuery;
            if (lastSegment instanceof ApiRequest_1.EdgePathSegment) {
                baseQuery = new api_core_1.ApiEdgeQuery(lastSegment.edge, api_core_1.ApiEdgeQueryType.List);
            }
            else if (lastSegment instanceof ApiRequest_1.RelatedFieldPathSegment) {
                baseQuery = new api_core_1.ApiEdgeQuery(lastSegment.relation.to, api_core_1.ApiEdgeQueryType.Get);
            }
            else {
                baseQuery = new api_core_1.ApiEdgeQuery(lastSegment.edge, api_core_1.ApiEdgeQueryType.Get);
            }
            query.unshift(new QueryEdgeQueryStep(baseQuery));
            query.unshift(new ExtendContextQueryStep(request.context));
            if (lastSegment instanceof ApiRequest_1.EntryPathSegment) {
                query.unshift(new ExtendContextQueryStep(new api_core_1.ApiEdgeQueryContext(lastSegment.id)));
            }
            else if (lastSegment instanceof ApiRequest_1.RelatedFieldPathSegment) {
                query.unshift(new ProvideIdQueryStep(lastSegment.relation.relationId));
            }
            else {
            }
            let readMode = true;
            for (let i = segments.length - 2; i >= 0; i--) {
                let currentSegment = segments[i];
                let relation = segments[i + 1].relation;
                if (relation && !(relation instanceof api_core_1.OneToOneRelation)) {
                    query.unshift(new RelateQueryStep(relation));
                }
                if (readMode) {
                    readMode = this.buildReadStep(query, currentSegment);
                }
                else {
                    readMode = this.buildCheckStep(query, currentSegment);
                }
            }
            return query;
        };
        this.build = (request) => {
            switch (request.type) {
                case ApiRequest_1.ApiRequestType.Read:
                    return this.buildReadQuery(request);
                default:
                    throw "Unsupported Query Type";
            }
        };
        this.api = api;
    }
    buildProvideIdStep(query, currentSegment) {
        if (currentSegment instanceof ApiRequest_1.EntryPathSegment) {
            query.unshift(new ExtendContextQueryStep(new api_core_1.ApiEdgeQueryContext(currentSegment.id)));
            return false;
        }
        else if (currentSegment instanceof ApiRequest_1.RelatedFieldPathSegment) {
            query.unshift(new ProvideIdQueryStep(currentSegment.relation.relationId));
            return true;
        }
        else {
            return false;
        }
    }
    buildCheckStep(query, currentSegment) {
        if (currentSegment instanceof ApiRequest_1.EntryPathSegment) {
            query.unshift(new SetResponseQueryStep(new api_core_1.ApiEdgeQueryResponse({ id: currentSegment.id })));
            return false;
        }
        else if (currentSegment instanceof ApiRequest_1.RelatedFieldPathSegment) {
            query.unshift(new QueryEdgeQueryStep(new api_core_1.ApiEdgeQuery(currentSegment.relation.to, api_core_1.ApiEdgeQueryType.Get)));
        }
        else {
            return false;
        }
        return this.buildProvideIdStep(query, currentSegment);
    }
    buildReadStep(query, currentSegment) {
        if (currentSegment instanceof ApiRequest_1.RelatedFieldPathSegment) {
            query.unshift(new QueryEdgeQueryStep(new api_core_1.ApiEdgeQuery(currentSegment.relation.to, api_core_1.ApiEdgeQueryType.Get)));
        }
        else {
            query.unshift(new QueryEdgeQueryStep(new api_core_1.ApiEdgeQuery(currentSegment.edge, api_core_1.ApiEdgeQueryType.Get)));
        }
        return this.buildProvideIdStep(query, currentSegment);
    }
}
exports.ApiQueryBuilder = ApiQueryBuilder;
//# sourceMappingURL=ApiQueryBuilder.js.map