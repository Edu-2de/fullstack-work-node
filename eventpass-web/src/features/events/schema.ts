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
    start_date: z
        .string()
        .min(1, "A data de início é obrigatória")
        .refine((dateString) => {
            return new Date(dateString) > new Date();
        }, "A data do evento não pode estar no passado"),
    location: z.string().min(1, "O local é obrigatório").max(255),
    total_capacity: z
        .number("Insira uma capacidade válida")
        .int("A capacidade deve ter um valor inteiro")
        .min(1, "A capacidade deve ser de pelo menos 1 pessoa"),

    price: z
        .number("Insira um preço válido")
        .min(0, "O preço não pode ser negativo"),
    categories: z
        .array(z.string())
        .min(1, "Selecione pelo menos uma categoria"),
});

export const updateEvent = createEventSchema.partial();

export type CreateEventFormData = z.infer<typeof createEventSchema>;
export type UpdateEventFormData = z.infer<typeof updateEvent>;
