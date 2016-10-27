"use strict";
const ModelEdge_1 = require("../edges/ModelEdge");
class Class extends ModelEdge_1.Model {
    constructor(obj) {
        super(obj);
        this.name = obj.name;
        this.semester = obj.semester;
        this.room = obj.room;
        this.schoolId = obj.schoolId;
    }
    static create(id, name, semester, room, schoolId) {
        return new Class({ id, name, semester, room, schoolId });
    }
}
exports.Class = Class;
//# sourceMappingURL=Class.js.map