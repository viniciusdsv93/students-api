import { StudentModel } from "../entities/student";

export type CreateStudentModel = Omit<StudentModel, "id">;

export interface ICreateStudent {
	execute(studentData: CreateStudentModel): Promise<StudentModel>;
}
