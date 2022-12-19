import { ICreateStudent } from "../../domain/usecases/create-user";
import { HttpRequest, HttpResponse } from "../helpers/http";
import { IController } from "../protocols/controller";

export class CreateStudentController implements IController {
	private readonly createStudent: ICreateStudent;

	constructor(createStudent: ICreateStudent) {
		this.createStudent = createStudent;
	}

	async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
		const requiredFields = ["name", "email", "gender", "age"];

		for (const field of requiredFields) {
			if (!httpRequest.body[field]) {
				return {
					statusCode: 400,
					body: `no ${field} was provided`,
				};
			}
		}

		const { name, email, gender, age } = httpRequest.body;

		await this.createStudent.execute({
			name,
			email,
			gender,
			age,
		});

		return {
			statusCode: 200,
			body: "OK",
		};
	}
}
