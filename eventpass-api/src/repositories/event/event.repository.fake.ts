import { Category } from "../../entities/category";
import { Event, EventStatus } from "../../entities/event";
import { IEventRepository } from "./IEventRepository";

export class FakeEventRepository implements IEventRepository {
    private events: Event[] = [];

    async create(
        organizer_id: string,
        categories: Category[],
        data: Partial<Event>,
    ): Promise<Event> {
        const event = new Event();

        Object.assign(event, {
            id: Math.random().toString(),
            status: EventStatus.PUBLISHED,
            ...data,
            organizer: { id: organizer_id },
            categories: categories ? categories : [],
        });

        this.events.push(event);
        return event;
    }

    async findById(id: string): Promise<Event | null> {
        const event = this.events.find((e) => e.id === id && !e.deleted_at);
        return event || null;
    }

    async findAll(
        page: number,
        limit: number,
        search?: string,
        categoryId?: string,
        startDate?: Date,
    ) {
        let filteredEvents = this.events;

        if (search) {
            filteredEvents = filteredEvents.filter((e) =>
                e.title
                    .toLocaleLowerCase()
                    .includes(search.toLocaleLowerCase()),
            );
        }

        if (categoryId) {
            filteredEvents = filteredEvents.filter((e) =>
                e.categories.some((category) => category.id === categoryId),
            );
        }

        if (startDate) {
            filteredEvents = filteredEvents.filter((e) => {
                const eventDate = new Date(e.start_date).getTime();
                const searchDate = new Date(startDate).getTime();
                return eventDate >= searchDate;
            });
        }

        const safePage = Math.max(1, Number(page));
        const safeLimit = Math.max(1, Number(limit));
        const skip = (safePage - 1) * safeLimit;

        const paginatedEvents = filteredEvents.slice(skip, skip + safeLimit);

        return {
            data: paginatedEvents,
            total_items: filteredEvents.length,
            current_page: safePage,
            total_pages: Math.ceil(filteredEvents.length / safeLimit),
        };
    }

    async findByCategoryId(categoryId: string): Promise<boolean> {
        return this.events.some(
            (e) =>
                !e.deleted_at && e.categories.some((c) => c.id === categoryId),
        );
    }

    async findByOrganizerId(organizerId: string): Promise<boolean> {
        return this.events.some(
            (e) =>
                !e.deleted_at &&
                e.organizer.id === organizerId &&
                e.status === EventStatus.PUBLISHED,
        );
    }

    async findAllByOrganizerId(
        organizerId: string,
        page: number,
        limit: number,
        search?: string,
    ) {
        let filteredEvents = this.events.filter(
            (e) => !e.deleted_at && e.organizer.id === organizerId,
        );

        if (search) {
            filteredEvents = filteredEvents.filter((e) =>
                e.title
                    .toLocaleLowerCase()
                    .includes(search.toLocaleLowerCase()),
            );
        }

        const safePage = Math.max(1, Number(page));
        const safeLimit = Math.max(1, Number(limit));
        const skip = (safePage - 1) * safeLimit;

        const paginatedEvents = filteredEvents.slice(skip, skip + safeLimit);

        return {
            data: paginatedEvents,
            total_items: filteredEvents.length,
            current_page: safePage,
            total_pages: Math.ceil(filteredEvents.length / safeLimit),
        };
    }

    async update(
        id: string,
        categories: Category[],
        data: Partial<Event>,
    ): Promise<Event | null> {
        const event = this.events.find((e) => e.id === id && !e.deleted_at);
        if (!event) return null;

        Object.assign(event, data);
        event.categories = categories;
        return event;
    }

    async delete(id: string): Promise<void> {
        const event = this.events.find((e) => e.id === id);
        if (event) {
            (event as any).deleted_at = new Date();
        }
    }
}
