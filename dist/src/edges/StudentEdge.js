"use strict";
const RawDataProvider_1 = require("../data/RawDataProvider");
const Student_1 = require("../model/Student");
const ModelEdge_1 = require("./ModelEdge");
class StudentEdge extends ModelEdge_1.ModelEdge {
    constructor() {
        super(...arguments);
        this.name = "student";
        this.pluralName = "students";
        this.provider = RawDataProvider_1.RawDataProvider.students;
        this.createModel = (obj) => new Student_1.Student(obj);
    }
}
exports.StudentEdge = StudentEdge;
//# sourceMappingURL=StudentEdge.js.map