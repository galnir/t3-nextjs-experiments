import type { GetServerSidePropsContext, NextPage } from "next";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import React, { useRef } from "react";
import DeleteExercisesButton from "../../components/DeleteExercisesButton";
import DeleteWorkoutButton from "../../components/DeleteWorkoutButton";
import Exercise from "../../components/Exercise";
import { getServerSession } from "../../shared/get-server-session";
import { trpc } from "../../utils/trpc";

const WorkoutContent: React.FC<{ id: string }> = ({ id }) => {
  const { data: session } = useSession();
  const utils = trpc.useContext();
  const formRef = useRef<HTMLFormElement>(null);

  const {
    data,
    isLoading: isLoadingWorkout,
    error,
  } = trpc.proxy.workout.getById.useQuery({
    id,
  });

  const { mutate, isLoading: isLoadingExercise } =
    trpc.proxy.exercise.create.useMutation();

  if (error) {
    return <div>{error.message}</div>;
  }

  if (isLoadingWorkout || !data?.workout) {
    return <div>Loading...</div>;
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const { name, sets, reps, weight, rest } = e.target as typeof e.target & {
      name: { value: string };
      sets: { value: number };
      reps: { value: number };
      weight: { value: number };
      rest: { value: number };
    };

    mutate(
      {
        workoutId: id,
        name: name.value,
        sets: +sets.value,
        reps: +reps.value,
        weight: +weight.value,
        rest: +rest.value,
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
    <div className="mx-auto w-full py-16 flex flex-col justify-center items-center gap-10 sm:w-4/6">
      <div className="flex gap-4 pb-2 border-b-2 w-5/6 justify-center">
        <h1 className="w-fit text-2xl text-rose-600 sm:text-5xl">
          {data?.workout.name}
        </h1>
        <h4 className="self-end text-sm sm:text-base">
          by {data.workout.user.name}
        </h4>
        {data.workout.user.id === session?.user?.id && (
          <div className="self-end flex gap-2">
            <DeleteWorkoutButton
              id={data.workout.id}
              userId={data.workout.user.id}
            />
            <DeleteExercisesButton workoutId={data.workout.id} />
          </div>
        )}
      </div>

      <form
        onSubmit={handleSubmit}
        className="w-full sm:-ml-5 sm:py-3 flex gap-4 sm:gap-5 sm:justify-center items-end sm:w-5/6"
        ref={formRef}
      >
        <div className="flex flex-col gap-2 items-center">
          <label htmlFor="name">Exercise:</label>
          <input
            name="name"
            className="p-1 rounded-sm text-orange-600 w-36"
            minLength={3}
            maxLength={80}
            required
          />
        </div>
        <div className="flex flex-col gap-2 items-center">
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
        <div className="flex flex-col gap-2 items-center">
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
        <div className="flex flex-col gap-2 items-center">
          <label htmlFor="reps">Weight(kg):</label>
          <input
            className="p-1 rounded-sm text-orange-600 w-20"
            name="weight"
            type={"number"}
            min={1}
            max={500}
            required
          />
        </div>
        <div className="flex flex-col gap-2 items-center">
          <label htmlFor="reps">Rest(sec):</label>
          <input
            className="p-1 rounded-sm text-orange-600 w-20"
            name="rest"
            type={"number"}
            min={1}
            max={500}
            required
          />
        </div>
        <button
          type="submit"
          disabled={isLoadingExercise}
          className="block p-1 px-2 h-fit text-gray-700 bg-orange-500 rounded-sm hover:bg-orange-400"
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

export async function getServerSideProps(context: GetServerSidePropsContext) {
  return {
    props: {
      session: await getServerSession(context),
    },
  };
}

export default WorkoutPage;
