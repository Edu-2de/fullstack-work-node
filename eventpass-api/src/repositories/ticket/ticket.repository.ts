import { FindOptionsWhere, ILike, Repository } from "typeorm";
import { AppDataSource } from "../../data-source";
import { Ticket, TicketStatus } from "../../entities/ticket";
import { ITicketRepository } from "./ITicketRepository";

export class TicketRepository implements ITicketRepository {
    private ormRepository: Repository<Ticket>;

    constructor() {
        this.ormRepository = AppDataSource.getRepository(Ticket);
    }

    async findById(id: string): Promise<Ticket | null> {
        return await this.ormRepository.findOne({
            where: { id },
            relations: {
                customer: true,
                events: {
                    organizer: true,
                },
            },
        });
    }

    async findAll(
        page: number,
        limit: number,
        search?: string,
        eventId?: string,
    ) {
        const skip = (page - 1) * limit;

        const where: FindOptionsWhere<Ticket> = {};

        if (search) {
            where.customer = ILike(`%${search}%`);
        }

        if (eventId) {
            where.events = { id: eventId };
        }

        const [tickets, total] = await this.ormRepository.findAndCount({
            where: where,
            skip: skip,
            take: limit,
            order: {
                purchase_date: "DESC",
            },
            withDeleted: true,
            relations: {
                customer: true,
                events: {
                    organizer: true,
                    categories: true,
                },
            },
            select: {
                customer: {
                    id: true,
                    name: true,
                    role: true,
                    deleted_at: true,
                },
                events: {
                    id: true,
                    title: true,
                    start_date: true,
                    organizer: {
                        id: true,
                        name: true,
                    },
                },
            },
        });

        return {
            data: tickets,
            total_items: total,
            current_page: page,
            total_pages: Math.ceil(total / limit),
        };
    }

    async findByUserId(userId: string, page: number, limit: number) {
        const skip = (page - 1) * limit;

        const [tickets, total] = await this.ormRepository.findAndCount({
            skip: skip,
            take: limit,
            where: {
                customer: {
                    id: userId,
                },
            },
            relations: {
                events: true,
            },
            order: {
                purchase_date: "DESC",
            },
            select: {
                events: {
                    id: true,
                    title: true,
                    start_date: true,
                    location: true,
                    banner_url: true,
                },
            },
        });

        return {
            data: tickets,
            total_items: total,
            current_page: page,
            total_pages: Math.ceil(total / limit),
        };
    }

    async findByEventId(eventId: string, page: number, limit: number) {
        const skip = (page - 1) * limit;

        const [tickets, total] = await this.ormRepository.findAndCount({
            skip: skip,
            take: limit,
            where: {
                events: {
                    id: eventId,
                },
            },
            relations: {
                customer: true,
            },
            order: {
                purchase_date: "DESC",
            },
            select: {
                customer: {
                    id: true,
                    name: true,
                },
            },
        });

        return {
            data: tickets,
            total_items: total,
            current_page: page,
            total_pages: Math.ceil(total / limit),
        };
    }

    async verifyTicketsValidsByUserId(userId: string): Promise<boolean> {
        return await this.ormRepository.exists({
            where: {
                customer: {
                    id: userId,
                },
                status: TicketStatus.VALID,
            },
        });
    }

    async update(id: string, data: Partial<Ticket>): Promise<Ticket | null> {
        const ticket = await this.ormRepository.findOne({ where: { id } });
        if (!ticket) {
            return null;
        }
        this.ormRepository.merge(ticket, data);
        const ticketUpdate = await this.ormRepository.save(ticket);
        return ticketUpdate;
    }

    async cancelAllTicketsByEventId(eventId: string): Promise<void> {
        await this.ormRepository.update(
            { events: { id: eventId } },
            { status: TicketStatus.CANCELLED },
        );
    }

    async cancelTicket(id: string): Promise<Ticket | null> {
        const ticket = await this.ormRepository.findOne({ where: { id } });
        if (!ticket) {
            return null;
        }
        await this.ormRepository.update(ticket, {
            status: TicketStatus.CANCELLED,
        });
        const ticketUpdate = await this.ormRepository.save(ticket);
        return ticketUpdate;
    }
}
