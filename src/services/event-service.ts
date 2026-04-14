import { ErrorMessages } from "../constants/messages";
import { Event } from "../entities/event";
import { UserRole } from "../entities/user";
import { AppError, HttpStatus } from "../errors/AppError";
import { CategoryRepository } from "../repositories/category/category.repository";
import { EventRepository } from "../repositories/event/event.repository";
import { UserRepository } from "../repositories/user/user.repository";

export class EventService {
    constructor(
        private eventRepository: EventRepository,
        private userRepository: UserRepository,
        private categoryRepository: CategoryRepository,
    ) {}

    async create(
        organizer_id: string,
        categories: string[],
        data: Partial<Event>,
    ) {
        const foundCategories =
            await this.categoryRepository.findByNames(categories);

        if (foundCategories.length !== categories.length) {
            throw new AppError(
                "Uma ou mais categorias fornecidas nao existem no sistema",
                HttpStatus.BAD_REQUEST,
            );
        }
        const event = await this.eventRepository.create(
            organizer_id,
            foundCategories,
            data,
        );
        return event;
    }

    async findById(id: string) {
        const event = await this.eventRepository.findById(id);
        if (!event) {
            throw new AppError(
                ErrorMessages.NOT_FOUND("Evento"),
                HttpStatus.FORBIDDEN,
            );
        }
        return event;
    }

    async findAll() {
        return await this.eventRepository.findAll();
    }

    async update(
        id: string,
        organizer_id: string,
        categories: string[],
        data: Partial<Event>,
    ) {
        const eventExists = await this.categoryRepository.findById(id);
        if (!eventExists) {
            throw new AppError(
                ErrorMessages.NOT_FOUND("Evento"),
                HttpStatus.FORBIDDEN,
            );
        }
        const organizerExists =
            await this.userRepository.findById(organizer_id);
        if (!organizerExists) {
            throw new AppError(
                ErrorMessages.NOT_FOUND("Usuário"),
                HttpStatus.FORBIDDEN,
            );
        }
        if (organizerExists.role != UserRole.ORGANIZER) {
            throw new AppError(
                ErrorMessages.UNAUTHORIZED(),
                HttpStatus.UNAUTHORIZED,
            );
        }

        const foundCategories =
            await this.categoryRepository.findByNames(categories);

        if (foundCategories.length !== categories.length) {
            throw new AppError(
                "Uma ou mais categorias fornecidas nao existem no sistema",
                HttpStatus.BAD_REQUEST,
            );
        }

        const updatedEvent = await this.eventRepository.update(
            id,
            organizer_id,
            foundCategories,
            data,
        );

        return updatedEvent;
    }
}
