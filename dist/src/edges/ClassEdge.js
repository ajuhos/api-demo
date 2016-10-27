"use strict";
const RawDataProvider_1 = require("../data/RawDataProvider");
const ModelEdge_1 = require("./ModelEdge");
const Class_1 = require("../model/Class");
class ClassEdge extends ModelEdge_1.ModelEdge {
    constructor() {
        super(...arguments);
        this.name = "class";
        this.pluralName = "classes";
        this.provider = RawDataProvider_1.RawDataProvider.classes;
        this.createModel = (obj) => new Class_1.Class(obj);
    }
}
exports.ClassEdge = ClassEdge;
//# sourceMappingURL=ClassEdge.js.map