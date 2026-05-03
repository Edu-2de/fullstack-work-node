import { useEffect, useState } from "react";
import { api } from "../../../helpers/api";
import type { Event, PaginatedEventResponse } from "../models/event.types";

export function useEvents() {
    const [events, setEvents] = useState<Event[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    async function fetchEvents() {
        try {
            setIsLoading(true);
            const response = await api.get<PaginatedEventResponse>("/events");
            setEvents(response.data.data);
        } catch (error) {
            console.error("Erro ao buscar eventos", error);
        } finally {
            setIsLoading(false);
        }
    }

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        fetchEvents();
    }, []);

    return { events, isLoading };
}
