import z from "zod";
import { ValidationMessages } from "../constants/messages";

export const createTicket = z.object({
    id: z.uuid(ValidationMessages.INVALID_UUID),
});

export const getTicketById = z.object({
    id: z.uuid(ValidationMessages.INVALID_UUID),
});
