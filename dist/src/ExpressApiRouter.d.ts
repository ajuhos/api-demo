import { Api } from "api-core";
import { Router } from "express";
export declare class ExpressApiRouter extends Router {
    defaultApi: Api;
    apis: Api[];
    private apiVersions;
    constructor(...apis: Api[]);
    apply: (app: any) => void;
}
