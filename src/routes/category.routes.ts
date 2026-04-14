import { Router } from "express";
import { categoryController } from "../factories/services-factory";
import { validateData } from "../middlewares/validateRequest";
import {
    createCategory,
    deleteCategory,
    updateCategory,
} from "../validators/category.validator";

const categoryRoutes = Router();

//CREATE category
categoryRoutes.post("/", validateData(createCategory), (req, res) =>
    categoryController.create(req, res),
);

//GET all categories
categoryRoutes.get("/", (req, res) => categoryController.findAll(req, res));

//UPDATE category
categoryRoutes.put("/:id", validateData(updateCategory), (req, res) =>
    categoryController.update(req, res),
);

//DELETE category
categoryRoutes.delete(
    "/:id",
    validateData(deleteCategory, "params"),
    (req, res) => categoryController.delete(req, res),
);

export { categoryRoutes };
