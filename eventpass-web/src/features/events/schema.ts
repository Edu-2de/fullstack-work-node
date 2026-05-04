import { z } from "zod";

export const createEventSchema = z.object({
    title: z
        .string()
        .min(5, "O título deve ter no minimo 5 caracteres")
        .max(255),
    description: z
        .string()
        .min(5, "A descrição deve ter no minimo 5 caracteres")
        .max(255),
    start_date: z.string().min(1, "A data de início é obrigatória"),
    location: z.string().min(1, "O local é obrigatório").max(255),
    total_capacity: z.coerce
        .number()
        .int()
        .min(1, "A capacidade deve ser de pelo menos 1 pessoa"),
    price: z.coerce.number().min(0, "O preço não pode ser negativo"),
    categories: z
        .array(z.string())
        .min(1, "Selecione pelo menos uma categoria"),
});

export type CreateEventFormData = z.infer<typeof createEventSchema>;
