import { Api } from "api-core";
export declare class ExpressApiProvider {
    defaultApi: Api;
    apis: Api[];
    private apiVersions;
    constructor(...apis: Api[]);
    apply: (app: any) => void;
}
