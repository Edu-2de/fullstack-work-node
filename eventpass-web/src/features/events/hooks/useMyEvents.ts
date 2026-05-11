import { useInfiniteQuery } from "@tanstack/react-query";
import { api } from "../../../helpers/api";
import { useAuth } from "../../auth/hooks/useAuth";

export function useMyEvents(searchItem: string = "") {
    const { user } = useAuth();
    const isOrganizer = user?.role === "organizer";

    const endpoint = isOrganizer
        ? "/events/organizer"
        : "/users/profile/tickets";

    const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } =
        useInfiniteQuery({
            queryKey: ["myEvents", user?.role, searchItem],
            queryFn: async ({ pageParam = 1 }) => {
                const response = await api.get(endpoint, {
                    params: {
                        page: pageParam,
                        limit: 8,
                        search: searchItem !== "" ? searchItem : undefined,
                    },
                });
                return response.data;
            },
            initialPageParam: 1,
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            getNextPageParam: (lastPage: any) => {
                if (lastPage.current_page < lastPage.total_pages) {
                    return lastPage.current_page + 1;
                }
                return undefined;
            },
            enabled: !!user,
        });

    const events =
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        data?.pages.flatMap((page: any) => {
            if (isOrganizer) {
                return page.data;
            }
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            return page.data.map((ticket: any) => ({
                ...ticket.events,
                ticketId: ticket.id,
                ticketStatus: ticket.status,
            }));
        }) ?? [];

    return {
        events,
        isLoading,
        hasMore: hasNextPage,
        loadMore: fetchNextPage,
        isFetchingNextPage,
    };
}
