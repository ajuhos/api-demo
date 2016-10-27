"use strict";
const ModelEdge_1 = require("../edges/ModelEdge");
class Course extends ModelEdge_1.Model {
    constructor(obj) {
        super(obj);
        this.name = obj.name;
        this.courseTypeId = obj.courseTypeId;
        this.classId = obj.classId;
    }
    static create(id, name, courseTypeId, classId) {
        return new Course({ id, name, courseTypeId, classId });
    }
}
exports.Course = Course;
//# sourceMappingURL=Course.js.map