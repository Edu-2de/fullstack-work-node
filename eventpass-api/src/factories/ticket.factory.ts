import { TicketController } from "../controllers/TicketController";
import { TicketService } from "../services/ticket/ticket-service";
import { RepositoryFactory } from "./repository.factory";

export class TicketModuleFactory {
    private static controllerInstance: TicketController;

    static getController(): TicketController {
        if (!this.controllerInstance) {
            const ticketRepository = RepositoryFactory.getTicketRepository();
            const ticketService = new TicketService(ticketRepository);

            this.controllerInstance = new TicketController(ticketService);
        }

        return this.controllerInstance;
    }
}
