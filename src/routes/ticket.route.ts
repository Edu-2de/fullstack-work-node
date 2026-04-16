import { Router } from "express";
import { ticketController } from "../factories/services-factory";
import { ensureAuthenticated } from "../middlewares/ensureAuthenticated";
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

    (req, res) => ticketController.findAll(req, res),
);

export { ticketRoutes };
