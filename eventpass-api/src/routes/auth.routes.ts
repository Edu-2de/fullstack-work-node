import { Router } from "express";
import { AuthModuleFactory } from "../factories/auth.factory";
import { validateData } from "../middlewares/validateRequest";
import { login } from "../validators/auth.validator";

const authRoutes = Router();
const authController = AuthModuleFactory.getController();

authRoutes.post("/", validateData(login), (req, res) =>
    authController.login(req, res),
);

export { authRoutes };
