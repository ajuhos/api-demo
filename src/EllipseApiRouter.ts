import {ApiEdgeDefinition, ApiEdgeError, ApiEdgeQueryResponse, Api} from "api-core";
const Router = require('ellipse').Router;

export class EllipseApiRouter extends Router {

    defaultApi: Api;
    apis: Api[];

    private apiVersions: string[];

    constructor(...apis: Api[]) {
        super();

        this.apis = apis;
        this.defaultApi = apis[0];

        this.apiVersions = apis.map(api => api.version);
    }

    apply = (app) => {
        let router = this;

        app.get('/api/v:version/*', function(req, res, next) {
            let index = router.apiVersions.indexOf(req.params.version);
            if(index == -1) {
                this.error = new ApiEdgeError(400, "Unsupported API version");
                next()
            }
            else {
                this.api = router.apis[index];
                req.path = req.path.replace(`/api/v${this.api.version}/`, '');
                next()
            }
        });

        app.get('/api/*', function (req, res, next) {
            if(!this.api) this.api = router.defaultApi;
            req.path = req.path.replace('/api/', '');
            next()
        });

        app.use(function(req, res, next) {
            if(this.error || !this.api) next();
            else {
                try {
                    let request = this.api.parseRequest(req.path.split('/'));
                    if (req.query.fields) request.context.fields = req.query.fields.split(',');

                    console.log(request.path);
                    let query = this.api.buildQuery(request);
                    console.log(query.steps);
                    query.execute()
                        .then((res: ApiEdgeQueryResponse) => {
                            this.json = res.data;
                            this.send()
                        })
                        .catch((e: any) => {
                            this.error = e;
                            next()
                        })
                }
                catch (e) {
                    this.error = e;
                    next()
                }
            }
        });

        app.use(function () {
            let e = this.error;
            if(e instanceof ApiEdgeError) {
                this.status = e.status;
                this.send(e.message);
            }
            else {
                if(e) console.log(e);
                this.status = 500;
                this.send("Internal Server Error");
            }
        });
    };

}
