"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator.throw(value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments)).next());
    });
};
var api_core_1 = require("api-core");
var Router = require('ellipse').Router;
function bodyToFieldSet(body) {
    var fieldSet = [];
    Object.keys(body).forEach(function (key) { return fieldSet.push({ key: key, value: body[key] }); });
    return fieldSet;
}
var EllipseApiEdgeRouter = (function (_super) {
    __extends(EllipseApiEdgeRouter, _super);
    function EllipseApiEdgeRouter(edge) {
        var _this = this;
        _super.call(this);
        this.apply = function (app) {
            console.log("adding edge " + _this.edge.name);
            app.use('/' + _this.edge.name, _this);
        };
        this.edge = edge;
        this.get('/', function (req, res, next) {
            return __awaiter(this, void 0, void 0, function* () {
                try {
                    this.json = yield edge.listEntries([]);
                    this.status = 200;
                    this.send();
                }
                catch (e) {
                    this.error = e;
                    next();
                }
            });
        });
        this.post('/', function (req, res, next) {
            return __awaiter(this, void 0, void 0, function* () {
                try {
                    if (!req.body.id) {
                        this.status = 400;
                        this.send('Bad Request');
                    }
                    else {
                        this.json = yield edge.updateEntry(req.body.id, bodyToFieldSet(req.body));
                        this.status = 200;
                        this.send();
                    }
                }
                catch (e) {
                    this.error = e;
                    next();
                }
            });
        });
        this.delete('/', function (req, res, next) {
            return __awaiter(this, void 0, void 0, function* () {
                try {
                    if (!req.body.id) {
                        this.status = 400;
                        this.send('Bad Request');
                    }
                    else {
                        this.json = yield edge.removeEntry(req.body.id);
                        this.status = 200;
                        this.send();
                    }
                }
                catch (e) {
                    this.error = e;
                    next();
                }
            });
        });
        this.put('/', function (req, res, next) {
            return __awaiter(this, void 0, void 0, function* () {
                try {
                    this.json = yield edge.createEntry(req.body);
                    this.status = 201;
                    this.send();
                }
                catch (e) {
                    this.error = e;
                    next();
                }
            });
        });
        this.get('/:id', function (req, res, next) {
            return __awaiter(this, void 0, void 0, function* () {
                try {
                    this.json = yield edge.getEntry(req.params.id);
                    this.status = 200;
                    this.send();
                }
                catch (e) {
                    this.error = e;
                    next();
                }
            });
        });
        this.post('/:id', function (req, res, next) {
            return __awaiter(this, void 0, void 0, function* () {
                try {
                    this.json = yield edge.updateEntry(req.params.id, bodyToFieldSet(req.body));
                    this.status = 200;
                    this.send();
                }
                catch (e) {
                    this.error = e;
                    next();
                }
            });
        });
        this.delete('/:id', function (req, res, next) {
            return __awaiter(this, void 0, void 0, function* () {
                try {
                    this.json = yield edge.removeEntry(req.params.id);
                    this.status = 200;
                    this.send();
                }
                catch (e) {
                    this.error = e;
                    next();
                }
            });
        });
        this.get(/^\/([^\/]*)\/(.*)$/, function (req, res, next) {
            return __awaiter(this, void 0, void 0, function* () {
                var _this = this;
                try {
                    var id = req.params[0];
                    if (yield edge.exists(id)) {
                        var query = req.params[1].split('/');
                        var plan = [];
                        var _loop_1 = function() {
                            var name_1 = query[0], relation = edge.relations.find(function (r) { return r.name === name_1; });
                            if (relation) {
                                plan.push(relation.query(id, query));
                            }
                            else {
                                this_1.status = 400;
                                this_1.send('Bad Request');
                                return { value: void 0 };
                            }
                        };
                        var this_1 = this;
                        while (query.length) {
                            var state_1 = _loop_1();
                            if (typeof state_1 === "object") return state_1.value;
                        }
                        var step_1 = function (result) {
                            if (plan.length) {
                                plan.shift().execute().then(step_1).catch(function (e) {
                                    _this.error = e;
                                    next();
                                });
                            }
                            else {
                                _this.json = result;
                                _this.status = 200;
                                _this.send();
                            }
                        };
                        step_1(null);
                    }
                    else {
                        this.status = 404;
                        this.send('Not Found');
                    }
                }
                catch (e) {
                    this.error = e;
                    next();
                }
            });
        });
        this.use(function (req, res, next) {
            return __awaiter(this, void 0, void 0, function* () {
                var e = this.error;
                if (e instanceof api_core_1.ApiEdgeError) {
                    this.status = e.status;
                    this.send(e.message);
                }
                else {
                    console.log(e);
                    this.status = 500;
                    this.send("Internal Server Error");
                }
            });
        });
    }
    return EllipseApiEdgeRouter;
}(Router));
exports.EllipseApiEdgeRouter = EllipseApiEdgeRouter;
//# sourceMappingURL=EllipseApiEdgeRouter.js.map