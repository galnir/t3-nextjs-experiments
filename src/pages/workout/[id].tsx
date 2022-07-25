import type { NextPage } from "next";
import { useRouter } from "next/router";
import React from "react";
import { trpc } from "../../utils/trpc";

const WorkoutContent: React.FC<{ id: string }> = ({ id }) => {
  const { data, isLoading, error } = trpc.proxy.workout.getById.useQuery({
    id,
  });

  if (isLoading || !data?.workout) {
    return <div>Loading...</div>;
  }

  return (
    <div className="w-full bg-slate-200">
      <h1>{data?.workout.name}</h1>
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
