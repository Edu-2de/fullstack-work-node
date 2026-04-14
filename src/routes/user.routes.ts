import { Router } from "express";
import { userController } from "../factories/services-factory";
import { validateData } from "../middlewares/validateRequest";
import {
    createUserSchema,
    deleteUserSchema,
    findUserByIdSchema,
    updateUserSchema,
} from "../validators/user.validator";

const userRoutes = Router();

//CREATE user
userRoutes.post("/", validateData(createUserSchema), (req, res) =>
    userController.create(req, res),
);

//GET user BY ID
userRoutes.get("/:id", validateData(findUserByIdSchema, "params"), (req, res) =>
    userController.findById(req, res),
);

//GET ALL users
userRoutes.get("/", (req, res) => userController.findAll(req, res));

//UPDATE user
userRoutes.put("/:id", validateData(updateUserSchema, "body"), (req, res) =>
    userController.update(req, res),
);

//DELETE user
userRoutes.delete(
    "/:id",
    validateData(deleteUserSchema, "params"),
    (req, res) => userController.delete(req, res),
);

export { userRoutes };
