import { Router } from "express";
import { UserRole } from "../entities/user";
import { userController } from "../factories/services-factory";
import { ensureAuthenticated } from "../middlewares/ensureAuthenticated";
import { ensureRole } from "../middlewares/ensureRole";
import { validateData } from "../middlewares/validateRequest";
import {
    createUserAdminSchema,
    createUserSchema,
    deleteUserSchema,
    findUserByIdSchema,
    updateProfileSchema,
    updateUserSchema,
} from "../validators/user.validator";

const userRoutes = Router();

//CREATE user
userRoutes.post("/register", validateData(createUserSchema), (req, res) =>
    userController.create(req, res),
);

//CREATE user by admin
userRoutes.post(
    "/",
    ensureAuthenticated,
    ensureRole([UserRole.ORGANIZER]),
    validateData(createUserAdminSchema),
    (req, res) => userController.createAdmin(req, res),
);

//GET user BY ID
userRoutes.get("/:id", validateData(findUserByIdSchema, "params"), (req, res) =>
    userController.findById(req, res),
);

//GET ALL users
userRoutes.get("/", (req, res) => userController.findAll(req, res));

//UPDATE logged-in user
userRoutes.put(
    "/profile",
    ensureAuthenticated,
    validateData(updateProfileSchema, "body"),
    (req, res) => userController.updateProfile(req, res),
);

//UPDATE user
userRoutes.put(
    "/:id",
    ensureAuthenticated,
    ensureRole([UserRole.ORGANIZER]),
    validateData(updateUserSchema, "body"),
    (req, res) => userController.update(req, res),
);

//DELETE user
userRoutes.delete(
    "/:id",
    validateData(deleteUserSchema, "params"),
    (req, res) => userController.delete(req, res),
);

export { userRoutes };
