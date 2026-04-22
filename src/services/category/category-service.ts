import { ErrorMessages } from "../../constants/messages";
import { Category } from "../../entities/category";
import { AppError, HttpStatus } from "../../errors/AppError";
import { ICategoryRepository } from "../../repositories/category/ICategoryRepository";
import { IEventRepository } from "../../repositories/event/IEventRepository";

export class CategoryService {
    constructor(
        private categoryRepository: ICategoryRepository,
        private eventRepository: IEventRepository,
    ) {}

    private async findCategoryOrThrow(id: string) {
        const category = await this.categoryRepository.findById(id);
        if (!category) {
            throw new AppError(
                ErrorMessages.NOT_FOUND("Categoria"),
                HttpStatus.NOT_FOUND,
            );
        }
        return category;
    }
    private async ensureCategoryIsUnique(
        name?: string,
        currentCategoryId?: string,
    ) {
        if (!name) return;
        const category = await this.categoryRepository.findByName(name);
        if (category && category.id !== currentCategoryId) {
            throw new AppError(
                ErrorMessages.ALREADY_EXISTS("Categoria"),
                HttpStatus.BAD_REQUEST,
            );
        }
    }

    async create(data: Partial<Category>) {
        await this.ensureCategoryIsUnique(data.name);
        const newCategory = await this.categoryRepository.create(data);
        return newCategory;
    }

    async findAll(page: number, limit: number, search?: string) {
        return await this.categoryRepository.findAll(page, limit, search);
    }

    async update(id: string, data: Partial<Category>) {
        await this.findCategoryOrThrow(id);
        await this.ensureCategoryIsUnique(data.name, id);

        const updatedCategory = await this.categoryRepository.update(id, data);
        return updatedCategory;
    }

    async delete(id: string) {
        await this.findCategoryOrThrow(id);

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
