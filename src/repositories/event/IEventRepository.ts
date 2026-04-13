import { Event } from "../../entities/event";

export interface IEventRepository {
    create(data: Partial<Event>): Promise<Event>;
    findById(id: string): Promise<Event | null>;
    findAll(): Promise<Event[]>;
    findByCategoryId(categoryId: string): Promise<boolean>;
}
