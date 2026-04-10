import { Request, Response } from "express";
import { userService } from "../factories/services-factory";

export class UserController {
    async create(req: Request, res: Response) {
        //Os dados ja estão validados pelo zod
        const { name, email, password_encrypted, role } = req.body;

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
        const userId = req.params.id as string;

        await userService.delete(userId);

        return res
            .status(200)
            .json({ message: "Usuário removido com sucesso!" });
    }
}
