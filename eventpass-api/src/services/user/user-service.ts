import bcrypt from "bcrypt";
import { ErrorMessages } from "../../constants/messages";
import { User, UserRole } from "../../entities/user";
import { AppError, HttpStatus } from "../../errors/AppError";
import { IEventRepository } from "../../repositories/event/IEventRepository";
import { ITicketRepository } from "../../repositories/ticket/ITicketRepository";
import { IUserRepository } from "../../repositories/user/IUserRepository";

export class UserService {
    constructor(
        private userRepository: IUserRepository,
        private eventRepository: IEventRepository,
        private ticketRepository: ITicketRepository,
    ) {}

    private async findUserOrThrow(id: string) {
        const user = await this.userRepository.findById(id);
        if (!user) {
            throw new AppError(
                ErrorMessages.NOT_FOUND("Usuário"),
                HttpStatus.NOT_FOUND,
            );
        }
        return user;
    }

    private async ensureEmailIsUnique(email?: string, currentUserId?: string) {
        if (!email) return;
        const userWithEmail = await this.userRepository.findByEmail(email);
        if (userWithEmail && userWithEmail.id !== currentUserId) {
            throw new AppError(
                ErrorMessages.ALREADY_EXISTS("Email"),
                HttpStatus.CONFLICT,
            );
        }
    }

    private async hashPasswordIfNeeded(data: Partial<User>) {
        if (data.password_encrypted) {
            data.password_encrypted = await bcrypt.hash(
                data.password_encrypted,
                10,
            );
        }
    }

    async create(data: Partial<User>) {
        await this.ensureEmailIsUnique(data.email);
        await this.hashPasswordIfNeeded(data);
        const user = await this.userRepository.create(data);
        //It was necessary to remove the password in the create function ( "select: false" doesn't work here).
        const { password_encrypted, ...userWithoutPassword } = user;
        return userWithoutPassword;
    }

    async findById(id: string) {
        return await this.findUserOrThrow(id);
    }

    async findAll(page: number, limit: number, search?: string) {
        return await this.userRepository.findAll(page, limit, search);
    }

    async update(id: string, data: Partial<User>) {
        await this.findUserOrThrow(id);
        await this.ensureEmailIsUnique(data.email, id);
        await this.hashPasswordIfNeeded(data);

        const updateUser = await this.userRepository.update(id, data);
        return updateUser;
    }

    async updateProfile(id: string, data: Partial<User>) {
        await this.ensureEmailIsUnique(data.email, id);
        await this.hashPasswordIfNeeded(data);

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
        const user = await this.findUserOrThrow(id);

        if (user.role === UserRole.ORGANIZER) {
            const hasActiveEvents =
                await this.eventRepository.findByOrganizerId(id);

            if (hasActiveEvents) {
                throw new AppError(
                    "Você possui eventos ativos (Publicados). Por favor, cancele todos os seus eventos antes de excluir a sua conta.",
                    HttpStatus.CONFLICT,
                );
            }
        }

        await this.userRepository.delete(id);
    }

    async findTickets(id: string, page: number, limit: number) {
        return await this.ticketRepository.findByUserId(id, page, limit);
    }
}
