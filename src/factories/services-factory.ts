import { UserRepository } from "../repositories/user/user.repository";
import { UserService } from "../services/user-service";

export const userRepository = new UserRepository();
export const userService = new UserService(userRepository);
