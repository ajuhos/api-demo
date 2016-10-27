/// <reference types="mongoose" />
import { Student } from "../../model/Student";
import { MongooseModelEdge } from "./MongooseModelEdge";
import * as mongoose from "mongoose";
export declare type StudentDocument = Student & mongoose.Document;
export declare class MongooseStudentEdge extends MongooseModelEdge<StudentDocument> {
    name: string;
    pluralName: string;
    provider: mongoose.Model<StudentDocument>;
}
