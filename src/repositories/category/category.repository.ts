import { In, Repository } from "typeorm";
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

    async findAll(): Promise<Category[]> {
        return this.ormRepository.find();
    }

    async findById(id: string): Promise<Category | null> {
        return this.ormRepository.findOne({ where: { id } });
    }

    async delete(id: string): Promise<void> {
        await this.ormRepository.delete(id);
    }

    async findByNames(names: string[]): Promise<Category[]> {
        return this.ormRepository.find({
            where: {
                name: In(names),
            },
        });
    }
}
