import { z } from "zod";

export const createExerciseValidator = z.object({
  name: z.string().min(3).max(80),
  description: z.string().min(1).max(100),
});

export type CreateExerciseValidator = z.infer<typeof createExerciseValidator>;
