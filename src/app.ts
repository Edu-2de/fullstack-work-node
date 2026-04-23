import cors from "cors";
import express from "express";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import path from "path";
import "reflect-metadata";
import logger from "./config/logger";
import { AppDataSource } from "./data-source";
import { AppError } from "./errors/AppError";
import { errorHandler } from "./middlewares/errorHandler";
import { router } from "./routes";

const app = express();
const port = 3000;

app.use(helmet());

app.use(
    cors({
        origin: "*",
        methods: ["GET", "POST", "PATCH", "DELETE"],
        allowedHeaders: ["Content-Type", "Authorization"],
    }),
);
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message:
        "Muitas requisições deste IP, por favor tente novamente mais tarde.",
});
app.use(limiter);

app.use(express.json());
app.use("/files", express.static(path.resolve(__dirname, "..", "uploads")));
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
