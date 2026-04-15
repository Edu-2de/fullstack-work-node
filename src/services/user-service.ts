import bcrypt from "bcrypt";
import { ErrorMessages } from "../constants/messages";
import { User } from "../entities/user";
import { AppError, HttpStatus } from "../errors/AppError";
import { UserRepository } from "../repositories/user/user.repository";

export class UserService {
    constructor(private userRepository: UserRepository) {}

    async create(data: Partial<User>) {
        const userExists = await this.userRepository.findByEmail(data.email!);
        if (userExists) {
            throw new AppError(
                ErrorMessages.ALREADY_EXISTS("email"),
                HttpStatus.BAD_REQUEST,
            );
        }
        data.password_encrypted = await bcrypt.hash(
            data.password_encrypted!,
            10,
        );
        const user = await this.userRepository.create(data);
        //It was necessary to remove the password in the create function ( "select: false" doesn't work here).
        const { password_encrypted, ...userWithoutPassword } = user;
        return userWithoutPassword;
    }

    async findById(id: string) {
        const user = await this.userRepository.findById(id);
        if (!user) {
            throw new AppError(
                ErrorMessages.NOT_FOUND("Usuário"),
                HttpStatus.NOT_FOUND,
            );
        }
        return user;
    }

    async findAll() {
        return await this.userRepository.findAll();
    }

    async update(id: string, data: Partial<User>) {
        const user = await this.userRepository.findById(id);
        if (!user) {
            throw new AppError(
                ErrorMessages.NOT_FOUND("Usuário"),
                HttpStatus.NOT_FOUND,
            );
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

    async updateProfile(id: string, data: Partial<User>) {
        if (data.password_encrypted) {
            data.password_encrypted = await bcrypt.hash(
                data.password_encrypted!,
                10,
            );
        }

        const updatedUser = await this.userRepository.update(id, data);

        if (!updatedUser) {
            throw new AppError(
                ErrorMessages.NOT_FOUND("Usuário"),
                HttpStatus.NOT_FOUND,
            );
        }
        return updatedUser;
    }

    async delete(id: string) {
        const userExists = await this.userRepository.findById(id);

        if (!userExists) {
            throw new AppError(
                ErrorMessages.NOT_FOUND("Usuário"),
                HttpStatus.NOT_FOUND,
            );
        }
        await this.userRepository.delete(id);
    }
}
