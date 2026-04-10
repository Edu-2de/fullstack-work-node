import { Category } from "../../entities/category";

export interface ICategoryRepository {
    create(data: Partial<Category>): Promise<Category>;
    findByName(name: string): Promise<Category | null>;
}
