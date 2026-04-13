import { Router } from "express";
import multer from "multer";
import { uploadConfig } from "../config/upload";
import { EventController } from "../controllers/EventController";
import { validateData } from "../middlewares/validateRequest";
import { createEvent } from "../validators/event-validator";

const eventRoutes = Router();
const eventController = new EventController();

const upload = multer(uploadConfig);

eventRoutes.post(
    "/",
    upload.single("banner"),
    validateData(createEvent),
    eventController.create,
);

export { eventRoutes };
