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
        //It was necessary to remove the password in the create function ( select: false doesn't work here).
        const { password_encrypted, ...userWithoutPassword } = user;
        return userWithoutPassword;
    }

    async findByEmail(email: string) {
        const user = await this.userRepository.findByEmail(email);
        if (!user) {
            throw new AppError(
                "Usuário com esse e-mail não foi encontrado",
                404,
            );
        }
        return user;
    }

    async findById(id: string) {
        const user = await this.userRepository.findById(id);
        if (!user) {
            throw new AppError("Usuário com esse id não foi encontrado", 404);
        }
        return user;
    }

    async findAll() {
        const users = await this.userRepository.findAll();
        return users;
    }

    async update(id: string, data: Partial<User>) {
        const user = await this.userRepository.findById(id);
        if (!user) {
            throw new AppError("Usuário com esse id não foi encontrado", 404);
        }

        if (data.password_encrypted) {
            data.password_encrypted = await bcrypt.hash(
                data.password_encrypted!,
                10,
            );
        }

        const updateUser = await this.userRepository.update(id, data);
        return updateUser;
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
