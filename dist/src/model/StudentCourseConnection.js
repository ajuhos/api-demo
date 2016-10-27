"use strict";
const ModelEdge_1 = require("../edges/ModelEdge");
class StudentCourseConnection extends ModelEdge_1.Model {
    constructor(obj) {
        super(obj);
        this.courseId = obj.courseId;
        this.studentId = obj.studentId;
    }
    static create(id, courseId, studentId) {
        return new StudentCourseConnection({ id, courseId, studentId });
    }
}
exports.StudentCourseConnection = StudentCourseConnection;
//# sourceMappingURL=StudentCourseConnection.js.map