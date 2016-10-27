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
                        if (req.body)
                            request.body = req.body;
                        switch (req.method) {
                            case "GET":
                                request.type = api_core_1.ApiRequestType.Read;
                                break;
                            case "PUT":
                                request.type = api_core_1.ApiRequestType.Create;
                                break;
                            case "POST":
                            case "PATCH":
                                request.type = api_core_1.ApiRequestType.Update;
                                break;
                            case "DELETE":
                                request.type = api_core_1.ApiRequestType.Delete;
                                break;
                        }
                        console.log(request.path);
                        let query = this.api.buildQuery(request);
                        console.log(query.steps);
                        query.execute()
                            .then((res) => {
                            this.json = res.data;
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