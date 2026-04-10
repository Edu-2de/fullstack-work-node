import { Ticket } from "../../entities/ticket";

export interface ITicketRepository {
    create(data: Partial<Ticket>): Promise<Ticket>;
    findById(id: string): Promise<Ticket | null>;
}
