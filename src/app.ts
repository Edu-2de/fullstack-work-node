import express, { NextFunction, Request, Response } from "express";
import "reflect-metadata";
import { AppError } from "./errors/AppError";
import { router } from "./routes";

const app = express();
const port = 3000;
app.use(express.json());

app.use(router);

app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
});

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    if (err instanceof AppError) {
        return res.status(err.statusCode).json({
            status: "error",
            message: err.message,
        });
    }

    console.error("Erro interno capturado:", err);

    return res.status(500).json({
        status: "error",
        message: "Internal server error",
    });
});

export { app };
