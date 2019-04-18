"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const api_core_1 = require("api-core");
const api_model_mongoose_1 = require("api-model-mongoose");
const api_provider_ellipse_1 = require("api-provider-ellipse");
const mongoose = require("mongoose");
const Ellipse = require('ellipse'), ACL = require('acl'), app = new Ellipse;
let acl = new ACL(new ACL.memoryBackend());
acl.allow("admin", "student", "*");
acl.allow("admin", "school", "Get");
acl.addUserRoles("5812832682285d4a08d67eb9", "admin");
mongoose.Promise = global.Promise;
mongoose.connect("mongodb://localhost/api-demo");
function mapStudentEntry(user, student) {
    let temp = {
        id: student._id.toHexString(),
        name: [student.firstName, student.lastName].join(' '),
        school: student.schoolId
    };
    if (student.classId)
        temp['class'] = student.classId;
    if (user.id === temp.id) {
        temp.email = student.email;
        temp.phone = student.phone;
    }
    return temp;
}
function mapStudent(scope) {
    return new Promise(resolve => {
        if (scope.response) {
            const data = scope.response.data;
            const mapper = mapStudentEntry.bind(null, scope.identity);
            scope.response.data = Array.isArray(data) ? data.map(mapper) : mapper(data);
        }
        resolve(scope);
    });
}
function ensureAuthenticated(scope) {
    return new Promise((resolve, reject) => {
        if (scope.identity)
            resolve(scope);
        else
            reject(new api_core_1.ApiEdgeError(403, "Forbidden"));
    });
}
function ensureACL(scope) {
    return new Promise((resolve, reject) => {
        let querySteps = scope.query.steps
            .filter((step) => step instanceof api_core_1.QueryEdgeQueryStep);
        function next() {
            const step = querySteps.pop();
            acl.isAllowed(scope.identity.id, step.query.edge.name, api_core_1.ApiEdgeQueryType[step.query.type])
                .then((allowed) => {
                if (allowed) {
                    if (querySteps.length) {
                        next();
                    }
                    else {
                        resolve(scope);
                    }
                }
                else {
                    reject(new api_core_1.ApiEdgeError(403, `Forbidden (${api_core_1.ApiEdgeQueryType[step.query.type]} ${step.query.edge.name})`));
                }
            })
                .catch(reject);
        }
        if (querySteps.length) {
            next();
        }
        else {
            resolve(scope);
        }
    });
}
const studentEdge = api_model_mongoose_1.MongooseModelFactory.createModel("student", "students", {
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
}).action("map", mapStudent, api_core_1.ApiEdgeQueryType.Any, api_core_1.ApiEdgeActionTriggerKind.AfterEvent, api_core_1.ApiEdgeActionTrigger.OutputQuery), classEdge = api_model_mongoose_1.MongooseModelFactory.createModel("class", "classes", {
    id: String,
    name: String,
    semester: String,
    room: String,
    schoolId: mongoose.Schema.Types.ObjectId
}), courseEdge = api_model_mongoose_1.MongooseModelFactory.createModel("course", "courses", {
    id: String,
    name: String,
    classId: mongoose.Schema.Types.ObjectId,
    courseTypeId: mongoose.Schema.Types.ObjectId
}), courseTypeEdge = api_model_mongoose_1.MongooseModelFactory.createModel("courseType", "courseTypes", {
    id: String,
    name: String
}), schoolEdge = api_model_mongoose_1.MongooseModelFactory.createModel("school", "schools", {
    id: String,
    name: String,
    address: String,
    phone: String
});
const api10 = new api_core_1.Api('1.0')
    .edge(studentEdge);
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
    .relation(new api_core_1.OneToOneRelation(studentEdge, schoolEdge))
    .relation(new api_core_1.OneToOneRelation(classEdge, schoolEdge))
    .relation(new api_core_1.OneToOneRelation(courseEdge, classEdge))
    .relation(new api_core_1.OneToManyRelation(classEdge, studentEdge))
    .relation(new api_core_1.OneToManyRelation(classEdge, courseEdge))
    .relation(new api_core_1.OneToManyRelation(schoolEdge, studentEdge))
    .relation(new api_core_1.OneToManyRelation(schoolEdge, classEdge))
    .action("authenticate", ensureAuthenticated)
    .action("acl", ensureACL);
app.use(require('body-parser').json());
app.get('/favicon.ico', (req, res) => res.send(''));
app.use(function (req, res, next) {
    req.user = { id: "5812832682285d4a08d67eb9" };
    next();
});
const router = new api_provider_ellipse_1.EllipseApiRouter(api11, api10);
router.apply(app);
app.listen(8080);
//# sourceMappingURL=index.js.map