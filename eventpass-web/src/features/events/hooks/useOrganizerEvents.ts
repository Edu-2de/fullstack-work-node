import React from "react";
import { api } from "../../../helpers/api";
import type { Event, PaginatedEventResponse } from "../models/event.types";

export function useOrganizerEvents(searchItem: string = "") {
    const [events, setEvents] = React.useState<Event[]>([]);
    const [isLoading, setIsLoading] = React.useState(true);
    const [page, setPage] = React.useState(1);
    const [hasMore, setHasMore] = React.useState(true);

    async function fetchOrganizerEvents(
        currentPage: number,
        currentSearch: string,
    ) {
        try {
            setIsLoading(true);

            const response = await api.get<PaginatedEventResponse>(
                "events/organizer",
                {
                    params: {
                        page: currentPage,
                        limit: 8,
                        search: currentSearch !== "" ? currentPage : undefined,
                    },
                },
            );

            const { data, current_page, total_pages } = response.data;

            if (currentPage === 1) {
                setEvents(data);
            } else {
                setEvents((prevEvents) => [...prevEvents, ...data]);
            }

            setHasMore(current_page < total_pages);
        } catch (error) {
            console.error("Erro ao buscar eventos", error);
        } finally {
            setIsLoading(false);
        }
    }

    React.useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setPage(1);
        fetchOrganizerEvents(1, searchItem);
    }, [searchItem]);

    function loadMore() {
        if (hasMore && !isLoading) {
            const nextPage = page + 1;
            setPage(nextPage);
            fetchOrganizerEvents(nextPage, searchItem);
        }
    }

    return { events, isLoading, hasMore, loadMore };
}
