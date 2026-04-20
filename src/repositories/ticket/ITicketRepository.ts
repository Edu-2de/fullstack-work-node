import { Ticket } from "../../entities/ticket";

export interface ITicketRepository {
    findById(id: string): Promise<Ticket | null>;
    findAll(): Promise<Ticket[]>;
    update(id: string, data: Partial<Ticket>): Promise<Ticket | null>;
    useTicket(id: string): Promise<Ticket | null>;
}
