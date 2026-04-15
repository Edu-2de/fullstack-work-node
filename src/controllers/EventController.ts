import { Request, Response } from "express";
import fs from "fs";
import path from "path";
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
            available_capacity,
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
                    available_capacity,
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
        return res.status(201).json(event);
    }

    async findAll(req: Request, res: Response) {
        const events = await this.eventService.findAll();
        return res.status(201).json(events);
    }

    async update(req: Request, res: Response) {
        const {
            title,
            description,
            start_date,
            location,
            total_capacity,
            available_capacity,
            price,
            categories,
        } = req.body;

        const organizer_id = req.user.id;
        const event_id = req.params.id as string;
        const banner_url = req.file ? req.file.filename : undefined;

        try {
            const event = await this.eventService.update(
                event_id,
                organizer_id,
                categories,
                {
                    title,
                    description,
                    start_date,
                    location,
                    total_capacity,
                    available_capacity,
                    price,
                    ...(banner_url && { banner_url }),
                },
            );

            return res.status(201).json(event);
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
}
