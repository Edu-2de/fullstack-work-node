import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../../../helpers/api";

export function useCancelTicket() {
    const queryClient = useQueryClient();

    const mutation = useMutation({
        mutationFn: async (id: string) => {
            await api.patch(`/tickets/${id}/cancel`);
        },
        onSuccess: (_, id) => {
            queryClient.invalidateQueries({ queryKey: ["tickets"] });
            queryClient.invalidateQueries({ queryKey: ["tickets", id] });
        },
    });

    return {
        cancelTicket: mutation.mutateAsync,
        isCanceling: mutation.isPending,
        cancelError: mutation.error,
    };
}
