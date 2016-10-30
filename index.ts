import {ApiEdgeError, OneToOneRelation, OneToManyRelation, ApiEdgeQueryResponse, Api} from "api-core";
import {MongooseModelFactory} from "api-model-mongoose";
import {EllipseApiRouter} from "api-provider-ellipse";
import * as mongoose from "mongoose";


const Ellipse = require('ellipse'),
      app = new Ellipse;

mongoose.Promise = global.Promise;
mongoose.connect("mongodb://localhost/api-demo");

const studentEdge =
          MongooseModelFactory.createModel("student", "students", {
              id: String,
              firstName: String,
              lastName: String,
              email: String,
              phone: String,
              schoolId: {
                  ref: 'school',
                  type: mongoose.Schema.Types.ObjectId
              },
              classId: mongoose.Schema.Types.ObjectId
          }),
      classEdge =
          MongooseModelFactory.createModel("class", "classes", {
              id: String,
              name: String,
              semester: String,
              room: String,
              schoolId: mongoose.Schema.Types.ObjectId
          }),
      courseEdge =
          MongooseModelFactory.createModel("course", "courses", {
              id: String,
              name: String,
              classId: mongoose.Schema.Types.ObjectId,
              courseTypeId: mongoose.Schema.Types.ObjectId
          }),
      courseTypeEdge =
          MongooseModelFactory.createModel("courseType", "courseTypes", {
              id: String,
              name: String
          }),
      schoolEdge =
          MongooseModelFactory.createModel("school", "schools", {
              id: String,
              name: String,
              address: String,
              phone: String
          });

const api10
    = new Api('1.0')
        .edge(studentEdge);

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
    .relation(new OneToOneRelation(studentEdge, schoolEdge))
    .relation(new OneToOneRelation(classEdge, schoolEdge))
    .relation(new OneToOneRelation(courseEdge, classEdge))
    .relation(new OneToManyRelation(classEdge, studentEdge))
    .relation(new OneToManyRelation(classEdge, courseEdge))
    .relation(new OneToManyRelation(schoolEdge, studentEdge))
    .relation(new OneToManyRelation(schoolEdge, classEdge));

app.use(require('body-parser').json());
app.get('/favicon.ico', (req: any, res: any) => res.send(''));

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