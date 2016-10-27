"use strict";
const api_core_1 = require("api-core");
class ApiQuery {
    constructor() {
        this.steps = [];
        this.unshift = (step) => {
            this.steps.unshift(step);
            return this;
        };
        this.push = (step) => {
            this.steps.push(step);
            return this;
        };
        this.execute = () => {
            return new Promise((resolve, reject) => {
                let next = (scope) => {
                    let step = this.steps.shift();
                    if (step) {
                        if (this.steps.length) {
                            step.execute(scope).then(next).catch(reject);
                        }
                        else {
                            step.execute(scope).then(scope => resolve(scope.response || new api_core_1.ApiEdgeQueryResponse(null))).catch(reject);
                        }
                    }
                };
                next({ context: new api_core_1.ApiEdgeQueryContext(), response: null });
            });
        };
    }
}
exports.ApiQuery = ApiQuery;
//# sourceMappingURL=ApiQuery.js.map