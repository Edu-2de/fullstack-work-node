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
        return this.ormRepository.findOne({
            where: { id },
        });
    }
}
