import { t } from "../utils";
import { z } from "zod";

import { authedProcedure } from "../utils";
import { TRPCError } from "@trpc/server";

export const workoutsRouter = t.router({
  create: authedProcedure
    .input(
      z.object({
        userId: z.string(),
        name: z.string(),
        description: z.string().min(5).max(100).nullable(),
        premadeExercises: z
          .array(
            z.object({
              name: z.string(),
              sets: z.number().min(1).max(100),
              reps: z.number().min(1).max(100),
              weight: z.number().min(1).max(500),
            })
          )
          .nullable(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { userId, name, description, premadeExercises } = input;

      if (premadeExercises) {
        const newWorkout = await ctx.prisma.workout.create({
          data: {
            name,
            description,
            userId,
          },
        });

        let exercisesWithID: {
          name: string;
          sets: number;
          reps: number;
          weight: number;
          workoutId: string;
        }[] = [];
        premadeExercises.forEach((exercise) => {
          exercisesWithID.push({
            ...exercise,
            workoutId: newWorkout.id,
          });
        });

        await ctx.prisma.exercise.createMany({
          data: exercisesWithID,
        });

        return {
          workout: newWorkout,
        };
      } else {
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
      }
    }),
  delete: authedProcedure
    .input(
      z.object({
        id: z.string(),
        userId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { id } = input;
      if (ctx.session.user.id !== input.userId) {
        throw new TRPCError({
          message: "NOT YOUR WORKOUTS",
          code: "UNAUTHORIZED",
        });
      }
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
      if (ctx.session.user.id !== input.userId) {
        throw new TRPCError({
          message: "NOT YOUR WORKOUTS",
          code: "UNAUTHORIZED",
        });
      }
      const workouts = await ctx.prisma.workout.findMany({
        where: {
          userId: input.userId,
        },
        include: {
          exercises: true,
        },
      });

      return {
        workouts,
      };
    }),

  getById: t.procedure
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
