import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../../../helpers/api";

export function useCancelEvent() {
    const queryClient = useQueryClient();

    const mutation = useMutation({
        mutationFn: async (id: string) => {
            await api.patch(`/events/${id}/cancel`);
        },
        onSuccess: (_, id) => {
            queryClient.invalidateQueries({ queryKey: ["events"] });
            queryClient.invalidateQueries({ queryKey: ["event", id] });
        },
    });

    return {
        cancelEvent: mutation.mutateAsync,
        isCanceling: mutation.isPending,
        cancelError: mutation.error,
    };
}
