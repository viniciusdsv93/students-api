import { StudentModel } from "../../domain/entities/student";
import { CreateStudentModel, ICreateStudent } from "../../domain/usecases/create-user";
import { IController } from "../protocols/controller";
import { CreateStudentController } from "./create-student";

const makeCreateStudentStub = (): ICreateStudent => {
	class CreateStudentStub implements ICreateStudent {
		async execute(studentData: CreateStudentModel): Promise<StudentModel> {
			return new Promise((resolve) => resolve(makeFakeStudentModel()));
		}
	}
	return new CreateStudentStub();
};

const makeFakeStudentModel = (): StudentModel => {
	return {
		id: 0,
		name: "valid_name",
		email: "valid_email",
		gender: "male",
		age: 25,
	};
};

type SutTypes = {
	sut: IController;
	createStudentStub: ICreateStudent;
};

const makeSut = (): SutTypes => {
	const createStudentStub = makeCreateStudentStub();
	const sut = new CreateStudentController(createStudentStub);
	return {
		sut,
		createStudentStub,
	};
};

describe("Create Student Controller", () => {
	test("Should return 400 if no email is provided", async () => {
		const { sut } = makeSut();
		const response = await sut.handle({
			body: {
				name: "valid_name",
				gender: "male",
				age: 25,
			},
		});
		expect(response).toEqual({
			statusCode: 400,
			body: "no email was provided",
		});
	});

	test("Should return 400 if no name is provided", async () => {
		const { sut } = makeSut();
		const response = await sut.handle({
			body: {
				email: "valid_email",
				gender: "male",
				age: 25,
			},
		});
		expect(response).toEqual({
			statusCode: 400,
			body: "no name was provided",
		});
	});

	test("Should return 400 if no gender is provided", async () => {
		const { sut } = makeSut();
		const response = await sut.handle({
			body: {
				name: "valid_name",
				email: "valid_email",
				age: 25,
			},
		});
		expect(response).toEqual({
			statusCode: 400,
			body: "no gender was provided",
		});
	});

	test("Should return 400 if no age is provided", async () => {
		const { sut } = makeSut();
		const response = await sut.handle({
			body: {
				name: "valid_name",
				email: "valid_email",
				gender: "male",
			},
		});
		expect(response).toEqual({
			statusCode: 400,
			body: "no age was provided",
		});
	});

	test("Should call CreateStudentUsecase with correct values", async () => {
		const { sut, createStudentStub } = makeSut();
		const createStudentSpy = jest.spyOn(createStudentStub, "execute");
		await sut.handle({
			body: {
				name: "valid_name",
				email: "valid_email",
				gender: "male",
				age: 25,
			},
		});
		expect(createStudentSpy).toHaveBeenCalledWith({
			name: "valid_name",
			email: "valid_email",
			gender: "male",
			age: 25,
		});
	});
});
