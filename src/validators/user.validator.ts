import { z } from "zod";
import { UserRole } from "../entities/user";

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

export const findUserByEmailSchema = z.object({
    email: z.email({ error: "Formato de e-mail inválido" }),
});

export const findUserByIdSchema = z.object({
    id: z.uuid().min(1, { error: "Id inválido" }),
});

//PARTIAL(): It takes the fields from the create event and adds an optional() at the end.
export const updateUserSchema = createUserSchema.partial();

export const deleteUserSchema = z.object({
    id: z.uuid().min(1, { error: "Id inválido" }),
});
