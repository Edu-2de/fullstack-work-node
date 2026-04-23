import { NextFunction, Request, Response } from "express";
import { verify } from "jsonwebtoken";
import { AppError, HttpStatus } from "../errors/AppError";

export function ensureAuthenticated(
    req: Request,
    res: Response,
    next: NextFunction,
) {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader) {
            return next(
                new AppError(
                    "Login necessário para essa ação",
                    HttpStatus.UNAUTHORIZED,
                ),
            );
        }

        const [, token] = authHeader.split(" ");

        try {
            const decoded = verify(
                token,
                process.env.JWT_SECRET || "default_dev_secret",
            );

            const { sub, role } = decoded as { sub: string; role: string };

            req.user = {
                id: sub,
                role: role,
            };

            return next();
        } catch (error) {
            return next(
                new AppError("Token JWT inválido", HttpStatus.UNAUTHORIZED),
            );
        }
    } catch (error) {
        return next(error);
    }
}
