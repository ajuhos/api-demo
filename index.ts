import {ApiEdgeError, OneToOneRelation, OneToManyRelation, ApiEdgeQueryResponse, Api} from "api-core";
import {StudentEdge} from "./src/edges/memory/StudentEdge";
import {MongooseStudentEdge} from "./src/edges/mongodb/StudentEdge";
import {ClassEdge} from "./src/edges/memory/ClassEdge";
import {CourseEdge} from "./src/edges/memory/CourseEdge";
import {CourseTypeEdge} from "./src/edges/memory/CourseTypeEdge";
import {SchoolEdge} from "./src/edges/memory/SchoolEdge";
import {EllipseApiRouter} from "./src/EllipseApiRouter";
import * as mongoose from "mongoose";

const Ellipse = require('ellipse'),
      app = new Ellipse;

mongoose.Promise = global.Promise;
mongoose.connect("mongodb://localhost/api-demo");

const studentEdge = new StudentEdge,
      mongooseStudentEdge = new MongooseStudentEdge,
      classEdge = new ClassEdge,
      courseEdge = new CourseEdge,
      courseTypeEdge = new CourseTypeEdge,
      schoolEdge = new SchoolEdge;

const api10
    = new Api('1.0')
        .edge(mongooseStudentEdge);

const api11
    = new Api('1.1')
    .edge(studentEdge)
    .edge(classEdge)
    .edge(courseEdge)
    .edge(courseTypeEdge)
    .edge(schoolEdge)
    .relation(new OneToOneRelation(courseEdge, courseTypeEdge))
    .relation(new OneToManyRelation(courseTypeEdge, courseEdge))
    .relation(new OneToManyRelation(studentEdge, courseEdge))
    .relation(new OneToOneRelation(studentEdge, classEdge))
    .relation(new OneToOneRelation(classEdge, schoolEdge))
    .relation(new OneToOneRelation(courseEdge, classEdge))
    .relation(new OneToManyRelation(classEdge, studentEdge))
    .relation(new OneToManyRelation(classEdge, courseEdge))
    .relation(new OneToManyRelation(schoolEdge, studentEdge))
    .relation(new OneToManyRelation(schoolEdge, classEdge));

app.use(require('body-parser').json());

const router = new EllipseApiRouter(api11, api10);
router.apply(app);

app.listen(8080);

//TEST: http://localhost:8080/api/v1.0/schools/s1/students/s2/class/courses?fields=id,name
/*
 [
     {
         "id": "c1",
         "name": "Maths A1"
     },
     {
         "id": "c6",
         "name": "Science A1"
     }
 ]
 */