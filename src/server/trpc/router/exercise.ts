import { t } from "../utils";
import { z } from "zod";

import { authedProcedure } from "../utils";

export const exerciseRouter = t.router({
  create: authedProcedure
    .input(
      z.object({
        workoutId: z.string(),
        name: z.string(),
        sets: z.number().min(1).max(100),
        reps: z.number().min(1).max(100),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { workoutId, name, sets, reps } = input;

      const exercise = await prisma?.exercise.create({
        data: {
          workoutId,
          name,
          sets,
          reps,
        },
      });

      return {
        exercise,
      };
    }),
  getAll: authedProcedure
    .input(
      z.object({
        workoutId: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      const { workoutId } = input;
      const exercises = await prisma?.exercise.findMany({
        where: {
          workoutId,
        },
      });
      return {
        exercises,
      };
    }),
  getById: authedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const { id } = input;
      const exercise = await prisma?.exercise.findUnique({
        where: {
          id,
        },
      });
      return {
        exercise,
      };
    }),
});
