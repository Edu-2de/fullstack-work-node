import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../../../helpers/api";

export function useDeleteEvent() {
    const queryClient = useQueryClient();

    const mutation = useMutation({
        mutationFn: async (id: string) => {
            await api.delete(`/events/${id}`);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["events"] });
        },
    });

    return {
        deleteEvent: mutation.mutateAsync,
        isDeleting: mutation.isPending,
        error: mutation.error,
    };
}
