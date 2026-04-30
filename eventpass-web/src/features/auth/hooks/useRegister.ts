import { api } from "../../../helpers/api";
import { type RegisterFormData } from "../models/auth.types";

export function useRegister() {
    async function registerUser(data: RegisterFormData) {
        await api.post("/users/register", data);
    }

    return { registerUser };
}
