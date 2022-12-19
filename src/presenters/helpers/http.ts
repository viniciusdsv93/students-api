export type HttpRequest = {
	params?: string;
	body?: any;
};

export type HttpResponse = {
	statusCode: number;
	body?: any;
};
