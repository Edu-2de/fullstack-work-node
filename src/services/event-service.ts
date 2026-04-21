import fs from "fs";
import path from "path";
import { ErrorMessages } from "../constants/messages";
import { Event } from "../entities/event";
import { UserRole } from "../entities/user";
import { AppError, HttpStatus } from "../errors/AppError";
import { CategoryRepository } from "../repositories/category/category.repository";
import { EventRepository } from "../repositories/event/event.repository";
import { TicketRepository } from "../repositories/ticket/ticket.repository";

export class EventService {
    constructor(
        private eventRepository: EventRepository,
        private categoryRepository: CategoryRepository,
        private ticketRepository: TicketRepository,
    ) {}

    private async findEventOrThrow(id: string) {
        const event = await this.eventRepository.findById(id);
        if (!event) {
            throw new AppError(
                ErrorMessages.NOT_FOUND("Evento"),
                HttpStatus.NOT_FOUND,
            );
        }
        return event;
    }

    private async validateCategoriesOrThrow(categories?: string[]) {
        if (!categories || categories.length === 0) return [];

        const foundCategories =
            await this.categoryRepository.findByNames(categories);

        if (foundCategories.length !== categories.length) {
            throw new AppError(
                "Uma ou mais categorias fornecidas nao existem",
                HttpStatus.BAD_REQUEST,
            );
        }
        return foundCategories;
    }

    private ensureOwnerShip(
        event: Event,
        loggedUserId: string,
        loggedUserRole: string,
    ) {
        if (loggedUserRole === UserRole.ADMIN) return;

        if (event.organizer.id !== loggedUserId) {
            throw new AppError(
                ErrorMessages.UNAUTHORIZED(),
                HttpStatus.FORBIDDEN,
            );
        }
    }

    async create(
        organizer_id: string,
        categories: string[],
        data: Partial<Event>,
    ) {
        const foundCategories =
            await this.validateCategoriesOrThrow(categories);
        data.available_capacity = data.total_capacity;
        return await this.eventRepository.create(
            organizer_id,
            foundCategories,
            data,
        );
    }

    async findById(id: string) {
        return await this.findEventOrThrow(id);
    }

    async findAll(page: number, limit: number) {
        return await this.eventRepository.findAll(page, limit);
    }

    async update(
        id: string,
        loggedUserId: string,
        userRole: string,
        categories: string[],
        data: Partial<Event>,
    ) {
        const eventExists = await this.findEventOrThrow(id);
        this.ensureOwnerShip(eventExists, loggedUserId, userRole);

        const foundCategories = categories
            ? await this.validateCategoriesOrThrow(categories)
            : eventExists.categories;

        const updatedEvent = await this.eventRepository.update(
            id,
            foundCategories,
            data,
        );

        if (data.available_capacity) {
            if (
                data.available_capacity < 0 ||
                data.available_capacity > eventExists.total_capacity
            ) {
                throw new AppError(
                    "A capacidade disponível deve ser maior que 0 e menor que a capacidade total",
                    HttpStatus.BAD_REQUEST,
                );
            }
        }

        if (data.banner_url && eventExists.banner_url) {
            const filePath = path.resolve(
                __dirname,
                "..",
                "..",
                "uploads",
                eventExists.banner_url,
            );

            if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath);
            }
        }
        return updatedEvent;
    }

    async delete(id: string, organizerId: string, userRole: string) {
        const eventExists = await this.findEventOrThrow(id);
        this.ensureOwnerShip(eventExists, organizerId, userRole);

        await this.eventRepository.delete(id);
    }

    async findTickets(eventId: string, organizerId: string, userRole: string) {
        const event = await this.findEventOrThrow(eventId);
        this.ensureOwnerShip(event, organizerId, userRole);

        return await this.ticketRepository.findByEventId(eventId);
    }
}
