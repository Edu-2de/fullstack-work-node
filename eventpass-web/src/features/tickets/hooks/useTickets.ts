import React from "react";
import { api } from "../../../helpers/api";
import {
    type PaginatedTicketResponse,
    type Ticket,
} from "../models/ticket.types";

export function useTickets(searchItem: string = "") {
    const [tickets, setTickets] = React.useState<Ticket[]>([]);
    const [isLoading, setIsLoading] = React.useState(true);
    const [page, setPage] = React.useState(1);
    const [hasMore, setHasMore] = React.useState(true);

    async function fetchTickets(currentPage: number, currentSearch: string) {
        try {
            setIsLoading(true);

            const response = await api.get<PaginatedTicketResponse>(
                "/tickets",
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
                setTickets(data);
            } else {
                setTickets((prevTickets) => [...prevTickets, ...data]);
            }

            setHasMore(current_page < total_pages);
        } catch (error) {
            console.error("Erro ao buscar tickets", error);
        } finally {
            setIsLoading(false);
        }
    }

    React.useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setPage(1);
        fetchTickets(1, searchItem);
    }, [searchItem]);

    function loadMore() {
        if (hasMore && !isLoading) {
            const nextPage = page + 1;
            setPage(nextPage);
            fetchTickets(nextPage, searchItem);
        }
    }

    return { tickets, isLoading, hasMore, loadMore };
}
