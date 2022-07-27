import { Workout } from "@prisma/client";
import { useRouter } from "next/router";
import { trpc } from "../../utils/trpc";

const DeleteWorkoutButton: React.FC<{ id: string; userId: string }> = ({
  id,
  userId,
}) => {
  const { mutate, isLoading } = trpc.proxy.workout.delete.useMutation();
  const router = useRouter();

  function handleDelete() {
    mutate(
      {
        id: id,
        userId: userId,
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
        disabled={isLoading}
      >
        {isLoading ? "Deleting..." : "Delete Workout"}
      </button>
    </div>
  );
};

export default DeleteWorkoutButton;
