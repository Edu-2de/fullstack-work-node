import { Router } from "express";
import { categoryRoutes } from "./category.routes";
import { userRoutes } from "./user.routes";

const router = Router();

router.use("/users", userRoutes);
router.use("/categories", categoryRoutes);

export { router };
