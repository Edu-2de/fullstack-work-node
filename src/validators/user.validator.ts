import { z } from "zod";
import { UserRole } from "../entities/user";

const userRole = z.enum(UserRole);

export const createUserSchema = z.object({
    email: z.email({ error: "Formato de e-mail inválido" }),
    password_encrypted: z
        .string()
        .min(6, { error: "A senha deve ter no minimo 6 caracteres" }),
    name: z
        .string()
        .min(3, { error: "O nome deve ter no minimo 3 caracteres" }),
    role: z.enum(UserRole, {
        error: "O cargo deve ser: customer ou organizer",
    }),
});

export const deleteUserSchema = z.object({
    id: z.string(),
});
