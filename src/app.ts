import express from "express";
import "reflect-metadata";
import { errorHandler } from "./middlewares/errorHandler";
import { router } from "./routes";

const app = express();
const port = 3000;
app.use(express.json());

app.use(router);

app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
});

app.use(errorHandler);

export { app };
