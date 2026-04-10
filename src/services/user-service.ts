import bcrypt from "bcrypt";
import { User } from "../entities/user";
import { AppError, HttpStatus } from "../errors/AppError";
import { UserRepository } from "../repositories/user/user.repository";

export class UserService {
    constructor(private userRepository: UserRepository) {}

    async create(data: Partial<User>) {
        const userExists = await this.userRepository.findByEmail(data.email!);

        if (userExists) {
            throw new AppError(
                "Este email já está em uso!",
                HttpStatus.BAD_REQUEST,
            );
        }

        data.password_encrypted = await bcrypt.hash(
            data.password_encrypted!,
            10,
        );

        const user = await this.userRepository.create(data);

        return user;
    }

    async delete(id: string) {
        const userExists = await this.userRepository.findById(id);

        if (!userExists) {
            throw new AppError(
                "Esse id nao pertence a nenhum usuário",
                HttpStatus.NOT_FOUND,
            );
        }

        await this.userRepository.delete(id);
    }
}
