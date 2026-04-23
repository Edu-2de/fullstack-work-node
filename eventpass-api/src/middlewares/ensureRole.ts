import { NextFunction, Request, Response } from "express";
import { AppError, HttpStatus } from "../errors/AppError";

export function ensureRole(allowedRoles: string[]) {
    return (req: Request, res: Response, next: NextFunction) => {
        try {
            const role = req.user.role;

            if (!allowedRoles.includes(role)) {
                return next(
                    new AppError(
                        "Você não tem permissão para realizar esta ação.",
                        HttpStatus.FORBIDDEN,
                    ),
                );
            }

            return next();
        } catch (error) {
            return next(error);
        }
    };
}
