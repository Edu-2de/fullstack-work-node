import { useInfiniteQuery } from "@tanstack/react-query";
import { api } from "../../../helpers/api";
import type { PaginatedEventResponse } from "../models/event.types";

export function useEvents(searchItem: string = "") {
    const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } =
        useInfiniteQuery({
            queryKey: ["events", "infinite", searchItem],
            queryFn: async ({ pageParam = 1 }) => {
                const response = await api.get<PaginatedEventResponse>(
                    "/events",
                    {
                        params: {
                            page: pageParam,
                            limit: 8,
                            search: searchItem !== "" ? searchItem : undefined,
                            startDate: new Date().toISOString(),
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

    const events = data?.pages.flatMap((page) => page.data) ?? [];

    return {
        events,
        isLoading,
        hasMore: hasNextPage,
        loadMore: fetchNextPage,
        isFetchingNextPage,
    };
}
