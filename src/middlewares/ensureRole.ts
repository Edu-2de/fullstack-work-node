import { NextFunction, Request, Response } from "express";
import { AppError, HttpStatus } from "../errors/AppError";

export function ensureRole(allowedRoles: string[]) {
    return (req: Request, res: Response, next: NextFunction) => {
        const role = req.user.role;

        if (!allowedRoles.includes(role)) {
            throw new AppError(
                "Você não tem permissão para realizar esta ação.",
                HttpStatus.FORBIDDEN,
            );
        }

        return next();
    };
}
