"use strict";
const ModelEdge_1 = require("../edges/memory/ModelEdge");
class School extends ModelEdge_1.Model {
    constructor(obj) {
        super(obj);
        this.name = obj.name;
        this.address = obj.address;
        this.phone = obj.phone;
    }
    static create(id, name, address, phone) {
        return new School({ id, name, address, phone });
    }
}
exports.School = School;
//# sourceMappingURL=School.js.map