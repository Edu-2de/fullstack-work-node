import { Request, Response } from "express";
import { ValidMessages } from "../constants/messages";
import { userService } from "../factories/services-factory";

//ZOD already validates the request data
export class UserController {
    async create(req: Request, res: Response) {
        const { name, email, password_encrypted, role } = req.body;
        const user = await userService.create({
            name,
            email,
            password_encrypted,
            role,
        });
        return res.status(201).json(user);
    }

    async findById(req: Request, res: Response) {
        const userId = req.params.id as string;
        const user = await userService.findById(userId);
        return res.status(200).json(user);
    }

    async findAll(req: Request, res: Response) {
        const users = await userService.findAll();
        return res.status(200).json(users);
    }

    async update(req: Request, res: Response) {
        const userId = req.params.id as string;
        const data = req.body;
        const updateUser = await userService.update(userId, data);
        return res.status(200).json(updateUser);
    }

    async delete(req: Request, res: Response) {
        const userId = req.params.id as string;
        await userService.delete(userId);
        return res.status(200).json(ValidMessages.DELETED("Usuário"));
    }
}
