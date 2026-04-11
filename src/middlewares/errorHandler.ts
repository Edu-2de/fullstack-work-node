import { NextFunction, Request, Response } from "express";
import logger from "../config/logger";
import { AppError, HttpStatus } from "../errors/AppError";

export const errorHandler = (
    error: any,
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    if (error instanceof AppError) {
        return res.status(error.statusCode).json({
            status: "error",
            message: error.message,
            ...(error.errors && { errors: error.errors }),
        });
    }

    logger.error(`Mensagem: ${error.message} | Stack: ${error.stack}`);
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        status: "error",
        message: "Erro interno do servidor",
    });
};
