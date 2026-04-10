import { Repository } from "typeorm";
import { AppDataSource } from "../../data-source";
import { Ticket } from "../../entities/ticket";
import { ITicketRepository } from "./ITicketRepository";

export class TicketRepository implements ITicketRepository {
    private ormRepository: Repository<Ticket>;

    constructor() {
        this.ormRepository = AppDataSource.getRepository(Ticket);
    }

    async create(data: Partial<Ticket>): Promise<Ticket> {
        const ticket = this.ormRepository.create(data);
        await this.ormRepository.save(ticket);
        return ticket;
    }

    async findById(id: string): Promise<Ticket | null> {
        return this.ormRepository.findOne({
            where: { id },
        });
    }
}
