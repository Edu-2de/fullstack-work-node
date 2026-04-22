import { FindOptionsWhere, ILike, In, Repository } from "typeorm";
import { AppDataSource } from "../../data-source";
import { Category } from "../../entities/category";
import { ICategoryRepository } from "./ICategoryRepository";

export class CategoryRepository implements ICategoryRepository {
    private ormRepository: Repository<Category>;

    constructor() {
        this.ormRepository = AppDataSource.getRepository(Category);
    }

    async create(data: Partial<Category>): Promise<Category> {
        const category = this.ormRepository.create(data);
        await this.ormRepository.save(category);
        return category;
    }

    async findByName(name: string): Promise<Category | null> {
        return this.ormRepository.findOne({ where: { name } });
    }

    async findAll(page: number, limit: number, search?: string) {
        const skip = (page - 1) * limit;

        const where: FindOptionsWhere<Category> = {};

        if (search) {
            where.name = ILike(`%${search}%`);
        }

        const [categories, total] = await this.ormRepository.findAndCount({
            where: where,
            skip: skip,
            take: limit,
        });

        return {
            data: categories,
            total_items: total,
            current_page: page,
            total_pages: Math.ceil(total / limit),
        };
    }

    async findById(id: string): Promise<Category | null> {
        return this.ormRepository.findOne({ where: { id } });
    }

    async findByNames(names: string[]): Promise<Category[]> {
        return this.ormRepository.find({
            where: {
                name: In(names),
            },
        });
    }

    async update(
        id: string,
        data: Partial<Category>,
    ): Promise<Category | null> {
        const category = await this.ormRepository.findOne({ where: { id } });
        if (!category) {
            return null;
        }
        this.ormRepository.merge(category, data);
        const updatedCategory = await this.ormRepository.save(category);
        return updatedCategory;
    }

    async delete(id: string): Promise<void> {
        await this.ormRepository.delete(id);
    }
}
