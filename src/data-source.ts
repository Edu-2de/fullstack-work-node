import "dotenv/config";
import { DataSource } from "typeorm";
import { Category } from "./entities/category";
import { Event } from "./entities/event";
import { Ticket } from "./entities/ticket";
import { User } from "./entities/user";

export const AppDataSource = new DataSource({
    type: "postgres",
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT || "5432"),
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    synchronize: process.env.NODE_ENV === "development",
    logging: process.env.NODE_ENV === "development",
    entities: [User, Category, Event, Ticket],
    subscribers: [],
});

AppDataSource.initialize();
