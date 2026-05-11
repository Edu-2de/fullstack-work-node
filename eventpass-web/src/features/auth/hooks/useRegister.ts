import { useMutation } from "@tanstack/react-query";
import { api } from "../../../helpers/api";
import { type RegisterFormData } from "../models/auth.types";

export function useRegister() {
    const mutation = useMutation({
        mutationFn: async (data: RegisterFormData) => {
            const response = await api.post("/users/register", data);
            return response.data;
        },
    });

    return {
        registerUser: mutation.mutateAsync,
        isSubmitting: mutation.isPending,
        submitError: mutation.error,
    };
}
