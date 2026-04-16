import { Router } from "express";
import { authRoutes } from "./auth.routes";
import { categoryRoutes } from "./category.routes";
import { eventRoutes } from "./event.routes";
import { ticketRoutes } from "./ticket.route";
import { userRoutes } from "./user.routes";

const router = Router();

router.use("/users", userRoutes);
router.use("/categories", categoryRoutes);
router.use("/events", eventRoutes);
router.use("/login", authRoutes);
router.use("/tickets", ticketRoutes);

export { router };
