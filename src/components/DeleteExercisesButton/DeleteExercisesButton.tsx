import { trpc } from "../../utils/trpc";

const DeleteExercisesButton: React.FC<{ workoutId: string }> = ({
  workoutId,
}) => {
  const { mutate, isLoading } = trpc.proxy.exercise.deleteAll.useMutation();
  const utils = trpc.useContext();

  function handleDelete() {
    mutate(
      {
        workoutId: workoutId,
      },
      {
        onSuccess: () => {
          utils.invalidateQueries(["workout.getById"]);
        },
      }
    );
  }

  return (
    <div>
      <button
        className="block rounded-sm bg-red-600 text-white"
        onClick={handleDelete}
        disabled={isLoading}
      >
        {isLoading ? "Deleting exercises..." : "Delete All Exercises"}
      </button>
    </div>
  );
};

export default DeleteExercisesButton;
