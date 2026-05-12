import { EventController } from "../controllers/EventController";
import { CategoryRepository } from "../repositories/category/category.repository";
import { EventRepository } from "../repositories/event/event.repository";
import { TicketRepository } from "../repositories/ticket/ticket.repository";
import { EventService } from "../services/event/event-service";

export class EventModuleFactory {
    private static controllerInstance: EventController;

    static getController(): EventController {
        if (!this.controllerInstance) {
            const eventRepository = new EventRepository();
            const categoryRepository = new CategoryRepository();
            const ticketRepository = new TicketRepository();

            const eventService = new EventService(
                eventRepository,
                categoryRepository,
                ticketRepository,
            );

            this.controllerInstance = new EventController(eventService);
        }

        return this.controllerInstance;
    }
}
