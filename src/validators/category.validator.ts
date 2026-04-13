import z from "zod";
import { ValidationMessages } from "../constants/messages";

export const createCategory = z.object({
    name: z
        .string()
        .min(1, ValidationMessages.MIN_LENGTH(1))
        .max(255, ValidationMessages.MAX_LENGTH(255))
        .trim() //REMOVE starting and ending spaces
        .toLowerCase(),
});
