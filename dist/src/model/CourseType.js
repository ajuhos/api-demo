"use strict";
const ModelEdge_1 = require("../edges/memory/ModelEdge");
class CourseTypeScheme {
}
exports.CourseTypeScheme = CourseTypeScheme;
class CourseType extends ModelEdge_1.Model {
    constructor(obj) {
        super(obj);
        this.name = obj.name;
    }
    static create(id, name) {
        return new CourseType({ id, name });
    }
}
exports.CourseType = CourseType;
//# sourceMappingURL=CourseType.js.map