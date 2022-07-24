// src/server/trpc/router/index.ts
import { t } from "../utils";
import { workoutsRouter } from "./workouts";
import { exampleRouter } from "./example";
import { authRouter } from "./auth";

export const appRouter = t.router({
  workout: workoutsRouter,
  example: exampleRouter,
  auth: authRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
