import { Router } from "express";
import { UserRole } from "../entities/user";
import { ticketController } from "../factories/services-factory";
import { ensureAuthenticated } from "../middlewares/ensureAuthenticated";
import { ensureRole } from "../middlewares/ensureRole";
import { validateData } from "../middlewares/validateRequest";
import { createTicket, getTicketById } from "../validators/ticket.validator";

const ticketRoutes = Router();

//CREATE ticket
ticketRoutes.post(
    "/:id",
    ensureAuthenticated,
    validateData(createTicket, "params"),
    (req, res) => ticketController.create(req, res),
);

//GET ticket by id
ticketRoutes.get(
    "/:id",
    ensureAuthenticated,
    validateData(getTicketById, "params"),
    (req, res) => ticketController.findById(req, res),
);

//GET all Tickets
ticketRoutes.get(
    "/",
    ensureAuthenticated,
    ensureRole([UserRole.ADMIN, UserRole.ORGANIZER]),
    (req, res) => ticketController.findAll(req, res),
);

//UPDATE ticket
ticketRoutes.patch(
    "/:id",
    ensureAuthenticated,
    ensureRole([UserRole.ADMIN]),
    (req, res) => ticketController.useTicket(req, res),
);

export { ticketRoutes };
