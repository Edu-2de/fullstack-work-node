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
        const route = `[${req.method} ${req.url}]`;
        const details = error.errors ? JSON.stringify(error.errors) : "";

        if (error.statusCode < 500) {
            logger.warn(
                `${route} ${error.statusCode} - ${error.message} ${details}`,
            );
        } else {
            logger.error(`${route} ${error.statusCode} - ${error.message}`);
        }

        return res.status(error.statusCode).json({
            status: "error",
            message: error.message,
            ...(error.errors && { errors: error.errors }),
        });
    }

    logger.error(
        `[${req.method} ${req.url}] FATAL: ${error.message} | Stack: ${error.stack}`,
    );
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        status: "error",
        message: "Erro interno do servidor",
    });
};
