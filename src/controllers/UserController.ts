import { Request, Response } from "express";
import { ValidMessages } from "../constants/messages";
import { UserRole } from "../entities/user";
import { UserService } from "../services/user-service";

//ZOD already validates the request data
export class UserController {
    constructor(private userService: UserService) {}

    async create(req: Request, res: Response) {
        const { name, email, password_encrypted } = req.body;
        const role = UserRole.CUSTOMER;
        const user = await this.userService.create({
            name,
            email,
            password_encrypted,
            role: role,
        });
        const { id, ...restOfUser } = user;

        return res.status(201).json({
            id: id,
            ...restOfUser,
        });
    }

    async createAdmin(req: Request, res: Response) {
        const { name, email, password_encrypted, role } = req.body;
        const user = await this.userService.create({
            name,
            email,
            password_encrypted,
            role,
        });
        const { id, ...restOfUser } = user;
        return res.status(201).json({
            id: id,
            ...restOfUser,
        });
    }

    async findProfile(req: Request, res: Response) {
        const userId = req.user.id;
        const user = await this.userService.findById(userId);
        return res.status(200).json(user);
    }

    async findById(req: Request, res: Response) {
        const userId = req.params.id as string;
        const user = await this.userService.findById(userId);
        return res.status(200).json(user);
    }

    async findAll(req: Request, res: Response) {
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;
        const search = req.query.search as string;

        const users = await this.userService.findAll(page, limit, search);
        return res.status(200).json(users);
    }

    async updateProfile(req: Request, res: Response) {
        const userId = req.user.id;
        const data = req.body;
        const updateUser = await this.userService.updateProfile(userId, data);
        return res.status(200).json(updateUser);
    }

    async update(req: Request, res: Response) {
        const userId = req.params.id as string;
        const data = req.body;
        const updateUser = await this.userService.update(userId, data);
        return res.status(200).json(updateUser);
    }

    async deleteProfile(req: Request, res: Response) {
        const userId = req.user.id;
        await this.userService.delete(userId);
        return res.status(200).json(ValidMessages.DELETED("Usuário"));
    }

    async delete(req: Request, res: Response) {
        const userId = req.params.id as string;
        await this.userService.delete(userId);
        return res.status(200).json(ValidMessages.DELETED("Usuário"));
    }

    async findTickets(req: Request, res: Response) {
        const userId = req.user.id;
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;

        const tickets = await this.userService.findTickets(userId, page, limit);
        return res.status(200).json(tickets);
    }
}
