import { DataSource } from "typeorm";
import { Category } from "./entities/category";
import { Event } from "./entities/event";
import { Ticket } from "./entities/ticket";
import { User } from "./entities/user";

export const AppDataSource = new DataSource({
    type: "postgres",
    host: "localhost",
    port: 5432,
    username: "myuser",
    password: "senha",
    database: "events-db",
    synchronize: false,
    logging: true,
    entities: [User, Category, Event, Ticket],
    migrations: [],
    migrationsTableName: "migrations",
    subscribers: [],
});

AppDataSource.initialize();
