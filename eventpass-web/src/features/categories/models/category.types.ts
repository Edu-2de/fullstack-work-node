import { z } from "zod";
import type { createCategorySchema } from "../schema";

export type CategoryFormData = z.infer<typeof createCategorySchema>;

export interface Category {
    id: string;
    name: string;
}

export interface PaginatedCategoryResponse {
    data: Category[];
    total_items: number;
    current_page: number;
    total_pages: number;
}
