import { Request, Response } from "express";
import { UserRepository } from "../repositories/user/user.repository";
import { UserService } from "../services/user-service";

export class UserController {
    async create(req: Request, res: Response) {
        //Os dados ja estão validados pelo zod
        const { name, email, password_encrypted, role } = req.body;

        const userRepository = new UserRepository();
        const userService = new UserService(userRepository);

        const user = await userService.create({
            name,
            email,
            password_encrypted,
            role,
        });

        //Tira a senha do json, para mais segurança
        Reflect.deleteProperty(user, "password_encrypted");

        return res.status(201).json(user);
    }

    async delete(req: Request, res: Response) {
        const userId = req.params.id;

        const userRepository = new UserRepository();
        const userService = new UserService(userRepository);

        await userService.delete(userId);

        return res
            .status(200)
            .json({ message: "Usuário removido com sucesso!" });
    }
}
