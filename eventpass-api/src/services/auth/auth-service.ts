import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { AppError, HttpStatus } from "../../errors/AppError";
import { IUserRepository } from "../../repositories/user/IUserRepository";

export class AuthService {
    constructor(private userRepository: IUserRepository) {}

    async login(email: string, password: string) {
        const user = await this.userRepository.findByEmailForLogin(email);
        if (!user) {
            throw new AppError("Erro de credenciais", HttpStatus.UNAUTHORIZED, [
                { field: "email", message: "Este e-mail não está cadastrado" },
            ]);
        }
        const correctPassword = await bcrypt.compare(
            password,
            user.password_encrypted,
        );
        if (!correctPassword) {
            throw new AppError("Erro de credenciais", HttpStatus.UNAUTHORIZED, [
                { field: "password", message: "A senha está incorreta" },
            ]);
        }

        const secret = process.env.JWT_SECRET;
        if (!secret) {
            throw new AppError(
                "JWT_SECRET não está definido nas variáveis de ambiente!",
                HttpStatus.FORBIDDEN,
            );
        }

        const token = jwt.sign({ role: user.role }, secret, {
            subject: user.id,
            expiresIn: "1d",
        });

        return {
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
            },
            token,
        };
    }
}
