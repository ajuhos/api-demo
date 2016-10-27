"use strict";
const RawDataProvider_1 = require("../data/RawDataProvider");
const ModelEdge_1 = require("./ModelEdge");
const Course_1 = require("../model/Course");
class CourseEdge extends ModelEdge_1.ModelEdge {
    constructor() {
        super(...arguments);
        this.name = "course";
        this.pluralName = "courses";
        this.provider = RawDataProvider_1.RawDataProvider.courses;
        this.createModel = (obj) => new Course_1.Course(obj);
    }
}
exports.CourseEdge = CourseEdge;
//# sourceMappingURL=CourseEdge.js.map