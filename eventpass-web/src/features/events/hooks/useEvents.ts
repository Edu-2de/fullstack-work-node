import { useEffect, useState } from "react";
import { api } from "../../../helpers/api";
import type { Event, PaginatedEventResponse } from "../models/event.types";

export function useEvents() {
    const [events, setEvents] = useState<Event[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);

    async function fetchEvents(currentPage: number) {
        try {
            setIsLoading(true);

            const response = await api.get<PaginatedEventResponse>("/events", {
                params: {
                    page: currentPage,
                    limit: 8,
                },
            });

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

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        fetchEvents(page);
    }, [page]);

    function loadMore() {
        if (hasMore && !isLoading) {
            setPage((prevPage) => prevPage + 1);
        }
    }

    return { events, isLoading, hasMore, loadMore };
}
