import { User } from "../entities/user";
import { AppError, HttpStatus } from "../errors/AppError";
import { UserRepository } from "../repositories/user/user.repository";

export class UserService {
    constructor(private userRepository: UserRepository) {}

    async executeCreation(data: Partial<User>) {
        const userExists = await this.userRepository.findByEmail(data.email!);

        if (userExists) {
            throw new AppError(
                "Este email já está em uso!",
                HttpStatus.BAD_REQUEST,
            );
        }
    }
}
