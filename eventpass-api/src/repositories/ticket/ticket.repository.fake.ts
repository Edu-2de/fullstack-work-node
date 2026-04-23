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

        if (eventId) {
            filteredTickets = filteredTickets.filter(
                (t) => t.events?.id === eventId,
            );
        }

        const skip = (page - 1) * limit;
        const paginatedTickets = filteredTickets.slice(skip, skip + limit);

        return {
            data: paginatedTickets,
            total_items: filteredTickets.length,
            current_page: page,
            total_pages: Math.ceil(filteredTickets.length / limit),
        };
    }

    async findByUserId(userId: string, page: number, limit: number) {
        const filteredTickets = this.tickets.filter(
            (t) => t.customer?.id === userId,
        );

        const skip = (page - 1) * limit;
        const paginatedTickets = filteredTickets.slice(skip, skip + limit);

        return {
            data: paginatedTickets,
            total_items: filteredTickets.length,
            current_page: page,
            total_pages: Math.ceil(filteredTickets.length / limit),
        };
    }

    async findByEventId(eventId: string, page: number, limit: number) {
        const filteredTickets = this.tickets.filter(
            (t) => t.events?.id === eventId,
        );

        const skip = (page - 1) * limit;
        const paginatedTickets = filteredTickets.slice(skip, skip + limit);

        return {
            data: paginatedTickets,
            total_items: filteredTickets.length,
            current_page: page,
            total_pages: Math.ceil(filteredTickets.length / limit),
        };
    }

    async verifyTicketsValidsByUserId(userId: string): Promise<boolean> {
        const filteredTickets = this.tickets;
        filteredTickets.filter((t) => t.customer?.id === userId);
        const tickets = filteredTickets.find(
            (t) => t.status === TicketStatus.VALID,
        );
        if (tickets) {
            return true;
        } else {
            return false;
        }
    }

    async update(id: string, data: Partial<Ticket>): Promise<Ticket | null> {
        const ticket = this.tickets.find((t) => t.id === id);
        if (!ticket) {
            return null;
        }
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
        if (!ticket) {
            return null;
        }
        ticket.status = TicketStatus.CANCELLED;
        return ticket;
    }
}
