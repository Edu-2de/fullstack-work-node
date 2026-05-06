import React, { useEffect } from "react";
import { api } from "../../../helpers/api";
import type { Event } from "../models/event.types";

export function useEvent(id?: string) {
    const [event, setEvent] = React.useState<Event | null>(null);
    const [isLoading, setIsLoading] = React.useState(true);

    async function fetchEvent() {
        try {
            setIsLoading(true);

            const response = await api.get<Event>(`events/${id}`);

            setEvent(response.data);
        } catch (error) {
            console.error("Erro ao buscar detalhes do evento:", error);
        } finally {
            setIsLoading(false);
        }
    }

    useEffect(() => {
        if (id) {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            fetchEvent();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id]);

    return { event, isLoading };
}
