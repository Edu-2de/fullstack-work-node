import { Request, Response } from "express";
import { TicketService } from "../services/ticket-service";

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
        const tickets = await this.ticketService.findAll();

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
}
