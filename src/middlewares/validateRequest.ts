import { NextFunction, Request, Response } from "express";
import fs from "fs";
import { z, ZodError } from "zod";
import { AppError, HttpStatus } from "../errors/AppError";

export const validateData = (
    schema: z.ZodType,
    target: "body" | "params" | "query" = "body",
) => {
    return (req: Request, res: Response, next: NextFunction) => {
        try {
            const validatedData = schema.parse(req[target]);
            req[target] = validatedData;
            return next();
        } catch (error) {
            if (req.file && fs.existsSync(req.file.path)) {
                fs.unlinkSync(req.file.path);
            }

            if (error instanceof ZodError) {
                const errors = error.issues.map((issue) => ({
                    field: issue.path.join("."),
                    message: issue.message,
                }));

                return next(
                    new AppError(
                        "Erro de validação",
                        HttpStatus.BAD_REQUEST,
                        errors,
                    ),
                );
            }
            return next(error);
        }
    };
};
