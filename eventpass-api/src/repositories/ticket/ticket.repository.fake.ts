import { Ticket, TicketStatus } from "../../entities/ticket";
import { ITicketRepository } from "./ITicketRepository";

export class FakeTicketRepository implements ITicketRepository {
    public tickets: Ticket[] = [];

    async createMock(ticketData: Partial<Ticket>): Promise<Ticket> {
        const ticket = new Ticket();
        Object.assign(ticket, {
            id: Math.random().toString(),
            purchase_date: new Date(),
            status: TicketStatus.VALID,
            ...ticketData,
        });
        this.tickets.push(ticket);
        return ticket;
    }

    async findById(id: string): Promise<Ticket | null> {
        const ticket = this.tickets.find((t) => t.id === id);
        return ticket || null;
    }

    async findAll(
        page: number,
        limit: number,
        search?: string,
        eventId?: string,
    ) {
        let filteredTickets = this.tickets;

        if (search) {
            filteredTickets = filteredTickets.filter((t) =>
                t.customer?.name.toLowerCase().includes(search.toLowerCase()),
            );
        }

        if (eventId) {
            filteredTickets = filteredTickets.filter(
                (t) => t.events?.id === eventId,
            );
        }

        const safePage = Math.max(1, Number(page));
        const safeLimit = Math.max(1, Number(limit));
        const skip = (safePage - 1) * safeLimit;

        const paginatedTickets = filteredTickets.slice(skip, skip + safeLimit);

        return {
            data: paginatedTickets,
            total_items: filteredTickets.length,
            current_page: safePage,
            total_pages: Math.ceil(filteredTickets.length / safeLimit),
        };
    }

    async findByUserId(userId: string, page: number, limit: number) {
        const filteredTickets = this.tickets.filter(
            (t) => t.customer?.id === userId,
        );

        const safePage = Math.max(1, Number(page));
        const safeLimit = Math.max(1, Number(limit));
        const skip = (safePage - 1) * safeLimit;
        const paginatedTickets = filteredTickets.slice(skip, skip + safeLimit);

        return {
            data: paginatedTickets,
            total_items: filteredTickets.length,
            current_page: safePage,
            total_pages: Math.ceil(filteredTickets.length / safeLimit),
        };
    }

    async findByEventId(eventId: string, page: number, limit: number) {
        const filteredTickets = this.tickets.filter(
            (t) => t.events?.id === eventId,
        );

        const safePage = Math.max(1, Number(page));
        const safeLimit = Math.max(1, Number(limit));
        const skip = (safePage - 1) * safeLimit;
        const paginatedTickets = filteredTickets.slice(skip, skip + safeLimit);

        return {
            data: paginatedTickets,
            total_items: filteredTickets.length,
            current_page: safePage,
            total_pages: Math.ceil(filteredTickets.length / safeLimit),
        };
    }

    async verifyTicketsValidsByUserId(userId: string): Promise<boolean> {
        const userTickets = this.tickets.filter(
            (t) => t.customer?.id === userId,
        );
        return userTickets.some((t) => t.status === TicketStatus.VALID);
    }

    async update(id: string, data: Partial<Ticket>): Promise<Ticket | null> {
        const ticket = this.tickets.find((t) => t.id === id);
        if (!ticket) return null;
        Object.assign(ticket, data);
        return ticket;
    }

    async cancelAllTicketsByEventId(eventId: string): Promise<void> {
        this.tickets = this.tickets.map((ticket) => {
            if (ticket.events?.id === eventId) {
                ticket.status = TicketStatus.CANCELLED;
            }
            return ticket;
        });
    }

    async cancelTicket(id: string): Promise<Ticket | null> {
        const ticket = this.tickets.find((t) => t.id === id);
        if (!ticket) return null;
        ticket.status = TicketStatus.CANCELLED;
        return ticket;
    }
}
