import { useState } from "react";
import { trpc } from "../../utils/trpc";
import type { Exercise } from "@prisma/client";
import { motion, AnimatePresence } from "framer-motion";

export default function Exercise({ exercise }: { exercise: Exercise }) {
  const [name, setName] = useState(exercise.name);
  const [sets, setSets] = useState(exercise.sets);
  const [reps, setReps] = useState(exercise.reps);
  const [edit, setEdit] = useState(false);

  const { mutate: editExercise, isLoading: isLoadingEdit } =
    trpc.proxy.exercise.edit.useMutation();
  const { mutate: deleteExercise, isLoading: isLoadingDelete } =
    trpc.proxy.exercise.delete.useMutation();

  const utils = trpc.useContext();

  function handleEdit() {
    if (edit) {
      editExercise(
        {
          id: exercise.id,
          name,
          sets,
          reps,
        },
        {
          onSuccess: () => {
            utils.invalidateQueries("workout.getById");
            const next = !edit;
            setEdit(next);
          },
        }
      );
    } else {
      const next = !edit;
      setEdit(next);
    }
  }

  function handleDelete() {
    deleteExercise(
      {
        id: exercise.id,
      },
      {
        onSuccess: () => {
          utils.invalidateQueries("workout.getById");
        },
      }
    );
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="flex gap-2 text-gray-700"
      >
        <div className="flex gap-2">
          <input
            className="px-1 disabled:bg-red-400 border-none"
            placeholder="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            disabled={!edit}
          />
          <input
            className="px-1 disabled:bg-red-400 border-none"
            placeholder="sets"
            type={"number"}
            value={sets}
            onChange={(e) => setSets(+e.target.value)}
            disabled={!edit}
          />
          <input
            className="px-1 disabled:bg-red-400 border-none"
            placeholder="reps"
            type={"number"}
            value={reps}
            onChange={(e) => setReps(+e.target.value)}
            disabled={!edit}
          />
        </div>

        <button
          onClick={handleEdit}
          disabled={isLoadingEdit}
          className="block p-1 px-2 w-16 bg-orange-500 rounded-sm hover:bg-orange-400"
        >
          {edit ? (isLoadingEdit ? "Saving" : "Save") : "Edit"}
        </button>
        <button
          onClick={handleDelete}
          className="block p-1 px-2 rounded-sm bg-red-600 text-white"
          disabled={isLoadingDelete}
        >
          {isLoadingDelete ? "Deleting..." : "Delete"}
        </button>
      </motion.div>
    </AnimatePresence>
  );
}
