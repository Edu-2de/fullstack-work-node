import { Router } from "express";
import { UserController } from "../controllers/UserController";
import { validateData } from "../middlewares/validateRequest";
import { createUserSchema } from "../validators/user.validator";

const userRoutes = Router();
const userController = new UserController();

userRoutes.post("/", validateData(createUserSchema), userController.create);

export { userRoutes };
