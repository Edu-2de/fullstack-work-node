import { NextFunction, Request, Response } from "express";
import { verify } from "jsonwebtoken";
import { AppError, HttpStatus } from "../errors/AppError";

export function ensureAuthenticated(
    req: Request,
    res: Response,
    next: NextFunction,
) {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        throw new AppError("Token JWT nao informado", HttpStatus.UNAUTHORIZED);
    }

    const [, token] = authHeader.split(" ");

    try {
        const decoded = verify(token, "CHAVE AQUI");

        const { sub, role } = decoded as { sub: string; role: string };

        req.user = {
            id: sub,
            role: role,
        };

        return next();
    } catch (error) {
        throw new AppError("Token JWT inválido", HttpStatus.UNAUTHORIZED);
    }
}
