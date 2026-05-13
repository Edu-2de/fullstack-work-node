import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../../../helpers/api";

export function useCreateTicket() {
    const queryClient = useQueryClient();

    const mutation = useMutation({
        mutationFn: async (eventId: string) => {
            const response = await api.post(`/tickets/${eventId}`);
            return response.data;
        },
        onSuccess: (_, eventId) => {
            queryClient.invalidateQueries({ queryKey: ["event", eventId] });
        },
    });

    return {
        createTicket: mutation.mutateAsync,
        isBuying: mutation.isPending,
        error: mutation.error,
    };
}
