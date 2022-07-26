import { t } from "../utils";
import { z } from "zod";

import { authedProcedure } from "../utils";

export const workoutsRouter = t.router({
  create: t.procedure
    .input(
      z.object({
        userId: z.string(),
        name: z.string(),
        description: z.string().min(5).max(100).nullable(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { userId, name, description } = input;
      const workout = await ctx.prisma.workout.create({
        data: {
          userId,
          name,
          description,
        },
      });

      return {
        workout,
      };
    }),
  delete: authedProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { id } = input;
      const workout = await ctx.prisma.workout.delete({
        where: {
          id,
        },
      });

      return {
        workout,
      };
    }),
  getAll: authedProcedure
    .input(z.object({ userId: z.string() }))
    .query(async ({ ctx, input }) => {
      const workouts = await ctx.prisma.workout.findMany({
        where: {
          userId: input.userId,
        },
      });

      return {
        workouts,
      };
    }),

  getById: authedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const workout = await ctx.prisma.workout.findUnique({
        where: {
          id: input.id,
        },
        select: {
          exercises: true,
          name: true,
          description: true,
          id: true,
          user: true,
        },
      });

      return {
        workout,
      };
    }),
});
