import React from "react";
import { api } from "../../../helpers/api";
import type {
    Category,
    PaginatedCategoryResponse,
} from "../models/category.types";

export function useCategories() {
    const [categories, setCategories] = React.useState<Category[]>([]);
    const [isLoading, setIsLoading] = React.useState(true);

    async function fetchCategories() {
        try {
            setIsLoading(true);
            const response = await api.get<PaginatedCategoryResponse>(
                "/categories",
                {
                    params: {
                        page: 1,
                        limit: 50,
                    },
                },
            );
            setCategories(response.data.data);
        } catch (error) {
            console.error("Erro ao buscar categorias:", error);
        } finally {
            setIsLoading(false);
        }
    }

    React.useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        fetchCategories();
    }, []);

    return { categories, isLoading };
}
