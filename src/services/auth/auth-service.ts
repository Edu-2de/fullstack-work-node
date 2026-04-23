import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { AppError, HttpStatus } from "../../errors/AppError";
import { IUserRepository } from "../../repositories/user/IUserRepository";

export class AuthService {
    constructor(private userRepository: IUserRepository) {}

    async login(email: string, password: string) {
        const user = await this.userRepository.findByEmailForLogin(email);
        if (!user) {
            throw new AppError("Email errado", HttpStatus.UNAUTHORIZED);
        }
        const correctPassword = await bcrypt.compare(
            password,
            user.password_encrypted,
        );
        if (!correctPassword) {
            throw new AppError("Senha Errada", HttpStatus.UNAUTHORIZED);
        }

        const token = jwt.sign(
            { role: user.role },
            process.env.JWT_SECRET || "default_dev_secret",
            {
                subject: user.id,
                expiresIn: "1d",
            },
        );

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
