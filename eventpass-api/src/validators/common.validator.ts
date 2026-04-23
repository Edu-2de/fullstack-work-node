import z from "zod";
import { ValidationMessages } from "../constants/messages";

export const idParamSchema = z.object({
    id: z.uuid(ValidationMessages.INVALID_UUID),
});
