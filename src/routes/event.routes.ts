import { Router } from "express";
import multer from "multer";
import { uploadConfig } from "../config/upload";
import { eventController } from "../factories/services-factory";
import { validateData } from "../middlewares/validateRequest";
import { createEvent, findByIdEvent } from "../validators/event-validator";

const eventRoutes = Router();

const upload = multer(uploadConfig);

//CREATE event
eventRoutes.post(
    "/",
    upload.single("banner"),
    validateData(createEvent),
    (req, res) => eventController.create(req, res),
);

//GET event by id
eventRoutes.get("/:id", validateData(findByIdEvent, "params"), (req, res) =>
    eventController.findById(req, res),
);

//GET all events
eventRoutes.get("/", (req, res) => eventController.findAll(req, res));

export { eventRoutes };
