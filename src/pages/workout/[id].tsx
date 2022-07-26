import type { NextPage } from "next";
import { useRouter } from "next/router";
import React, { useRef } from "react";
import { trpc } from "../../utils/trpc";

const WorkoutContent: React.FC<{ id: string }> = ({ id }) => {
  const formRef = useRef<HTMLFormElement>(null);

  const { data, isLoading: isLoadingWorkout } =
    trpc.proxy.workout.getById.useQuery({
      id,
    });

  const utils = trpc.useContext();
  const { mutate, isLoading: isLoadingExercise } =
    trpc.proxy.exercise.create.useMutation();

  if (isLoadingWorkout || !data?.workout) {
    return <div>Loading...</div>;
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const { name, sets, reps } = e.target as typeof e.target & {
      name: { value: string };
      sets: { value: number };
      reps: { value: number };
    };

    mutate(
      {
        workoutId: id,
        name: name.value,
        sets: +sets.value,
        reps: +reps.value,
      },
      {
        onSuccess: (data) => {
          if (!data.exercise) return;
          utils.invalidateQueries("workout.getById");
          if (!formRef || !formRef.current) return;
          formRef.current.reset();
        },
      }
    );
  }

  return (
    <div className="w-full">
      <h1>{data?.workout.name}</h1>

      <form onSubmit={handleSubmit} className="flex gap-3" ref={formRef}>
        <div className="flex gap-2 items-center">
          <label htmlFor="name">Exercise</label>
          <input
            name="name"
            className="p-1 rounded-sm text-orange-600"
            minLength={3}
            maxLength={80}
            required
          />
        </div>
        <div className="flex gap-2 items-center">
          <label htmlFor="sets">Sets</label>
          <input
            className="p-1 rounded-sm text-orange-600"
            name="sets"
            type={"number"}
            min={1}
            max={100}
            required
          />
        </div>
        <div className="flex gap-2 items-center">
          <label htmlFor="reps">Reps</label>
          <input
            className="p-1 rounded-sm text-orange-600"
            name="reps"
            type={"number"}
            min={1}
            max={100}
            required
          />
        </div>
        <button
          type="submit"
          disabled={isLoadingExercise}
          className="block p-1 px-2 bg-orange-500 rounded-sm hover:bg-orange-400"
        >
          {isLoadingExercise ? "Adding..." : "Add"}
        </button>
      </form>

      {data?.workout.exercises.map((exercise) => (
        <p key={exercise.id}>{exercise.name}</p>
      ))}
    </div>
  );
};

const WorkoutPage: NextPage = () => {
  const { query } = useRouter();
  const { id } = query;

  if (!id || typeof id !== "string") {
    return <div>Invalid workout id</div>;
  }

  return <WorkoutContent id={id} />;
};

export default WorkoutPage;
