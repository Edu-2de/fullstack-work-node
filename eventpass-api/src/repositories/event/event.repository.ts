import { FindOptionsWhere, ILike, MoreThanOrEqual, Repository } from "typeorm";
import { AppDataSource } from "../../data-source";
import { Category } from "../../entities/category";
import { Event, EventStatus } from "../../entities/event";
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
        const categoriesSend = categories ? categories : [];

        const event = this.ormRepository.create({
            ...data,
            organizer: { id: organizer_id },
            categories: categoriesSend,
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
            select: {
                organizer: {
                    id: true,
                    name: true,
                },
            },
        });
    }

    async findAll(
        page: number,
        limit: number,
        search?: string,
        categoryId?: string,
        startDate?: Date,
    ) {
        const skip = (page - 1) * limit;

        const where: FindOptionsWhere<Event> = {};

        if (search) {
            where.title = ILike(`%${search}%`);
        }

        if (categoryId) {
            where.categories = { id: categoryId };
        }

        if (startDate) {
            where.start_date = MoreThanOrEqual(startDate);
        }

        const [events, total] = await this.ormRepository.findAndCount({
            where: where,

            skip: skip,
            take: limit,
            order: {
                start_date: "DESC",
            },
            relations: {
                categories: true,
                organizer: true,
            },
            withDeleted: true,
            select: {
                organizer: {
                    id: true,
                    name: true,
                },
            },
        });

        return {
            data: events,
            total_items: total,
            current_page: page,
            total_pages: Math.ceil(total / limit),
        };
    }

    async findByCategoryId(categoryId: string): Promise<boolean> {
        return await this.ormRepository.exists({
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

    async findByOrganizerId(organizerId: string): Promise<boolean> {
        return this.ormRepository.exists({
            where: {
                organizer: {
                    id: organizerId,
                },
                status: EventStatus.PUBLISHED,
            },
        });
    }

    async update(
        id: string,
        categories: Category[],
        data: Partial<Event>,
    ): Promise<Event | null> {
        const event = await this.ormRepository.findOne({
            where: { id },
            relations: { organizer: true, categories: true },
        });
        if (!event) {
            return null;
        }
        this.ormRepository.merge(event, data);

        event.categories = categories;

        const updatedEvent = await this.ormRepository.save(event);
        return updatedEvent;
    }

    async delete(id: string): Promise<void> {
        await this.ormRepository.softDelete(id);
    }
}
