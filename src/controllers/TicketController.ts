import { Request, Response } from "express";
import { TicketService } from "../services/ticket-service";

export class TicketController {
    constructor(private ticketService: TicketService) {}

    async create(req: Request, res: Response) {
        const eventId = req.params.eventId as string;
        const userId = req.user.id;
        const data = req.body;

        const ticket = await this.ticketService.create(eventId, userId, data);
        res.status(201).json(ticket);
    }
}
