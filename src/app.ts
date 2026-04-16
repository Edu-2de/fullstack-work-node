import express from "express";
import "reflect-metadata";
import logger from "./config/logger";
import { AppDataSource } from "./data-source";
import { AppError } from "./errors/AppError";
import { errorHandler } from "./middlewares/errorHandler";
import { router } from "./routes";

const app = express();
const port = 3000;

app.use(express.json());
app.use((req, res, next) => {
    logger.info(`Recebendo: ${req.method} ${req.url}`);
    next();
});

app.use(router);

app.use((req, res, next) => {
    next(
        new AppError(
            `Rota não encontrada no sistema: ${req.method} ${req.url}`,
            404,
        ),
    );
});

app.use(errorHandler);

AppDataSource.initialize()
    .then(() => {
        console.log("✅ Banco de dados conectado e sincronizado!");

        const server = app.listen(port, () => {
            console.log(` Servidor rodando em http://localhost:3000`);
        });
    })
    .catch((error) => {
        console.error("❌ Erro fatal ao conectar ao banco:", error);
        process.exit(1);
    });
