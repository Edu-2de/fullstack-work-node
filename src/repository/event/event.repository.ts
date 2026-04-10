import { Repository } from "typeorm";
import { AppDataSource } from "../../data-source";
import { Event } from "../../entities/event";
import { IEventRepository } from "./IEventRepository";

export class EventRepository implements IEventRepository {
    private ormRepository: Repository<Event>;

    constructor() {
        this.ormRepository = AppDataSource.getRepository(Event);
    }

    async create(data: Partial<Event>): Promise<Event> {
        const event = this.ormRepository.create(data);
        await this.ormRepository.save(event);
        return event;
    }

    async findById(id: string): Promise<Event | null> {
        return this.ormRepository.findOne({
            where: { id },
            relations: ["organizer", "categories"],
        });
    }

    async findAll(): Promise<Event[]> {
        return this.ormRepository.find({
            relations: ["categories"],
        });
    }
}
