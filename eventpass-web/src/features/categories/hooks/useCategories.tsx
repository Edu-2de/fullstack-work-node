import { useInfiniteQuery } from "@tanstack/react-query";
import { api } from "../../../helpers/api";
import type { PaginatedCategoryResponse } from "../models/category.types";

export function useCategories(searchItem: string = "") {
    const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } =
        useInfiniteQuery({
            queryKey: ["categories", "infinite", searchItem],
            queryFn: async ({ pageParam = 1 }) => {
                const response = await api.get<PaginatedCategoryResponse>(
                    "/categories",
                    {
                        params: {
                            page: pageParam,
                            limit: 8,
                            search: searchItem !== "" ? searchItem : undefined,
                        },
                    },
                );
                return response.data;
            },
            initialPageParam: 1,

            getNextPageParam: (lastPage) => {
                if (lastPage.current_page < lastPage.total_pages) {
                    return lastPage.current_page + 1;
                }
                return undefined;
            },
        });

    const categories = data?.pages.flatMap((page) => page.data) ?? [];

    return {
        categories,
        isLoading,
        hasMore: hasNextPage,
        loadMore: fetchNextPage,
        isFetchingNextPage,
    };
}
