"use strict";
const RawDataProvider_1 = require("../data/RawDataProvider");
const ModelEdge_1 = require("./ModelEdge");
const School_1 = require("../model/School");
class SchoolEdge extends ModelEdge_1.ModelEdge {
    constructor() {
        super(...arguments);
        this.name = "school";
        this.pluralName = "schools";
        this.provider = RawDataProvider_1.RawDataProvider.schools;
        this.createModel = (obj) => new School_1.School(obj);
    }
}
exports.SchoolEdge = SchoolEdge;
//# sourceMappingURL=SchoolEdge.js.map