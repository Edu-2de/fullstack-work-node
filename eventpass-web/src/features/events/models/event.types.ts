import { z } from "zod";
import type { createEventSchema, updateEventSchema } from "../schema";

export type EventFormData = z.infer<typeof createEventSchema>;
export type UpdateFormData = z.infer<typeof updateEventSchema>;

export interface Category {
    id: string;
    name: string;
}

export interface Organizer {
    id: string;
    name: string;
}

export interface Event {
    id: string;
    title: string;
    description: string;
    start_date: string;
    location: string;
    total_capacity: number;
    available_capacity: number;
    price: string | number;
    banner_url: string | null;
    status: "published" | "cancelled";
    organizer: Organizer;
    categories: Category[];
}

export interface PaginatedEventResponse {
    data: Event[];
    total_items: number;
    current_page: number;
    total_pages: number;
}
