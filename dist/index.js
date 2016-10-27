"use strict";
const api_core_1 = require("api-core");
const StudentEdge_1 = require("./src/edges/memory/StudentEdge");
const StudentEdge_2 = require("./src/edges/mongodb/StudentEdge");
const ClassEdge_1 = require("./src/edges/memory/ClassEdge");
const CourseEdge_1 = require("./src/edges/memory/CourseEdge");
const CourseTypeEdge_1 = require("./src/edges/memory/CourseTypeEdge");
const SchoolEdge_1 = require("./src/edges/memory/SchoolEdge");
const EllipseApiRouter_1 = require("./src/EllipseApiRouter");
const mongoose = require("mongoose");
const Ellipse = require('ellipse'), app = new Ellipse;
mongoose.Promise = global.Promise;
mongoose.connect("mongodb://localhost/api-demo");
const studentEdge = new StudentEdge_1.StudentEdge, mongooseStudentEdge = new StudentEdge_2.MongooseStudentEdge, classEdge = new ClassEdge_1.ClassEdge, courseEdge = new CourseEdge_1.CourseEdge, courseTypeEdge = new CourseTypeEdge_1.CourseTypeEdge, schoolEdge = new SchoolEdge_1.SchoolEdge;
const api10 = new api_core_1.Api('1.0')
    .edge(mongooseStudentEdge);
const api11 = new api_core_1.Api('1.1')
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
const router = new EllipseApiRouter_1.EllipseApiRouter(api11, api10);
router.apply(app);
app.listen(8080);
//# sourceMappingURL=index.js.map