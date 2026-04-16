import { Category } from "../../entities/category";
import { Event } from "../../entities/event";

export interface IEventRepository {
    create(
        organizer_id: string,
        categories: Category[],
        data: Partial<Event>,
    ): Promise<Event>;
    findById(id: string): Promise<Event | null>;
    findAll(): Promise<Event[]>;
    findByCategoryId(categoryId: string): Promise<boolean>;
    findByOrganizerId(organizerId: string): Promise<boolean>;
    update(
        id: string,
        categories: Category[],
        data: Partial<Event>,
    ): Promise<Event | null>;
    delete(id: string): Promise<void>;
}
