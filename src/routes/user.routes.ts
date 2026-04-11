import { Router } from "express";
import { UserController } from "../controllers/UserController";
import { validateData } from "../middlewares/validateRequest";
import {
    createUserSchema,
    deleteUserSchema,
    findUserByEmailSchema,
    findUserByIdSchema,
    updateUserSchema,
} from "../validators/user.validator";

const userRoutes = Router();
const userController = new UserController();

//CREATE user
userRoutes.post("/", validateData(createUserSchema), userController.create);

//GET user BY EMAIL
userRoutes.get(
    "/email/:email",
    validateData(findUserByEmailSchema, "params"),
    userController.findByEmail,
);

//GET user BY ID
userRoutes.get(
    "/:id",
    validateData(findUserByIdSchema, "params"),
    userController.findById,
);

//GET ALL users
userRoutes.get("/", userController.findAll);

//UPDATE user
userRoutes.put(
    "/:id",
    validateData(updateUserSchema, "body"),
    userController.update,
);

//DELETE user
userRoutes.delete(
    "/:id",
    validateData(deleteUserSchema, "params"),
    userController.delete,
);

export { userRoutes };
