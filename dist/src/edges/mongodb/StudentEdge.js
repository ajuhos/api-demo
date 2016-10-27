"use strict";
const MongooseModelEdge_1 = require("./MongooseModelEdge");
const mongoose = require("mongoose");
class MongooseStudentEdge extends MongooseModelEdge_1.MongooseModelEdge {
    constructor() {
        super(...arguments);
        this.name = "student";
        this.pluralName = "students";
        this.provider = mongoose.model('Student', new mongoose.Schema({
            id: String,
            firstName: String,
            lastName: String,
            email: String,
            phone: String,
            schoolId: String,
            classId: String
        }));
    }
}
exports.MongooseStudentEdge = MongooseStudentEdge;
//# sourceMappingURL=StudentEdge.js.map