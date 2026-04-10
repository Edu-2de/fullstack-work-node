import { z } from "zod";
import { UserRole } from "../entities/user";

export const createUserSchema = z.object({
    email: z.email("Formato de e-mail inválido"),
    password_encrypted: z
        .string()
        .min(6, "A senha deve ter no minimo 6 caracteres"),
    name: z.string().min(3, "O nome deve ter no minimo 3 caracteres"),
    role: z.enum(UserRole, "O cargo deve ser: customer ou organizer"),
});
