import { z } from "zod";
import { ValidationMessages } from "../constants/messages";
import { UserRole } from "../entities/user";

export const createUserSchema = z.object({
    name: z
        .string(ValidationMessages.REQUIRED)
        .min(3, ValidationMessages.MIN_LENGTH(3))
        .max(255, ValidationMessages.MAX_LENGTH(255)),
    email: z.email({
        error: (issue) =>
            issue.input === undefined
                ? ValidationMessages.REQUIRED
                : ValidationMessages.INVALID_EMAIL,
    }),
    password_encrypted: z
        .string(ValidationMessages.REQUIRED)
        .min(6, ValidationMessages.MIN_LENGTH(6))
        .max(255, ValidationMessages.MAX_LENGTH(255)),

    role: z.enum(UserRole, {
        error: (issue) =>
            issue.input === undefined
                ? ValidationMessages.REQUIRED
                : ValidationMessages.INVALID_ROLE,
    }),
});

export const findUserByIdSchema = z.object({
    id: z.uuid(ValidationMessages.INVALID_UUID),
});

//PARTIAL(): It takes the fields from the create event and adds an optional() at the end.
export const updateUserSchema = createUserSchema
    .partial()
    .refine(
        (data) => Object.keys(data).length > 0,
        ValidationMessages.EMPTY_REQUEST,
    );

export const deleteUserSchema = z.object({
    id: z.uuid(ValidationMessages.INVALID_UUID),
});
