import { useQuery } from "@tanstack/react-query";
import { api } from "../../../helpers/api";
import type { Event } from "../models/event.types";

export function useEvent(id?: string) {
    const { data, isLoading, error } = useQuery({
        queryKey: ["event", id],
        queryFn: async () => {
            const response = await api.get<Event>(`/events/${id}`);
            return response.data;
        },

        enabled: !!id,
    });
    return {
        event: data,
        isLoading,
        error,
    };
}
