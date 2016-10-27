"use strict";
const api_core_1 = require("api-core");
class PathSegment {
    constructor() {
        this.inspect = () => {
            return '';
        };
    }
}
exports.PathSegment = PathSegment;
class EdgePathSegment extends PathSegment {
    constructor(edge, relation) {
        super();
        this.inspect = () => {
            return `[${this.edge.name}]`;
        };
        this.edge = edge;
        this.relation = relation;
    }
}
exports.EdgePathSegment = EdgePathSegment;
class EntryPathSegment extends PathSegment {
    constructor(edge, id, relation) {
        super();
        this.inspect = () => {
            return `${this.edge.name}(${this.id})`;
        };
        this.edge = edge;
        this.relation = relation;
        this.id = id;
    }
}
exports.EntryPathSegment = EntryPathSegment;
class RelatedFieldPathSegment extends PathSegment {
    constructor(edge, relation) {
        super();
        this.inspect = () => {
            return `${this.edge.name}.${this.relation.name}`;
        };
        this.edge = edge;
        this.relation = relation;
    }
}
exports.RelatedFieldPathSegment = RelatedFieldPathSegment;
class ApiRequestPath {
    constructor() {
        this.segments = [];
        this.add = (segment) => {
            this.segments.push(segment);
        };
        this.inspect = () => {
            return this.segments.map(segment => segment.inspect()).join(' -> ');
        };
    }
}
exports.ApiRequestPath = ApiRequestPath;
(function (ApiRequestType) {
    ApiRequestType[ApiRequestType["Create"] = 0] = "Create";
    ApiRequestType[ApiRequestType["Read"] = 1] = "Read";
    ApiRequestType[ApiRequestType["Update"] = 2] = "Update";
    ApiRequestType[ApiRequestType["Delete"] = 3] = "Delete";
    ApiRequestType[ApiRequestType["Exists"] = 4] = "Exists";
})(exports.ApiRequestType || (exports.ApiRequestType = {}));
var ApiRequestType = exports.ApiRequestType;
class ApiRequestParameter {
    constructor(name, value) {
        this.name = name;
        this.value = value;
    }
}
exports.ApiRequestParameter = ApiRequestParameter;
class ApiRequest {
    constructor() {
        this.path = new ApiRequestPath();
        this.type = ApiRequestType.Read;
        this.context = new api_core_1.ApiEdgeQueryContext();
    }
}
exports.ApiRequest = ApiRequest;
//# sourceMappingURL=ApiRequest.js.map