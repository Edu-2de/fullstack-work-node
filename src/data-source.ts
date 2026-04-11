import "dotenv/config";
import { DataSource } from "typeorm";
import { Category } from "./entities/category";
import { Event } from "./entities/event";
import { Ticket } from "./entities/ticket";
import { User } from "./entities/user";

const isDevelopment = process.env.NODE_ENV === "development";
const isProduction = process.env.NODE_ENV === "production";

export const AppDataSource = new DataSource({
    type: "postgres",
    host: process.env.DB_HOST || "localhost",
    port: parseInt(process.env.DB_PORT || "5432"),
    username: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "root",
    database: process.env.DB_NAME || "events-db",
    synchronize: isDevelopment,
    logging: isDevelopment ? ["query", "error", "warn"] : ["error"],
    logger: isDevelopment ? "advanced-console" : "simple-console",
    entities: [User, Category, Event, Ticket],
    migrations: isDevelopment ? [] : ["dist/migrations/*.js"],
    subscribers: [],
});

AppDataSource.initialize()
    .then(() => {
        console.log("✅ Banco de dados conectado e sincronizado!");
    })
    .catch((error) => {
        console.error("❌ Erro ao conectar ao banco:", error);
        process.exit(1);
    });
