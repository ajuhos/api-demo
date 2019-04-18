import {
    ApiQueryScope, ApiEdgeError, OneToOneRelation, OneToManyRelation, ApiEdgeQueryResponse, Api, ApiEdgeQueryType,
    ApiEdgeActionTriggerKind, ApiEdgeActionTrigger, QueryEdgeQueryStep
} from "api-core";
import {MongooseModelFactory} from "api-model-mongoose";
import {EllipseApiRouter} from "api-provider-ellipse";
import * as mongoose from "mongoose";

const Ellipse = require('ellipse'),
      ACL = require('acl'),
      app = new Ellipse;

let acl = new ACL(new ACL.memoryBackend());
acl.allow("admin", "student", "*");
acl.allow("admin", "school", "Get");
acl.addUserRoles("5812832682285d4a08d67eb9", "admin");

mongoose.Promise = global.Promise;
mongoose.connect("mongodb://localhost/api-demo");

function mapStudentEntry(user: any, student: any) {
    let temp: any = {
        id: student._id.toHexString(),
        name: [student.firstName, student.lastName].join(' '),
        school: student.schoolId
    };

    if(student.classId)
        temp['class'] = student.classId;

    if(user.id === temp.id) {
        temp.email = student.email;
        temp.phone = student.phone
    }

    return temp
}

function mapStudent(scope: ApiQueryScope) {
    return new Promise(resolve => {
        if(scope.response) {
            const data = scope.response.data;
            const mapper = mapStudentEntry.bind(null, scope.identity);
            scope.response.data = Array.isArray(data) ? data.map(mapper) : mapper(data)
        }

        resolve(scope)
    })
}

function ensureAuthenticated(scope: ApiQueryScope) {
    return new Promise((resolve, reject) => {
        if(scope.identity) resolve(scope);
        else reject(new ApiEdgeError(403, "Forbidden"))
    })
}

function ensureACL(scope: ApiQueryScope) {
    return new Promise((resolve, reject) => {
        let querySteps = scope.query.steps
            .filter((step: any) => step instanceof QueryEdgeQueryStep);

        function next() {
            const step: QueryEdgeQueryStep = querySteps.pop() as QueryEdgeQueryStep;
            acl.isAllowed(scope.identity.id, step.query.edge.name, ApiEdgeQueryType[step.query.type])
                .then((allowed: boolean) => {
                    if (allowed) {
                        if (querySteps.length) {
                            next()
                        }
                        else {
                            resolve(scope)
                        }
                    }
                    else {
                        reject(new ApiEdgeError(403, `Forbidden (${ApiEdgeQueryType[step.query.type]} ${step.query.edge.name})`))
                    }
                })
                .catch(reject);
        }

        if(querySteps.length) {
            next()
        }
        else {
            resolve(scope)
        }
    })
}

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
          }).action("map", mapStudent,
              ApiEdgeQueryType.Any,
              ApiEdgeActionTriggerKind.AfterEvent,
              ApiEdgeActionTrigger.OutputQuery),
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
    .relation(new OneToManyRelation(schoolEdge, classEdge))
    .action("authenticate", ensureAuthenticated)
    .action("acl", ensureACL);


app.use(require('body-parser').json());
app.get('/favicon.ico', (req: any, res: any) => res.send(''));

app.use(function(req: any, res: any, next: any) {
    req.user = { id: "5812832682285d4a08d67eb9" };
    next()
});

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