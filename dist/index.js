"use strict";
const api_core_1 = require("api-core");
const api_model_mongoose_1 = require("api-model-mongoose");
const api_provider_ellipse_1 = require("api-provider-ellipse");
const mongoose = require("mongoose");
const Ellipse = require('ellipse'), app = new Ellipse;
mongoose.Promise = global.Promise;
mongoose.connect("mongodb://localhost/api-demo");
const studentEdge = api_model_mongoose_1.MongooseModelFactory.createModel("student", "students", {
    id: String,
    firstName: String,
    lastName: String,
    email: String,
    phone: String,
    schoolId: mongoose.Schema.Types.ObjectId,
    classId: mongoose.Schema.Types.ObjectId
}), classEdge = api_model_mongoose_1.MongooseModelFactory.createModel("class", "classes", {
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
    .relation(new api_core_1.OneToManyRelation(schoolEdge, classEdge));
app.use(require('body-parser').json());
app.get('/favicon.ico', (req, res) => res.send(''));
const router = new api_provider_ellipse_1.EllipseApiRouter(api11, api10);
router.apply(app);
app.listen(8080);
//# sourceMappingURL=index.js.map