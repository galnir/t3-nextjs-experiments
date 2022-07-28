import type { NextPage } from "next";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import React, { useRef } from "react";
import DeleteWorkoutButton from "../../components/DeleteWorkoutButton";
import Exercise from "../../components/Exercise";
import { trpc } from "../../utils/trpc";

const WorkoutContent: React.FC<{ id: string }> = ({ id }) => {
  const utils = trpc.useContext();
  const { data: session } = useSession();
  const formRef = useRef<HTMLFormElement>(null);

  const { data, isLoading: isLoadingWorkout } =
    trpc.proxy.workout.getById.useQuery({
      id,
    });

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
    <div className="mx-auto w-4/6 py-16 flex flex-col justify-center items-center gap-10">
      <div className="flex gap-4 pb-2 border-b-2 w-5/6 justify-center">
        <h1 className="w-fit text-5xl text-rose-600">{data?.workout.name}</h1>
        <h4 className="self-end">by {data.workout.user.name}</h4>
        {data.workout.user.id === session?.user?.id && (
          <div className="self-end">
            <DeleteWorkoutButton
              id={data.workout.id}
              userId={data.workout.user.id}
            />
          </div>
        )}
      </div>

      <form
        onSubmit={handleSubmit}
        className="-ml-5 py-3 flex gap-5 justify-center w-5/6"
        ref={formRef}
      >
        <div className="flex gap-4 items-center">
          <label htmlFor="name">Exercise:</label>
          <input
            name="name"
            className="p-1 rounded-sm text-orange-600 w-36"
            minLength={3}
            maxLength={80}
            required
          />
        </div>
        <div className="flex gap-4 items-center">
          <label htmlFor="sets">Sets:</label>
          <input
            className="p-1 rounded-sm text-orange-600 w-16"
            name="sets"
            type={"number"}
            min={1}
            max={100}
            required
          />
        </div>
        <div className="flex gap-4 items-center">
          <label htmlFor="reps">Reps:</label>
          <input
            className="p-1 rounded-sm text-orange-600 w-16"
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
          className="block p-1 px-2 text-gray-700 bg-orange-500 rounded-sm hover:bg-orange-400"
        >
          {isLoadingExercise ? "Adding..." : "Add"}
        </button>
      </form>

      <div className="flex flex-col gap-4 w-full items-center">
        {data?.workout.exercises.map((exercise) => (
          <Exercise key={exercise.id} exercise={exercise} />
        ))}
      </div>
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
