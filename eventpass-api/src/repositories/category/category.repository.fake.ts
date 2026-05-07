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

        const safePage = Math.max(1, Number(page));
        const safeLimit = Math.max(1, Number(limit));
        const skip = (safePage - 1) * safeLimit;

        const paginatedCategories = filteredCategories.slice(
            skip,
            skip + safeLimit,
        );

        return {
            data: paginatedCategories,
            total_items: filteredCategories.length,
            current_page: safePage,
            total_pages: Math.ceil(filteredCategories.length / safeLimit),
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
        if (!category) return null;
        Object.assign(category, data);
        return category;
    }

    async delete(id: string): Promise<void> {
        const index = this.categories.findIndex((c) => c.id === id);
        if (index !== -1) {
            this.categories.splice(index, 1);
        }
    }
}
