"use strict";
const api_core_1 = require("api-core");
const StudentEdge_1 = require("./src/edges/StudentEdge");
const ClassEdge_1 = require("./src/edges/ClassEdge");
const CourseEdge_1 = require("./src/edges/CourseEdge");
const CourseTypeEdge_1 = require("./src/edges/CourseTypeEdge");
const SchoolEdge_1 = require("./src/edges/SchoolEdge");
const EllipseApiRouter_1 = require("./src/EllipseApiRouter");
const Ellipse = require('ellipse'), app = new Ellipse;
const studentEdge = new StudentEdge_1.StudentEdge, classEdge = new ClassEdge_1.ClassEdge, courseEdge = new CourseEdge_1.CourseEdge, courseTypeEdge = new CourseTypeEdge_1.CourseTypeEdge, schoolEdge = new SchoolEdge_1.SchoolEdge;
const api = new api_core_1.Api('1.0')
    .edge(studentEdge)
    .edge(classEdge)
    .edge(courseEdge)
    .edge(courseTypeEdge)
    .edge(schoolEdge)
    .relation(new api_core_1.OneToOneRelation(courseEdge, courseTypeEdge))
    .relation(new api_core_1.OneToManyRelation(courseTypeEdge, courseEdge))
    .relation(new api_core_1.OneToManyRelation(studentEdge, courseEdge))
    .relation(new api_core_1.OneToOneRelation(studentEdge, classEdge))
    .relation(new api_core_1.OneToOneRelation(classEdge, schoolEdge))
    .relation(new api_core_1.OneToOneRelation(courseEdge, classEdge))
    .relation(new api_core_1.OneToManyRelation(classEdge, studentEdge))
    .relation(new api_core_1.OneToManyRelation(classEdge, courseEdge))
    .relation(new api_core_1.OneToManyRelation(schoolEdge, studentEdge))
    .relation(new api_core_1.OneToManyRelation(schoolEdge, classEdge));
app.use(require('body-parser').json());
const router = new EllipseApiRouter_1.EllipseApiRouter(api);
router.apply(app);
app.listen(8080);
//# sourceMappingURL=index.js.map