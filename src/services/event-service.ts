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
        const userExists = await this.userRepository.findById(organizer_id);
        if (!userExists) {
            throw new AppError(
                ErrorMessages.NOT_FOUND("Usuário"),
                HttpStatus.NOT_FOUND,
            );
        }
        if (userExists.role !== UserRole.ORGANIZER) {
            throw new AppError(
                ErrorMessages.UNAUTHORIZED(),
                HttpStatus.FORBIDDEN,
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
        const event = await this.eventRepository.create(
            organizer_id,
            foundCategories,
            data,
        );
        return event;
    }
}
