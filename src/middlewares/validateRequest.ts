import { NextFunction, Request, Response } from "express";
import { z, ZodError } from "zod";
import { AppError, HttpStatus } from "../errors/AppError";

export const validateData = (
    schema: z.ZodType,
    target: "body" | "params" | "query" = "body",
) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            const validatedData = schema.parse(req[target]);
            req[target] = validatedData;
            return next();
        } catch (error) {
            if (error instanceof ZodError) {
                const errors = error.issues.map((issue) => ({
                    field: issue.path.join("."),
                    message: issue.message,
                }));

                throw new AppError(
                    "Erro de validação",
                    HttpStatus.BAD_REQUEST,
                    errors,
                );
            }
            next(error);
        }
    };
};
