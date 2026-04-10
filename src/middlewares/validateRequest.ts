import { NextFunction, Request, Response } from "express";
import { z, ZodError } from "zod";
import { AppError } from "../errors/AppError";

export const validateData = (schema: z.ZodType) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            schema.parse(req.body);
            return next();
        } catch (error) {
            if (error instanceof ZodError) {
                throw new AppError(error.issues[0].message, 400);
            }
            next(error);
        }
    };
};
