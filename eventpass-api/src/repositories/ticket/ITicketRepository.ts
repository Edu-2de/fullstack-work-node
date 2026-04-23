import { Ticket } from "../../entities/ticket";

export interface ITicketRepository {
    findById(id: string): Promise<Ticket | null>;
    findAll(
        page: number,
        limit: number,
        search?: string,
        eventId?: string,
    ): any;
    findByUserId(userId: string, page: number, limit: number): any;
    findByEventId(eventId: string, page: number, limit: number): any;
    update(id: string, data: Partial<Ticket>): Promise<Ticket | null>;
    cancelAllTicketsByEventId(eventId: string): Promise<void>;
    cancelTicket(id: string): Promise<Ticket | null>;
}
