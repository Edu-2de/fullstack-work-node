import { Router } from "express";
import { UserRole } from "../entities/user";
import { categoryController } from "../factories/services-factory";
import { ensureAuthenticated } from "../middlewares/ensureAuthenticated";
import { ensureRole } from "../middlewares/ensureRole";
import { validateData } from "../middlewares/validateRequest";
import {
    createCategory,
    updateCategory,
} from "../validators/category.validator";
import { idParamSchema } from "../validators/common.validator";

const categoryRoutes = Router();

//CREATE category
categoryRoutes.post(
    "/",
    ensureAuthenticated,
    ensureRole([UserRole.ADMIN]),
    validateData(createCategory),
    (req, res) => categoryController.create(req, res),
);

//GET all categories
categoryRoutes.get("/", (req, res) => categoryController.findAll(req, res));

//UPDATE category
categoryRoutes.put(
    "/:id",
    ensureAuthenticated,
    ensureRole([UserRole.ADMIN]),
    validateData(idParamSchema, "params"),
    validateData(updateCategory),
    (req, res) => categoryController.update(req, res),
);

//DELETE category
categoryRoutes.delete(
    "/:id",
    ensureAuthenticated,
    ensureRole([UserRole.ADMIN]),
    validateData(idParamSchema, "params"),
    (req, res) => categoryController.delete(req, res),
);

export { categoryRoutes };
