import { Router } from "express";
import { CategoryController } from "../controllers/CategoryController";
import { validateData } from "../middlewares/validateRequest";
import {
    createCategory,
    deleteCategory,
} from "../validators/category.validator";

const categoryRoutes = Router();
const categoryController = new CategoryController();

//CREATE category
categoryRoutes.post(
    "/",
    validateData(createCategory),
    categoryController.create,
);

//GET all categories
categoryRoutes.get("/", categoryController.findAll);

//DELETE category
categoryRoutes.delete(
    "/:id",
    validateData(deleteCategory),
    categoryController.delete,
);

export { categoryRoutes };
