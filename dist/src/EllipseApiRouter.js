"use strict";
const api_core_1 = require("api-core");
const Router = require('ellipse').Router;
class EllipseApiRouter extends Router {
    constructor(...apis) {
        super();
        this.apply = (app) => {
            let router = this;
            app.all('/api/v:version/*', function (req, res, next) {
                let index = router.apiVersions.indexOf(req.params.version);
                if (index == -1) {
                    this.error = new api_core_1.ApiEdgeError(400, "Unsupported API version");
                    next();
                }
                else {
                    this.api = router.apis[index];
                    req.path = req.path.replace(`/api/v${this.api.version}/`, '');
                    next();
                }
            });
            app.all('/api/*', function (req, res, next) {
                if (!this.api)
                    this.api = router.defaultApi;
                req.path = req.path.replace('/api/', '');
                next();
            });
            app.use(function (req, res, next) {
                if (this.error || !this.api)
                    next();
                else {
                    try {
                        let request = this.api.parseRequest(req.path.split('/'));
                        if (req.query.fields)
                            request.context.fields = req.query.fields.split(',');
                        if (req.query.sort)
                            req.query.sort.split(',')
                                .forEach((s) => request.context.sort(s.substring(s[0] == '-' ? 1 : 0), s[0] !== '-'));
                        let limit = +req.query.limit, skip = +req.query.skip, page = +req.query.page;
                        if (limit === limit ||
                            skip === skip ||
                            page === page) {
                            limit = limit || 10;
                            if (page)
                                skip = (page - 1) * limit;
                            else
                                skip = skip || 0;
                            request.context.paginate(skip, limit);
                        }
                        if (req.body)
                            request.body = req.body;
                        switch (req.method) {
                            case "GET":
                                request.type = api_core_1.ApiRequestType.Read;
                                break;
                            case "POST":
                                request.type = api_core_1.ApiRequestType.Create;
                                break;
                            case "PUT":
                                request.type = api_core_1.ApiRequestType.Update;
                                break;
                            case "PATCH":
                                request.type = api_core_1.ApiRequestType.Patch;
                                break;
                            case "DELETE":
                                request.type = api_core_1.ApiRequestType.Delete;
                                break;
                        }
                        console.log(request.path);
                        let query = this.api.buildQuery(request);
                        console.log(query.steps);
                        query.execute()
                            .then((resp) => {
                            this.json = resp.data;
                            if (resp.metadata) {
                                if (resp.metadata.pagination) {
                                    let total = resp.metadata.pagination.total || 0;
                                    res.setHeader('X-Total-Count', page ? Math.ceil(total / limit) : total);
                                }
                            }
                            this.send();
                        })
                            .catch((e) => {
                            this.error = e;
                            next();
                        });
                    }
                    catch (e) {
                        this.error = e;
                        next();
                    }
                }
            });
            app.use(function () {
                let e = this.error;
                if (e instanceof api_core_1.ApiEdgeError) {
                    this.status = e.status;
                    this.send(e.message);
                }
                else {
                    if (e)
                        console.log(e);
                    this.status = 500;
                    this.send("Internal Server Error");
                }
            });
        };
        this.apis = apis;
        this.defaultApi = apis[0];
        this.apiVersions = apis.map(api => api.version);
    }
}
exports.EllipseApiRouter = EllipseApiRouter;
//# sourceMappingURL=EllipseApiRouter.js.map