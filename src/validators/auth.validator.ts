import z from "zod";
import { ValidationMessages } from "../constants/messages";

export const login = z.object({
    email: z.email({
        error: (issue) =>
            issue.input === undefined
                ? ValidationMessages.REQUIRED
                : ValidationMessages.INVALID_EMAIL,
    }),
    password: z
        .string(ValidationMessages.REQUIRED)
        .min(6, ValidationMessages.MIN_LENGTH(6))
        .max(255, ValidationMessages.MAX_LENGTH(255)),
});
