import { Router } from "express";
import { UserController } from "../controllers/UserController";
import { validateData } from "../middlewares/validateRequest";
import {
    createUserSchema,
    deleteUserSchema,
} from "../validators/user.validator";

const userRoutes = Router();
const userController = new UserController();

userRoutes.post("/", validateData(createUserSchema), userController.create);
userRoutes.post("/:id", validateData(deleteUserSchema), userController.delete);

export { userRoutes };
