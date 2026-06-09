import { Platform,Difficulty } from "@/prisma/generated/client/enums";
import * as z from "zod";


export const CreateProblemSchema = z.object({
  userId: z.string().min(1),
  title: z.string().min(1),
  platform:z.enum(Platform),
  tags:z.array(z.string()).min(1),
  difficulty:z.enum(Difficulty),
  url:z.url()
});

export type CreateProblemInput=z.infer<typeof CreateProblemSchema>