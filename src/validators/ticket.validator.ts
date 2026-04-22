import z from "zod";
import { ValidationMessages } from "../constants/messages";

export const useTicket = z.object({
    eventId: z.uuid(ValidationMessages.INVALID_UUID),
});
