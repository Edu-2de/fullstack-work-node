import { Router } from "express";
import multer from "multer";
import { uploadConfig } from "../config/upload";
import { UserRole } from "../entities/user";
import { eventController } from "../factories/services-factory";
import { ensureAuthenticated } from "../middlewares/ensureAuthenticated";
import { ensureRole } from "../middlewares/ensureRole";
import { validateData } from "../middlewares/validateRequest";
import {
    createEvent,
    findByIdEvent,
    updateEvent,
} from "../validators/event-validator";

const eventRoutes = Router();

const upload = multer(uploadConfig);

//CREATE event
eventRoutes.post(
    "/",
    ensureAuthenticated,
    ensureRole([UserRole.ORGANIZER]),
    upload.single("banner"),
    validateData(createEvent),
    (req, res) => eventController.create(req, res),
);

//GET all events
eventRoutes.get("/", (req, res) => eventController.findAll(req, res));

//GET event by id
eventRoutes.get("/:id", validateData(findByIdEvent, "params"), (req, res) =>
    eventController.findById(req, res),
);

//UPDATE event
eventRoutes.put(
    "/:id",
    (req, res, next) => {
        console.log("PUT /events/:id atingido");
        next();
    },
    ensureAuthenticated,
    ensureRole([UserRole.ORGANIZER]),
    upload.single("banner"),
    validateData(updateEvent),
    (req, res) => eventController.update(req, res),
);

export { eventRoutes };
