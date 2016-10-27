import {Model} from "../edges/memory/ModelEdge";

export interface StudentCourseConnectionScheme {
    id: string;
    courseId: string;
    studentId: string;
}

export class StudentCourseConnection extends Model implements StudentCourseConnectionScheme{
    constructor(obj: StudentCourseConnectionScheme) {
        super(obj);
        this.courseId = obj.courseId;
        this.studentId = obj.studentId;
    }

    static create(
        id: string,
        courseId: string,
        studentId: string) {

        return new StudentCourseConnection({ id, courseId, studentId });
    }

    id: string;
    courseId: string;
    studentId: string;
}
