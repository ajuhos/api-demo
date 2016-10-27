import { Model } from "../edges/memory/ModelEdge";
export declare class CourseTypeScheme {
    id: string;
    name: string;
}
export declare class CourseType extends Model implements CourseTypeScheme {
    constructor(obj: CourseTypeScheme);
    static create(id: string, name: string): CourseType;
    id: string;
    name: string;
}
