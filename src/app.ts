import express from "express";
import "reflect-metadata";
import { AppDataSource } from "./data-source";
import { errorHandler } from "./middlewares/errorHandler";
import { router } from "./routes";

const app = express();
const port = 3000;
app.use(express.json());
app.use(router);
app.use(errorHandler);

AppDataSource.initialize()
    .then(() => {
        console.log("✅ Banco de dados conectado e sincronizado!");

        app.listen(port, () => {
            console.log(`🚀 Servidor rodando em http://localhost:${port}`);
        });
    })
    .catch((error) => {
        console.error("❌ Erro fatal ao conectar ao banco:", error);
        process.exit(1);
    });
