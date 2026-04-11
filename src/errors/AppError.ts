export enum HttpStatus {
    BAD_REQUEST = 400,
    UNAUTHORIZED = 401,
    FORBIDDEN = 403,
    NOT_FOUND = 404,
    CONFLICT = 409,
    INTERNAL_SERVER_ERROR = 500,
}

export class AppError extends Error {
    public readonly statusCode: number;
    public readonly errors?: any[];

    constructor(
        message: string,
        statusCode: number = HttpStatus.BAD_REQUEST,
        errors?: any[],
    ) {
        super(message);
        this.statusCode = statusCode;
        this.errors = errors;
    }
}
