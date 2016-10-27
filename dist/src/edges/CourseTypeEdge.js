"use strict";
const RawDataProvider_1 = require("../data/RawDataProvider");
const ModelEdge_1 = require("./ModelEdge");
const CourseType_1 = require("../model/CourseType");
class CourseTypeEdge extends ModelEdge_1.ModelEdge {
    constructor() {
        super(...arguments);
        this.name = "courseType";
        this.pluralName = "courseTypes";
        this.provider = RawDataProvider_1.RawDataProvider.courseTypes;
        this.createModel = (obj) => new CourseType_1.CourseType(obj);
    }
}
exports.CourseTypeEdge = CourseTypeEdge;
//# sourceMappingURL=CourseTypeEdge.js.map