import { Ticket } from "../../entities/ticket";

export interface ITicketRepository {
    findById(id: string): Promise<Ticket | null>;
    findAll(): Promise<Ticket[]>;
    findByUserId(userId: string): Promise<Ticket[]>;
    findByEventId(eventId: string): Promise<Ticket[]>;
    update(id: string, data: Partial<Ticket>): Promise<Ticket | null>;
    cancelTicket(id: string): Promise<Ticket | null>;
}
