import { Router } from "express";
import { authController } from "../factories/services-factory";
import { validateData } from "../middlewares/validateRequest";
import { login } from "../validators/auth.validator";

const authRoutes = Router();

authRoutes.post("/", validateData(login), (req, res) =>
    authController.login(req, res),
);

export { authRoutes };
