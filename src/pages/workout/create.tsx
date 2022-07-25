import { GetServerSideProps, GetServerSidePropsContext, NextPage } from "next";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { getServerSession } from "../../shared/get-server-session";
import { trpc } from "../../utils/trpc";

const NewExerciseForm = () => {
  const router = useRouter();
  const { data: session } = useSession();
  const { mutate, isLoading } = trpc.proxy.workout.create.useMutation();

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!session || !session.user || !session.user.id) {
      return router.push("../api/auth/signin");
    }

    mutate(
      {
        userId: session.user.id,
        name: "hi",
        description: "world",
      },
      {
        onSuccess: (data) => {
          if (!data.workout) return;
          router.push(`/workout/${data.workout.id}`);
        },
      }
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-3">
      <div className="flex gap-2 items-center">
        <label htmlFor="name">Workout Name</label>
        <input
          name="name"
          className="p-1 rounded-sm text-orange-600"
          minLength={3}
          maxLength={80}
          required
        />
      </div>
      <div className="flex gap-2 items-center">
        <label htmlFor="description">Description</label>
        <input
          className="p-1 rounded-sm text-orange-600"
          name="description"
          minLength={1}
          maxLength={80}
        />
      </div>
      <button className="block p-1 px-2 bg-orange-500 rounded-sm hover:bg-orange-400">
        {isLoading ? "Creating..." : "Create"}
      </button>
    </form>
  );
};

const CreateExercisePage: NextPage = (props) => {
  return (
    <div className="container p-10">
      <NewExerciseForm />
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async (
  ctx: GetServerSidePropsContext
) => {
  const session = await getServerSession(ctx);

  if (!session) {
    return {
      redirect: { destination: "../api/auth/signin", permanent: false },
      props: {},
    };
  }

  return {
    props: {
      session,
    },
  };
};

export default CreateExercisePage;
