import { ErrorMessages } from "../constants/messages";
import { Category } from "../entities/category";
import { AppError, HttpStatus } from "../errors/AppError";
import { CategoryRepository } from "../repositories/category/category.repository";
import { EventRepository } from "../repositories/event/event.repository";

export class CategoryService {
    constructor(
        private categoryRepository: CategoryRepository,
        private eventRepository: EventRepository,
    ) {}

    async create(data: Partial<Category>) {
        const category = await this.categoryRepository.findByName(data.name!);
        if (category) {
            throw new AppError(
                ErrorMessages.ALREADY_EXISTS("Categoria"),
                HttpStatus.BAD_REQUEST,
            );
        }
        const newCategory = await this.categoryRepository.create(data);
        return newCategory;
    }

    async findAll() {
        return await this.categoryRepository.findAll();
    }

    async update(id: string, data: Partial<Category>) {
        const category = await this.categoryRepository.findById(id);

        if (!category) {
            throw new AppError(
                ErrorMessages.NOT_FOUND("Categoria"),
                HttpStatus.NOT_FOUND,
            );
        }

        if (data.name) {
            const categoryExists = await this.categoryRepository.findByName(
                data.name,
            );
            if (categoryExists) {
                throw new AppError(
                    ErrorMessages.ALREADY_EXISTS("Categoria"),
                    HttpStatus.BAD_REQUEST,
                );
            }
        }

        const updatedCategory = await this.categoryRepository.update(id, data);
        return updatedCategory;
    }

    async delete(id: string) {
        const category = await this.categoryRepository.findById(id);
        if (!category) {
            throw new AppError(
                ErrorMessages.NOT_FOUND("Categoria"),
                HttpStatus.NOT_FOUND,
            );
        }

        const isCategoryInUse = await this.eventRepository.findByCategoryId(id);
        if (isCategoryInUse) {
            throw new AppError(
                ErrorMessages.IN_USE("categoria", "eventos"),
                HttpStatus.CONFLICT,
            );
        }

        await this.categoryRepository.delete(id);
    }
}
