import z from "zod";
import { ValidationMessages } from "../constants/messages";

export const createEvent = z.object({
    title: z
        .string(ValidationMessages.REQUIRED)
        .min(5, ValidationMessages.MIN_LENGTH(5))
        .max(255, ValidationMessages.MAX_LENGTH(255))
        .trim()
        .toLowerCase(),
    description: z
        .string(ValidationMessages.REQUIRED)
        .min(5, ValidationMessages.MIN_LENGTH(5))
        .max(255, ValidationMessages.MAX_LENGTH(255)),
    start_date: z.coerce.date(ValidationMessages.REQUIRED),
    location: z
        .string(ValidationMessages.REQUIRED)
        .min(5, ValidationMessages.MIN_LENGTH(5))
        .max(255, ValidationMessages.MAX_LENGTH(255)),
    total_capacity: z.coerce.number(ValidationMessages.REQUIRED).int(),
    price: z.coerce.number(ValidationMessages.REQUIRED),
    categories: z
        .preprocess(
            (val) => (Array.isArray(val) ? val : [val]),
            z.array(z.string()),
        )
        .optional(),
});

export const findByIdEvent = z.object({
    id: z.uuid(ValidationMessages.INVALID_UUID),
});

export const updateEvent = createEvent.partial();

export const deleteEvent = z.object({
    id: z.uuid(ValidationMessages.INVALID_UUID),
});
