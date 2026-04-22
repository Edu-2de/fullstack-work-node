import { Category } from "../../entities/category";

export interface ICategoryRepository {
    create(data: Partial<Category>): Promise<Category>;
    findByName(name: string): Promise<Category | null>;
    findAll(page: number, limit: number): any;
    findById(id: string): Promise<Category | null>;
    findByNames(names: string[]): Promise<Category[]>;
    update(id: string, data: Partial<Category>): Promise<Category | null>;
    delete(id: string): Promise<void>;
}
