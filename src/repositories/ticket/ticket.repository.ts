import { Repository } from "typeorm";
import { AppDataSource } from "../../data-source";
import { Ticket } from "../../entities/ticket";
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

    async findAll(): Promise<Ticket[]> {
        return await this.ormRepository.find({
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
    }

    async findByUserId(userId: string): Promise<Ticket[]> {
        return await this.ormRepository.find({
            where: {
                customer: {
                    id: userId,
                },
            },
            relations: {
                events: true,
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
    }

    async findByEventId(eventId: string): Promise<Ticket[]> {
        return await this.ormRepository.find({
            where: {
                events: {
                    id: eventId,
                },
            },
            relations: {
                customer: true,
            },
            select: {
                customer: {
                    id: true,
                    name: true,
                },
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

    async useTicket(id: string): Promise<Ticket | null> {
        return await this.ormRepository.findOne({ where: { id } });
    }
}
