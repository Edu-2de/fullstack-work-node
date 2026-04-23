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
        const event = this.events.find((e) => e.id === id);
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

        const skip = (page - 1) * limit;

        const paginatedEvents = filteredEvents.slice(skip, skip + limit);

        return {
            data: paginatedEvents,
            total_items: filteredEvents.length,
            current_page: page,
            total_pages: Math.ceil(filteredEvents.length / limit),
        };
    }

    async findByCategoryId(categoryId: string): Promise<boolean> {
        return this.events.some((e) => {
            e.categories.some((c) => c.id === categoryId);
        });
    }

    async findByOrganizerId(organizerId: string): Promise<boolean> {
        return this.events.some((e) => e.organizer.id === organizerId);
    }

    async update(
        id: string,
        categories: Category[],
        data: Partial<Event>,
    ): Promise<Event | null> {
        const event = this.events.find((e) => e.id === id);
        if (!event) {
            return null;
        }
        Object.assign(event, data);
        event.categories = categories;
        return event;
    }

    async delete(id: string): Promise<void> {
        const index = this.events.findIndex((e) => e.id === id);
        if (index !== -1) {
            this.events.splice(index, 1);
        }
    }
}
