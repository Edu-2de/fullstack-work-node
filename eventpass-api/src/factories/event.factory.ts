import { EventController } from "../controllers/EventController";
import { EventService } from "../services/event/event-service";
import { RepositoryFactory } from "./repository.factory";

export class EventModuleFactory {
    private static controllerInstance: EventController;

    static getController(): EventController {
        if (!this.controllerInstance) {
            const eventRepository = RepositoryFactory.getEventRepository();
            const categoryRepository =
                RepositoryFactory.getCategoryRepository();
            const ticketRepository = RepositoryFactory.getTicketRepository();

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
