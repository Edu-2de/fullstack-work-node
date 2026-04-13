import { Router } from "express";
import { CategoryController } from "../controllers/CategoryController";
import { validateData } from "../middlewares/validateRequest";
import { createCategory } from "../validators/category.validator";

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

export { categoryRoutes };
