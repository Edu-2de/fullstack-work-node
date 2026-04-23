import "dotenv/config";
import { DataSource } from "typeorm";
import { Category } from "./entities/category";
import { Event } from "./entities/event";
import { Ticket } from "./entities/ticket";
import { User } from "./entities/user";

const isDevelopment = process.env.NODE_ENV === "development";

export const AppDataSource = new DataSource({
    type: "postgres",
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT || "5432"),
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    synchronize: isDevelopment,
    logging: false,
    logger: "advanced-console",
    entities: [User, Category, Event, Ticket],
    migrations: isDevelopment ? [] : ["dist/migrations/*.js"],
    subscribers: [],
});
