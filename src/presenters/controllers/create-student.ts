import { ICreateStudent } from "../../domain/usecases/create-user";
import { HttpRequest, HttpResponse } from "../helpers/http";
import { IController } from "../protocols/controller";

export class CreateStudentController implements IController {
	private readonly createStudent: ICreateStudent;

	constructor(createStudent: ICreateStudent) {
		this.createStudent = createStudent;
	}

	async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
		try {
			const requiredFields = ["name", "email", "gender", "age"];

			for (const field of requiredFields) {
				if (!httpRequest.body[field]) {
					return {
						statusCode: 400,
						body: `no ${field} was provided`,
					};
				}
			}

			const validGenderOptions = ["male", "female", "other"];

			if (validGenderOptions.indexOf(httpRequest.body["gender"]) < 0) {
				return {
					statusCode: 400,
					body: "invalid gender option provided",
				};
			}

			const { name, email, gender, age } = httpRequest.body;

			const student = await this.createStudent.execute({
				name,
				email,
				gender,
				age,
			});

			if (student) {
				return {
					statusCode: 201,
					body: student,
				};
			}

			return {
				statusCode: 500,
				body: "error when trying to register user",
			};
		} catch (error) {
			return {
				statusCode: 500,
				body: "internal server error",
			};
		}
	}
}
