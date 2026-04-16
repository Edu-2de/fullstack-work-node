import { Ticket } from "../../entities/ticket";

export interface ITicketRepository {
    findById(id: string): Promise<Ticket | null>;
    findAll(): Promise<Ticket[]>;
}
