import { Request, Response } from "express";
import { TicketService } from "../services/ticket/ticket-service";

export class TicketController {
    constructor(private ticketService: TicketService) {}

    async create(req: Request, res: Response) {
        const eventId = req.params.id as string;
        const userId = req.user.id;
        const data = req.body;

        const ticket = await this.ticketService.create(eventId, userId, data);
        res.status(201).json(ticket);
    }

    async findById(req: Request, res: Response) {
        const id = req.params.id as string;

        const ticket = await this.ticketService.findById(id);
        res.status(200).json(ticket);
    }

    async findAll(req: Request, res: Response) {
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;
        const search = req.query.search as string;
        const eventId = req.query.eventId as string;

        const tickets = await this.ticketService.findAll(
            page,
            limit,
            search,
            eventId,
        );
        res.status(200).json(tickets);
    }

    async useTicket(req: Request, res: Response) {
        const id = req.params.id as string;
        const userId = req.user.id;
        const userRole = req.user.role;
        const { eventId } = req.body;

        const ticket = await this.ticketService.useTicket(
            id,
            userId,
            userRole,
            eventId,
        );
        res.status(200).json(ticket);
    }

    async cancelTicket(req: Request, res: Response) {
        const id = req.params.id as string;
        const userId = req.user.id;
        const userRole = req.user.role;

        const ticket = await this.ticketService.cancelTicket(
            id,
            userId,
            userRole,
        );
        res.status(200).json(ticket);
    }
}
