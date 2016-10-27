import { Model } from "../edges/memory/ModelEdge";
export interface StudentCourseConnectionScheme {
    id: string;
    courseId: string;
    studentId: string;
}
export declare class StudentCourseConnection extends Model implements StudentCourseConnectionScheme {
    constructor(obj: StudentCourseConnectionScheme);
    static create(id: string, courseId: string, studentId: string): StudentCourseConnection;
    id: string;
    courseId: string;
    studentId: string;
}
