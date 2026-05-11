import { useInfiniteQuery } from "@tanstack/react-query";
import { api } from "../../../helpers/api";
import type { PaginatedEventResponse } from "../models/event.types";

export function useCustomerEvents(
    searchItem: string = "",
    isEnabled: boolean = true,
) {
    const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } =
        useInfiniteQuery({
            queryKey: ["eventsCustomer", "infinite", searchItem],
            queryFn: async ({ pageParam = 1 }) => {
                const response = await api.get<PaginatedEventResponse>(
                    "/users/profile/tickets",
                    {
                        params: {
                            page: pageParam,
                            limit: 8,
                            search: searchItem !== "" ? searchItem : undefined,
                            enabled: isEnabled,
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

    const eventsCustomer =
        data?.pages.flatMap((page) =>
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            page.data.map((ticket: any) => ticket.events),
        ) ?? [];

    return {
        eventsCustomer,
        isLoadingCustomer: isLoading,
        hasMoreCustomer: hasNextPage,
        loadMoreCustomer: fetchNextPage,
        isFetchingNextPageCustomer: isFetchingNextPage,
    };
}
