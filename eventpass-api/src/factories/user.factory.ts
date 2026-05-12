import { UserController } from "../controllers/UserController";
import { EventRepository } from "../repositories/event/event.repository";
import { TicketRepository } from "../repositories/ticket/ticket.repository";
import { UserRepository } from "../repositories/user/user.repository";
import { UserService } from "../services/user/user-service";

export class UserModuleFactory {
    private static controllerInstance: UserController;

    static getController(): UserController {
        if (!this.controllerInstance) {
            const userRepository = new UserRepository();
            const eventRepository = new EventRepository();
            const ticketRepository = new TicketRepository();
            const userService = new UserService(
                userRepository,
                eventRepository,
                ticketRepository,
            );

            this.controllerInstance = new UserController(userService);
        }

        return this.controllerInstance;
    }
}
