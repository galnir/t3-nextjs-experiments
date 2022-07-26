import { useRouter } from "next/router";
import { trpc } from "../../utils/trpc";

const DeleteWorkoutButton: React.FC<{ id: string }> = ({ id }) => {
  const { mutate, isLoading } = trpc.proxy.workout.delete.useMutation();
  const router = useRouter();

  function handleDelete() {
    mutate(
      {
        id,
      },
      {
        onSuccess: () => {
          router.push("/");
        },
      }
    );
  }

  return (
    <div>
      <button
        className="block p-1 px-2 rounded-sm bg-red-600 text-white"
        onClick={handleDelete}
      >
        {isLoading ? "Deleting..." : "Delete Exercise"}
      </button>
    </div>
  );
};

export default DeleteWorkoutButton;
