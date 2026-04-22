import { Category } from "../../entities/category";
import { ICategoryRepository } from "./ICategoryRepository";

export class FakeCategoryRepository implements ICategoryRepository {
    private categories: Category[] = [];

    async create(data: Partial<Category>): Promise<Category> {
        const category = new Category();

        Object.assign(category, {
            id: Math.random().toString(),
            name: data.name,
        });

        this.categories.push(category);
        return category;
    }

    async findByName(name: string): Promise<Category | null> {
        const category = this.categories.find((c) => c.name === name);
        return category || null;
    }

    async findAll(page: number, limit: number, search?: string) {
        let filteredCategories = this.categories;

        if (search) {
            filteredCategories = filteredCategories.filter((c) =>
                c.name.toLowerCase().includes(search.toLowerCase()),
            );
        }

        const skip = (page - 1) * limit;

        const paginatedCategories = filteredCategories.slice(
            skip,
            skip + limit,
        );

        return {
            data: paginatedCategories,
            total_items: filteredCategories.length,
            current_page: page,
            total_pages: Math.ceil(filteredCategories.length / limit),
        };
    }

    async findById(id: string): Promise<Category | null> {
        const category = this.categories.find((c) => c.id === id);
        return category || null;
    }

    async findByNames(names: string[]): Promise<Category[]> {
        return this.categories.filter((c) => names.includes(c.name));
    }

    async update(
        id: string,
        data: Partial<Category>,
    ): Promise<Category | null> {
        const category = this.categories.find((c) => c.id === id);
        if (!category) {
            return null;
        }
        if (data.name) {
            category.name = data.name;
        }
        return category;
    }

    async delete(id: string): Promise<void> {
        const index = this.categories.findIndex((c) => c.id === id);
        if (index !== -1) {
            this.categories.splice(index, 1);
        }
    }
}
