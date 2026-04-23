import { Router } from "express";
import multer from "multer";
import { uploadConfig } from "../config/upload";
import { UserRole } from "../entities/user";
import { eventController } from "../factories/services-factory";
import { ensureAuthenticated } from "../middlewares/ensureAuthenticated";
import { ensureRole } from "../middlewares/ensureRole";
import { validateData } from "../middlewares/validateRequest";
import { idParamSchema } from "../validators/common.validator";
import { createEvent, updateEvent } from "../validators/event.validator";

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
eventRoutes.get("/", async (req, res) => eventController.findAll(req, res));

//GET event by id
eventRoutes.get("/:id", validateData(idParamSchema, "params"), (req, res) =>
    eventController.findById(req, res),
);

//UPDATE event
eventRoutes.put(
    "/:id",
    ensureAuthenticated,
    ensureRole([UserRole.ORGANIZER, UserRole.ADMIN]),
    upload.single("banner"),
    validateData(updateEvent),
    (req, res) => eventController.update(req, res),
);

// CANCEL event
eventRoutes.patch(
    "/:id/cancel",
    ensureAuthenticated,
    ensureRole([UserRole.ORGANIZER, UserRole.ADMIN]),
    validateData(idParamSchema, "params"),
    (req, res) => eventController.cancel(req, res),
);

//DELETE event
eventRoutes.delete(
    "/:id",
    ensureAuthenticated,
    ensureRole([UserRole.ORGANIZER, UserRole.ADMIN]),
    validateData(idParamSchema, "params"),
    (req, res) => eventController.delete(req, res),
);

//GET all tickets of event
eventRoutes.get(
    "/:id/tickets",
    ensureAuthenticated,
    ensureRole([UserRole.ORGANIZER, UserRole.ADMIN]),
    (req, res) => eventController.findTickets(req, res),
);

export { eventRoutes };
