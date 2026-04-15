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
        console.log("🟡 [1] Log middleware atingido");
        next();
    },
    (req, res, next) => {
        console.log("🟡 [2] Antes de ensureAuthenticated");
        next();
    },
    ensureAuthenticated,
    (req, res, next) => {
        console.log(
            "🟡 [3] Depois de ensureAuthenticated, antes de ensureRole",
        );
        next();
    },
    ensureRole([UserRole.ORGANIZER]),
    (req, res, next) => {
        console.log("🟡 [4] Depois de ensureRole, antes de multer");
        next();
    },
    upload.single("banner"),
    (req, res, next) => {
        console.log("🟡 [5] Depois de multer, antes de validateData");
        next();
    },
    validateData(updateEvent),
    (req, res, next) => {
        console.log("🟡 [6] Depois de validateData, antes do handler");
        next();
    },
    (req, res) => {
        console.log("🟡 [7] HANDLER ATINGIDO!");
        eventController.update(req, res);
    },
);

export { eventRoutes };
