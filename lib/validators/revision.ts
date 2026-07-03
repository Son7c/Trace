import * as z from "zod";
import { Feedback } from "@/prisma/generated/client/enums";

export const CreateRevisionSchema=z.object({
    userFeedback:z.enum(Feedback)
})

export type CreateRevisionInput = z.infer<typeof CreateRevisionSchema>;