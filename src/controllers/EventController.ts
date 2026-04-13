import { Request, Response } from "express";
import fs from "fs";
import path from "path";
import { AppError } from "../errors/AppError";
import { eventService } from "../factories/services-factory";

export class EventController {
    async create(req: Request, res: Response) {
        const {
            title,
            description,
            start_date,
            location,
            total_capacity,
            available_capacity,
            price,
            organizer_id,
            categories,
        } = req.body;

        if (!req.file) {
            throw new AppError(
                "A imagem de banner do evento é obrigatória",
                400,
            );
        }

        const banner_url = req.file.filename;

        try {
            const event = await eventService.create(organizer_id, categories, {
                title,
                description,
                start_date,
                location,
                total_capacity,
                available_capacity,
                price,
                banner_url,
            });

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
}
