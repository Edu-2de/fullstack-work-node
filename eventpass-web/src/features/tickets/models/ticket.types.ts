export interface Organizer {
    id: string;
    name: string;
}

export interface Category {
    id: string;
    name: string;
}

export interface Event {
    id: string;
    title: string;
    start_date: string;
    organizer: Organizer;
    categories: Category[];
}

export interface Customer {
    id: string;
    name: string;
}

export interface Ticket {
    id: string;
    events: Event;
    customer: Customer;
    purchase_date: string;
    status: "valid" | "cancelled" | "used";
    used_at: string;
}

export interface PaginatedTicketResponse {
    data: Ticket[];
    total_items: number;
    current_page: number;
    total_pages: number;
}
