import fs from "fs";
import path from "path";
import { ErrorMessages } from "../../constants/messages";
import { Event, EventStatus } from "../../entities/event";
import { UserRole } from "../../entities/user";
import { AppError, HttpStatus } from "../../errors/AppError";
import { normalizeString } from "../../helpers/string.helper";
import { ICategoryRepository } from "../../repositories/category/ICategoryRepository";
import { IEventRepository } from "../../repositories/event/IEventRepository";
import { ITicketRepository } from "../../repositories/ticket/ITicketRepository";

export class EventService {
    constructor(
        private eventRepository: IEventRepository,
        private categoryRepository: ICategoryRepository,
        private ticketRepository: ITicketRepository,
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
        const normalizedCategories = categories.map((name) =>
            normalizeString(name),
        );

        const foundCategories =
            await this.validateCategoriesOrThrow(normalizedCategories);

        if (data.start_date && new Date(data.start_date) < new Date()) {
            throw new AppError(
                "Não é possível criar um evento no passado.",
                HttpStatus.BAD_REQUEST,
            );
        }
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

    async findAll(
        page: number,
        limit: number,
        search?: string,
        categoryId?: string,
        startDate?: Date,
    ) {
        return await this.eventRepository.findAll(
            page,
            limit,
            search,
            categoryId,
            startDate,
        );
    }

    async findAllByOrganizerId(
        organizerId: string,
        page: number,
        limit: number,
        search?: string,
    ) {
        return await this.eventRepository.findAllByOrganizerId(
            organizerId,
            page,
            limit,
            search,
        );
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

        const normalizedCategories = categories
            ? categories.map((name) => normalizeString(name))
            : undefined;

        if (data.start_date && new Date(data.start_date) < new Date()) {
            throw new AppError(
                "Não é possível remarcar o evento para uma data no passado.",
                HttpStatus.BAD_REQUEST,
            );
        }

        const foundCategories = normalizedCategories
            ? await this.validateCategoriesOrThrow(normalizedCategories)
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

    async cancel(id: string, organizerId: string, userRole: string) {
        const eventExists = await this.findEventOrThrow(id);
        this.ensureOwnerShip(eventExists, organizerId, userRole);

        if (eventExists.status !== EventStatus.CANCELLED) {
            await this.eventRepository.update(
                eventExists.id,
                eventExists.categories,
                { status: EventStatus.CANCELLED },
            );
        }

        await this.ticketRepository.cancelAllTicketsByEventId(eventExists.id);
    }

    async delete(id: string, organizerId: string, userRole: string) {
        const eventExists = await this.findEventOrThrow(id);
        this.ensureOwnerShip(eventExists, organizerId, userRole);

        const tickets = await this.ticketRepository.findByEventId(id, 1, 1);
        if (tickets.total_items > 0) {
            throw new AppError(
                "Não é possível excluir um evento que já possui ingressos vendidos. Utilize a opção de cancelar o evento.",
                HttpStatus.CONFLICT,
            );
        }

        if (eventExists.banner_url) {
            const filePath = path.resolve(
                __dirname,
                "..",
                "..",
                "..",
                "uploads",
                eventExists.banner_url,
            );
            if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath);
            }
        }

        this.ticketRepository.cancelAllTicketsByEventId(eventExists.id);

        await this.eventRepository.delete(id);
    }

    async findTickets(
        eventId: string,
        organizerId: string,
        userRole: string,
        page: number,
        limit: number,
    ) {
        const event = await this.findEventOrThrow(eventId);
        this.ensureOwnerShip(event, organizerId, userRole);

        return await this.ticketRepository.findByEventId(eventId, page, limit);
    }
}
