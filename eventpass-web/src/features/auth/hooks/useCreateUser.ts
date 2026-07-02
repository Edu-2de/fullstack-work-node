import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../../../helpers/api";
import type { RegisterByAdminFormData } from "../models/auth.types";

export function useCreateUser() {
    const queryClient = useQueryClient();

    const mutation = useMutation({
        mutationFn: async (data: RegisterByAdminFormData) => {
            // Ajuste a rota '/users' conforme sua API
            const response = await api.post("/users", data);
            return response.data;
        },
        onSuccess: () => {
            // Invalida a query de listagem de usuários caso você tenha uma tabela depois
            queryClient.invalidateQueries({ queryKey: ["users"] });
        },
    });

    return {
        createUser: mutation.mutateAsync,
        isCreating: mutation.isPending,
        createError: mutation.error,
    };
}
