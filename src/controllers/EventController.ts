import { Request, Response } from "express";
import fs from "fs";
import path from "path";
import { ValidMessages } from "../constants/messages";
import { AppError } from "../errors/AppError";
import { EventService } from "../services/event-service";

export class EventController {
    constructor(private eventService: EventService) {}

    async create(req: Request, res: Response) {
        const {
            title,
            description,
            start_date,
            location,
            total_capacity,
            price,
            categories,
        } = req.body;

        const organizer_id = req.user.id;

        if (!req.file) {
            throw new AppError(
                "A imagem de banner do evento é obrigatória",
                400,
            );
        }

        const banner_url = req.file.filename;

        try {
            const event = await this.eventService.create(
                organizer_id,
                categories,
                {
                    title,
                    description,
                    start_date,
                    location,
                    total_capacity,
                    price,
                    banner_url,
                },
            );

            const { id, ...restOfEvent } = event;

            return res.status(201).json({
                id: id,
                ...restOfEvent,
            });
        } catch (error) {
            //1. discovered the physical path of the image that Multer just saved.
            const filePath = path.resolve(
                __dirname,
                "..",
                "..",
                "uploads",
                banner_url,
            );

            //2. If the file is there, we'll delete it!
            if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath);
            }

            throw error;
        }
    }

    async findById(req: Request, res: Response) {
        const eventId = req.params.id as string;
        const event = await this.eventService.findById(eventId);
        return res.status(200).json(event);
    }

    async findAll(req: Request, res: Response) {
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;

        const search = req.query.search as string;
        const categoryId = req.query.categoryId as string;
        const startDateString = req.query.startDate as string;

        const startDate = startDateString
            ? new Date(startDateString)
            : undefined;

        const events = await this.eventService.findAll(
            page,
            limit,
            search,
            categoryId,
            startDate,
        );
        return res.status(200).json(events);
    }

    async update(req: Request, res: Response) {
        const { categories, ...eventData } = req.body;

        const loggedUserId = req.user.id;
        const event_id = req.params.id as string;
        const userRole = req.user.role;
        const banner_url = req.file ? req.file.filename : undefined;

        try {
            const event = await this.eventService.update(
                event_id,
                loggedUserId,
                userRole,
                categories,
                {
                    ...eventData,
                    ...(banner_url && { banner_url }),
                },
            );

            return res.status(200).json(event);
        } catch (error) {
            if (banner_url) {
                const filePath = path.resolve(
                    __dirname,
                    "..",
                    "..",
                    "uploads",
                    banner_url,
                );

                if (fs.existsSync(filePath)) {
                    fs.unlinkSync(filePath);
                }
            }
            throw error;
        }
    }

    async delete(req: Request, res: Response) {
        const eventId = req.params.id as string;
        const organizerId = req.user.id;
        const userRole = req.user.role;
        await this.eventService.delete(eventId, organizerId, userRole);
        return res.status(200).json(ValidMessages.DELETED("Evento"));
    }

    async findTickets(req: Request, res: Response) {
        const eventId = req.params.id as string;
        const organizerId = req.user.id;
        const userRole = req.user.role;
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;

        const tickets = await this.eventService.findTickets(
            eventId,
            organizerId,
            userRole,
            page,
            limit,
        );
        return res.status(200).json(tickets);
    }
}
