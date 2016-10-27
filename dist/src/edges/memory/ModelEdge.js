"use strict";
const api_core_1 = require("api-core");
const uuid = require('node-uuid');
class Model {
    constructor(obj) {
        this.id = obj.id;
    }
}
exports.Model = Model;
class ModelEdge {
    constructor() {
        this.name = "entry";
        this.pluralName = "entries";
        this.provider = [];
        this.methods = {};
        this.relations = [];
        this.inspect = () => `/${this.pluralName}`;
        this.getEntry = (context) => {
            return new Promise((resolve, reject) => {
                let entry = this.provider.find(s => s.id === context.id && this.applyFilters(s, context.filters));
                if (entry)
                    resolve(new api_core_1.ApiEdgeQueryResponse(this.applyMapping(entry, context.fields)));
                else
                    reject(new api_core_1.ApiEdgeError(404, "Not Found"));
            });
        };
        this.listEntries = (context) => {
            return new Promise((resolve) => {
                resolve(new api_core_1.ApiEdgeQueryResponse(this.provider
                    .filter(item => this.applyFilters(item, context.filters))
                    .map(entry => this.applyMapping(entry, context.fields))));
            });
        };
        this.createEntry = (context, body) => {
            return new Promise((resolve) => {
                body = body || {};
                body.id = uuid.v4();
                let entry = this.createModel(body);
                this.provider.push(entry);
                resolve(new api_core_1.ApiEdgeQueryResponse(this.applyMapping(entry, context.fields)));
            });
        };
        this.updateEntry = (context, body) => {
            return new Promise((resolve, reject) => {
                this.getEntry(context).then(entry => {
                    Object.keys(body).forEach(key => entry[key] = body[key]);
                    resolve(new api_core_1.ApiEdgeQueryResponse(this.applyMapping(entry, context.fields)));
                }).catch(reject);
            });
        };
        this.updateEntries = (context, body) => {
            return new Promise((resolve, reject) => {
                this.listEntries(context).then(entries => {
                    entries.data.forEach(entry => Object.keys(body).forEach(key => entry[key] = body[key]));
                    resolve(new api_core_1.ApiEdgeQueryResponse(entries.data.map(entry => this.applyMapping(entry, context.fields))));
                }).catch(reject);
            });
        };
        this.removeEntry = (context, body) => {
            return new Promise((resolve, reject) => {
                this.getEntry(context).then(entry => {
                    this.provider.splice(this.provider.indexOf(entry), 1);
                    resolve(new api_core_1.ApiEdgeQueryResponse(entry));
                }).catch(reject);
            });
        };
        this.removeEntries = (context) => {
            return new Promise((resolve, reject) => {
                this.listEntries(context).then(entries => {
                    entries.data.forEach(entry => this.provider.splice(this.provider.indexOf(entry), 1));
                    resolve(new api_core_1.ApiEdgeQueryResponse(entries.data));
                }).catch(reject);
            });
        };
        this.exists = (context) => {
            return new Promise((resolve) => {
                let entry = this.provider.find((s) => s.id === context.id);
                if (entry)
                    resolve(new api_core_1.ApiEdgeQueryResponse(true));
                else
                    resolve(new api_core_1.ApiEdgeQueryResponse(false));
            });
        };
        this.callMethod = (context, body) => {
            return this.methods["" + context.id](context, body);
        };
    }
    applyMapping(item, fields) {
        if (!fields.length)
            return item;
        let output = {};
        Object.keys(item).filter(key => fields.indexOf(key) != -1).forEach(key => output[key] = item[key]);
        return output;
    }
    applyFilter(item, filter) {
        switch (filter.type) {
            case api_core_1.ApiEdgeQueryFilterType.Equals:
                return item[filter.field] === filter.value;
            case api_core_1.ApiEdgeQueryFilterType.NotEquals:
                return item[filter.field] !== filter.value;
            case api_core_1.ApiEdgeQueryFilterType.GreaterThan:
                return item[filter.field] > filter.value;
            case api_core_1.ApiEdgeQueryFilterType.GreaterThanOrEquals:
                return item[filter.field] >= filter.value;
            case api_core_1.ApiEdgeQueryFilterType.LowerThan:
                return item[filter.field] < filter.value;
            case api_core_1.ApiEdgeQueryFilterType.LowerThanOrEquals:
                return item[filter.field] <= filter.value;
            default:
                return false;
        }
    }
    applyFilters(item, filters) {
        if (!filters.length)
            return true;
        return filters.every(filter => this.applyFilter(item, filter));
    }
}
exports.ModelEdge = ModelEdge;
//# sourceMappingURL=ModelEdge.js.map