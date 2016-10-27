import {ApiEdgeDefinition, ApiEdgeError, OneToManyRelation, OneToOneRelation} from "api-core";
import {Student} from "../../model/Student";
import {MongooseModelEdge} from "./MongooseModelEdge";
import * as mongoose from "mongoose";

export type StudentDocument = Student & mongoose.Document;

export class MongooseStudentEdge extends MongooseModelEdge<StudentDocument> {
    name = "student";
    pluralName = "students";

    provider = mongoose.model<StudentDocument>('Student', new mongoose.Schema({
        id: String,
        firstName: String,
        lastName: String,
        email: String,
        phone: String,
        schoolId: String,
        classId: String
    }));
}
