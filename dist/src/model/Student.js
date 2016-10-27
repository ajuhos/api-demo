"use strict";
const ModelEdge_1 = require("../edges/memory/ModelEdge");
class Student extends ModelEdge_1.Model {
    constructor(obj) {
        super(obj);
        this.firstName = obj.firstName;
        this.lastName = obj.lastName;
        this.email = obj.email;
        this.phone = obj.phone;
        this.schoolId = obj.schoolId;
        this.classId = obj.classId;
    }
    static create(id, firstName, lastName, email, phone, schoolId, classId) {
        return new Student({ id, firstName, lastName, email, phone, schoolId, classId });
    }
}
exports.Student = Student;
//# sourceMappingURL=Student.js.map