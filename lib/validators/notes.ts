import * as z from "zod";

export const CreateNoteSchema = z.object({
  bruteForceApproach: z
    .string()
    .trim()
    .max(10000, "Brute force approach cannot exceed 10,000 characters")
    .optional(),
  optimizedApproach: z
    .string()
    .trim()
    .max(10000, "Optimized approach cannot exceed 10,000 characters")
    .optional(),
  timeComplexity: z
    .string()
    .trim()
    .max(50, "Time complexity cannot exceed 50 characters")
    .optional(),
  spaceComplexity: z
    .string()
    .trim()
    .max(50, "Space complexity cannot exceed 50 characters")
    .optional(),
  mistakes: z
    .string()
    .trim()
    .max(5000, "Mistakes cannot exceed 5,000 characters")
    .optional(),
  keyLearning: z
    .string()
    .trim()
    .max(5000, "Key learnings cannot exceed 5,000 characters")
    .optional(),
  intuition: z
    .string()
    .trim()
    .max(5000, "Intuition cannot exceed 5,000 characters")
    .optional(),
  language: z
    .string()
    .trim()
    .max(20, "Language cannot exceed 20 characters")
    .optional(),
  interviewExplanation: z
    .string()
    .trim()
    .max(5000, "Interview explanation cannot exceed 5,000 characters")
    .optional(),
});

export const UpdateNoteSchema = CreateNoteSchema.partial();

export type CreateNoteInput = z.infer<typeof CreateNoteSchema>;
export type UpdateNoteInput = z.infer<typeof UpdateNoteSchema>;
