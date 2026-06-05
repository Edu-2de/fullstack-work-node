import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../../../helpers/api";

export function useCreateCategory() {
    const queryClient = useQueryClient();

    const mutation = useMutation({
        mutationFn: async (payload:{name: string}) => {
            const response = await api.post(`/categories`, payload);
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["categories"] });
        },
    });

    return {
        createCategory: mutation.mutateAsync,
        error: mutation.error,
    };
}
