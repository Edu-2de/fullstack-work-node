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
                events: true,
            },
            select: {
                customer: {
                    id: true,
                    name: true,
                    role: true,
                },
            },
        });
    }

    async update(id: string, data: Partial<Ticket>): Promise<Ticket | null> {
        const ticket = await this.ormRepository.findOne({ where: { id } });
        if (!ticket) {
            return null;
        }
        const ticketUpdate = this.ormRepository.merge(ticket, data);
        return ticketUpdate;
    }

    async useTicket(id: string): Promise<Ticket | null> {
        return await this.ormRepository.findOne({ where: { id } });
    }
}
