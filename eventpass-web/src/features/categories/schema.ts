import { z } from "zod";

export const createCategorySchema = z.object({
    name: z
        .string()
        .min(5, "A categoria deve ter no minimo 5 caracteres")
        .max(255),
});
