import { UserController } from "../controllers/UserController";
import { UserService } from "../services/user/user-service";
import { RepositoryFactory } from "./repository.factory";

export class UserModuleFactory {
    private static controllerInstance: UserController;

    static getController(): UserController {
        if (!this.controllerInstance) {
            const userRepository = RepositoryFactory.getUserRepository();
            const eventRepository = RepositoryFactory.getEventRepository();
            const ticketRepository = RepositoryFactory.getTicketRepository();
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
