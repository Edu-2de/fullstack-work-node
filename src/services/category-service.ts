import { ErrorMessages } from "../constants/messages";
import { Category } from "../entities/category";
import { AppError, HttpStatus } from "../errors/AppError";
import { CategoryRepository } from "../repositories/category/category.repository";

export class CategoryService {
    constructor(private categoryRepository: CategoryRepository) {}

    async create(data: Partial<Category>) {
        const category = await this.categoryRepository.findByName(data.name!);
        if (category) {
            throw new AppError(
                ErrorMessages.CATEGORY_ALREADY_EXISTS,
                HttpStatus.BAD_REQUEST,
            );
        }
        const newCategory = await this.categoryRepository.create(data);
        return newCategory;
    }

    async findAll() {
        return await this.categoryRepository.findAll();
    }
}
