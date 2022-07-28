import type { GetServerSidePropsContext, NextPage } from "next";
import { useSession } from "next-auth/react";
import WorkoutPreview from "../components/WorkoutPreview";
import { getServerSession } from "../shared/get-server-session";
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
    <div className="mt-8 ml-1">
      <h1 className="text-2xl">Your workouts:</h1>
      <div className="mt-4 flex gap-5">
        {workouts.data?.workouts.map((workout) => (
          <WorkoutPreview
            name={workout.name}
            description={workout.description}
            id={workout.id}
            key={workout.id}
          />
        ))}
      </div>
    </div>
  );
};

const Home: NextPage = () => {
  const { data: session } = useSession();

  if (!session || !session.user?.id) {
    return (
      <div>
        <h1>Sign in to view and create workouts</h1>
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

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  return {
    props: {
      session: await getServerSession(ctx),
    },
  };
};

export default Home;
