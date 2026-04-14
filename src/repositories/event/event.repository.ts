import { Repository } from "typeorm";
import { AppDataSource } from "../../data-source";
import { Category } from "../../entities/category";
import { Event } from "../../entities/event";
import { IEventRepository } from "./IEventRepository";

export class EventRepository implements IEventRepository {
    private ormRepository: Repository<Event>;

    constructor() {
        this.ormRepository = AppDataSource.getRepository(Event);
    }

    async create(
        organizer_id: string,
        categories: Category[],
        data: Partial<Event>,
    ): Promise<Event> {
        const event = this.ormRepository.create({
            ...data,
            organizer: { id: organizer_id },
            categories: categories,
        });
        await this.ormRepository.save(event);
        return event;
    }

    async findById(id: string): Promise<Event | null> {
        return this.ormRepository.findOne({
            where: { id },
            relations: {
                organizer: true,
                categories: true,
            },
        });
    }

    async findAll(): Promise<Event[]> {
        return this.ormRepository.find({
            relations: {
                categories: true,
            },
        });
    }

    async findByCategoryId(categoryId: string): Promise<boolean> {
        return this.ormRepository.exists({
            relations: {
                categories: true,
            },
            where: {
                categories: {
                    id: categoryId,
                },
            },
        });
    }

    async update(
        id: string,
        organizer_id: string,
        categories: Category[],
        data: Partial<Event>,
    ): Promise<Event | null> {
        const event = await this.ormRepository.findOne({ where: { id } });
        if (!event) {
            return null;
        }
        this.ormRepository.merge(event, data);

        event.organizer = { id: organizer_id } as any;
        event.categories = categories;

        const updatedEvent = await this.ormRepository.save(event);
        return updatedEvent;
    }
}
