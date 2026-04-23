import { Router } from "express";
import { UserRole } from "../entities/user";
import { userController } from "../factories/services-factory";
import { ensureAuthenticated } from "../middlewares/ensureAuthenticated";
import { ensureRole } from "../middlewares/ensureRole";
import { validateData } from "../middlewares/validateRequest";
import { idParamSchema } from "../validators/common.validator";
import {
    createUserAdminSchema,
    createUserSchema,
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
    ensureRole([UserRole.ADMIN]),
    validateData(createUserAdminSchema),
    (req, res) => userController.createAdmin(req, res),
);

//GET logged-in user
userRoutes.get("/profile", ensureAuthenticated, (req, res) =>
    userController.findProfile(req, res),
);

//GET user BY ID
userRoutes.get(
    "/:id",
    ensureAuthenticated,
    ensureRole([UserRole.ADMIN]),
    validateData(idParamSchema, "params"),
    (req, res) => userController.findById(req, res),
);

//GET ALL users
userRoutes.get(
    "/",
    ensureAuthenticated,
    ensureRole([UserRole.ADMIN]),
    (req, res) => userController.findAll(req, res),
);

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
    ensureRole([UserRole.ADMIN]),
    validateData(updateUserSchema, "body"),
    (req, res) => userController.update(req, res),
);

//DELETE logged-in user
userRoutes.delete("/profile", ensureAuthenticated, (req, res) =>
    userController.deleteProfile(req, res),
);

//DELETE user
userRoutes.delete(
    "/:id",
    ensureAuthenticated,
    ensureRole([UserRole.ADMIN]),
    validateData(idParamSchema, "params"),
    (req, res) => userController.delete(req, res),
);

//GET logged-in user tickets
userRoutes.get("/profile/tickets", ensureAuthenticated, (req, res) =>
    userController.findTickets(req, res),
);

export { userRoutes };
