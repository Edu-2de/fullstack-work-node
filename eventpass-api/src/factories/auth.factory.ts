import { AuthController } from "../controllers/AuthController";
import { UserRepository } from "../repositories/user/user.repository";
import { AuthService } from "../services/auth/auth-service";

export class AuthModuleFactory {
    private static controllerInstance: AuthController;

    static getController(): AuthController {
        if (!this.controllerInstance) {
            const userRepository = new UserRepository();
            const userService = new AuthService(userRepository);

            this.controllerInstance = new AuthController(userService);
        }

        return this.controllerInstance;
    }
}
