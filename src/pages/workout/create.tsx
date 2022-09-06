import { GetServerSideProps, GetServerSidePropsContext, NextPage } from "next";
import { Session } from "next-auth";
import { useRouter } from "next/router";
import { useState } from "react";
import { getServerSession } from "../../shared/get-server-session";
import { trpc } from "../../utils/trpc";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

type Props = {
  session: Session;
};

const NewExerciseForm = (props: Props) => {
  const router = useRouter();

  const { data, isLoading: isLoadingData } = trpc.proxy.workout.getAll.useQuery(
    { userId: props.session.user?.id as string }
  );

  const { mutate, isLoading } = trpc.proxy.workout.create.useMutation();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [premadeWorkout, setPremadeWorkout] = useState("");

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const { name, description } = e.target as typeof e.target & {
      name: { value: string };
      description: { value: string };
    };

    let exercises: {
      name: string;
      sets: number;
      reps: number;
      rest: number;
      weight: number;
    }[] = [];
    if (premadeWorkout) {
      const workout = data?.workouts.find(
        (workout) => workout.id === premadeWorkout
      );
      workout?.exercises.forEach((exercise) => {
        exercises.push({
          name: exercise.name,
          sets: exercise.sets,
          reps: exercise.reps,
          weight: exercise.weight,
          rest: exercise.rest,
        });
      });
    }

    mutate(
      {
        userId: props.session.user?.id as string,
        name: name.value,
        description: description.value,
        premadeExercises: exercises,
      },
      {
        onSuccess: (data) => {
          console.log("in sucess");
          if (!data.workout) return;

          toast("Workout created!", {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: false,
            draggable: true,
            progress: undefined,
          });

          router.push(`/workout/${data.workout.id}`);
        },
      }
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3 sm:flex-row">
      <div className="flex gap-2 items-center">
        <label htmlFor="name">Workout Name</label>
        <input
          name="name"
          className="p-1 rounded-sm text-orange-600"
          value={name}
          onChange={(e) => setName(e.target.value)}
          minLength={3}
          maxLength={80}
          required
        />
      </div>
      <div className="flex gap-2 items-center">
        <label htmlFor="description">Description</label>
        <input
          name="description"
          className="p-1 rounded-sm text-orange-600"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          minLength={1}
          maxLength={80}
        />
      </div>
      {data && data?.workouts.length > 0 && (
        <div className="flex gap-2 items-center">
          <label htmlFor="premadeworkout">Workout template:</label>
          <select
            name="premadeworkout"
            className="p-1 rounded-sm text-orange-600"
            value={premadeWorkout}
            disabled={isLoading || isLoadingData}
            onChange={(e) => setPremadeWorkout(e.target.value)}
          >
            <option value="">None</option>
            {data.workouts.map((workout) => (
              <option key={workout.id} value={workout.id}>
                {workout.name}
              </option>
            ))}
          </select>
        </div>
      )}
      <button className="w-full block p-1 px-2 bg-orange-500 rounded-sm hover:bg-orange-400 sm:w-fit">
        {isLoading ? "Creating..." : "Create"}
      </button>
    </form>
  );
};

const CreateExercisePage: NextPage<Props> = (props: Props) => {
  return (
    <div className="py-20 sm:p-10">
      <NewExerciseForm session={props.session} />
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async (
  ctx: GetServerSidePropsContext
) => {
  const session = await getServerSession(ctx);

  if (!session || !session.user || !session.user.id) {
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
