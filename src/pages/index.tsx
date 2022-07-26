import type { NextPage } from "next";
import { useSession } from "next-auth/react";
import WorkoutPreview from "../components/WorkoutPreview";
import { trpc } from "../utils/trpc";

const WorkoutPreviews = () => {
  const { data: session } = useSession();

  if (!session || !session.user || !session.user.id) {
    return <div>Loading workouts..</div>;
  }

  const workouts = trpc.proxy.workout.getAll.useQuery({
    userId: session.user.id,
  });

  if (!workouts.data?.workouts.length) {
    return <div>You currently have no workout plans</div>;
  }

  return (
    <div>
      {workouts.data?.workouts.map((workout) => (
        <WorkoutPreview
          name={workout.name}
          description={workout.description}
          id={workout.id}
          key={workout.id}
        />
      ))}
    </div>
  );
};

const Home: NextPage = () => {
  const { data: session } = useSession();

  if (!session || !session.user?.id) {
    return (
      <div>
        <h1>Sign in to see your workouts</h1>
      </div>
    );
  }

  return (
    <>
      <div>
        <WorkoutPreviews />
      </div>
    </>
  );
};

export default Home;
