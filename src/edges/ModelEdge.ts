import {ApiEdgeDefinition, ApiEdgeError, ApiEdgeQueryContext, ApiEdgeQueryResponse, ApiEdgeQueryFilter, ApiEdgeQueryFilterType} from "api-core";

export class Model {
    id: string;

    constructor(obj: any) {
        this.id = obj.id;
    }
}

export class ModelEdge<ModelType extends Model> implements ApiEdgeDefinition {

    name = "entry";
    pluralName = "entries";

    provider: ModelType[] = [];
    protected createModel: (obj: any) => ModelType;

    methods: any = {};
    relations = [];

    inspect = () => `/${this.pluralName}`;

    private applyMapping(item: any, fields: string[]): any {
        if(!fields.length) return item;
        let output: any = {};
        Object.keys(item).filter(key => fields.indexOf(key) != -1).forEach(key => output[key] = item[key]);
        return output
    }

    private applyFilter(item: any, filter: ApiEdgeQueryFilter): boolean {
        switch(filter.type) {
            case ApiEdgeQueryFilterType.Equals:
                return item[filter.field] === filter.value;
            case ApiEdgeQueryFilterType.NotEquals:
                return item[filter.field] !== filter.value;
            case ApiEdgeQueryFilterType.GreaterThan:
                return item[filter.field] > filter.value;
            case ApiEdgeQueryFilterType.GreaterThanOrEquals:
                return item[filter.field] >= filter.value;
            case ApiEdgeQueryFilterType.LowerThan:
                return item[filter.field] < filter.value;
            case ApiEdgeQueryFilterType.LowerThanOrEquals:
                return item[filter.field] <= filter.value;
            default:
                return false;
        }
    }

    private applyFilters(item: any, filters: ApiEdgeQueryFilter[]): boolean {
        if(!filters.length) return true;
        return filters.every(filter => this.applyFilter(item, filter))
    }

    getEntry = (context: ApiEdgeQueryContext): Promise<ApiEdgeQueryResponse> => {
        return new Promise<ApiEdgeQueryResponse>((resolve, reject) => {
            let entry = this.provider.find(s => s.id === context.id && this.applyFilters(s, context.filters));
            if(entry) resolve(new ApiEdgeQueryResponse(this.applyMapping(entry, context.fields)));
            else reject(new ApiEdgeError(404, "Not Found"));
        })
    };

    listEntries = (context: ApiEdgeQueryContext): Promise<ApiEdgeQueryResponse> => {
        return new Promise<ApiEdgeQueryResponse>((resolve) => {
            resolve(new ApiEdgeQueryResponse(
                this.provider
                    .filter(item => this.applyFilters(item, context.filters))
                    .map(entry => this.applyMapping(entry, context.fields))))
        })
    };

    createEntry = (context: ApiEdgeQueryContext, body: any): Promise<ApiEdgeQueryResponse> => {
        return new Promise<ApiEdgeQueryResponse>((resolve) => {
            let entry = this.createModel(body);
            this.provider.push(entry);
            resolve(new ApiEdgeQueryResponse(this.applyMapping(entry, context.fields)))
        })
    };

    updateEntry = (context: ApiEdgeQueryContext, body: any): Promise<ApiEdgeQueryResponse> => {
        return new Promise<ApiEdgeQueryResponse>((resolve, reject) => {
            this.getEntry(context).then(entry => {
                Object.keys(body).forEach(key => entry[key] = body[key]);
                resolve(new ApiEdgeQueryResponse(this.applyMapping(entry, context.fields)))
            }).catch(reject)
        })
    };

    updateEntries = (context: ApiEdgeQueryContext, body: any): Promise<ApiEdgeQueryResponse> => {
        return new Promise<ApiEdgeQueryResponse>((resolve, reject) => {
            this.listEntries(context).then(entries => {
                entries.data.forEach(entry =>
                    Object.keys(body).forEach(key => entry[key] = body[key]));
                resolve(new ApiEdgeQueryResponse(entries.data.map(entry => this.applyMapping(entry, context.fields))))
            }).catch(reject)
        })
    };

    removeEntry = (context: ApiEdgeQueryContext): Promise<ApiEdgeQueryResponse> => {
        return new Promise<ApiEdgeQueryResponse>((resolve, reject) => {
            this.getEntry(context).then(entry => {
                this.provider.splice(this.provider.indexOf(entry), 1);
                resolve(new ApiEdgeQueryResponse(entry))
            }).catch(reject);
        })
    };

    removeEntries = (context: ApiEdgeQueryContext): Promise<ApiEdgeQueryResponse> => {
        return new Promise<ApiEdgeQueryResponse>((resolve, reject) => {
            this.listEntries(context).then(entries => {
                entries.data.forEach(entry =>
                    this.provider.splice(this.provider.indexOf(entry), 1));
                resolve(new ApiEdgeQueryResponse(entries.data)) //TODO
            }).catch(reject)
        })
    };

    exists = (context: ApiEdgeQueryContext): Promise<ApiEdgeQueryResponse> => {
        return new Promise<ApiEdgeQueryResponse>((resolve) => {
            let entry = this.provider.find((s: any) => s.id === context.id);
            if(entry) resolve(new ApiEdgeQueryResponse(true));
            else resolve(new ApiEdgeQueryResponse(false));
        })
    };

    callMethod = (context: ApiEdgeQueryContext, body: any): Promise<ApiEdgeQueryResponse> => {
        return this.methods[context.id](context, body);
    }

}
