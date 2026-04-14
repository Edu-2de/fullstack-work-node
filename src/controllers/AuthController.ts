import { Request, Response } from "express";
import { AuthService } from "../services/auth-service";

export class AuthController {
    constructor(private authService: AuthService) {}

    async login(req: Request, res: Response) {
        const { email, password } = req.body;
        const loginUser = await this.authService.login(email, password);
        return res.status(201).json(loginUser);
    }
}
