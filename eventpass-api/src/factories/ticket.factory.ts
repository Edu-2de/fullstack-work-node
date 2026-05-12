import { TicketController } from "../controllers/TicketController";
import { TicketRepository } from "../repositories/ticket/ticket.repository";
import { TicketService } from "../services/ticket/ticket-service";

export class TicketModuleFactory {
    private static controllerInstance: TicketController;

    static getController(): TicketController {
        if (!this.controllerInstance) {
            const ticketRepository = new TicketRepository();
            const ticketService = new TicketService(ticketRepository);

            this.controllerInstance = new TicketController(ticketService);
        }

        return this.controllerInstance;
    }
}
