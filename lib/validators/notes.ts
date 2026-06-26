import * as z from "zod";

export const CreateNoteSchema = z.object({
  bruteForceApproach: z.string().trim().optional(),
  optimizedApproach: z.string().trim().optional(),
  timeComplexity: z.string().trim().optional(),
  spaceComplexity: z.string().trim().optional(),
  mistakes: z.string().trim().optional(),
  keyLearning: z.string().trim().optional(),
  intuition: z.string().trim().optional(),
  interviewExplanation: z.string().trim().optional(),
});
export const UpdateNoteSchema = CreateNoteSchema.partial();

export type CreateNoteInput = z.infer<typeof CreateNoteSchema>;
export type UpdateNoteInput = z.infer<typeof UpdateNoteSchema>;
