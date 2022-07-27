import { useState } from "react";
import { trpc } from "../../utils/trpc";
import type { Exercise } from "@prisma/client";

export default function Exercise({ exercise }: { exercise: Exercise }) {
  const [name, setName] = useState(exercise.name);
  const [sets, setSets] = useState(exercise.sets);
  const [reps, setReps] = useState(exercise.reps);
  const [edit, setEdit] = useState(false);

  const { mutate } = trpc.proxy.exercise.edit.useMutation();
  const utils = trpc.useContext();

  function handleEdit() {
    if (edit) {
      mutate(
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

  return (
    <div className="flex gap-2 text-gray-700">
      <div className="flex gap-2">
        <input
          className="px-1"
          placeholder="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          disabled={!edit}
        />
        <input
          className="px-1"
          placeholder="sets"
          type={"number"}
          value={sets}
          onChange={(e) => setSets(+e.target.value)}
          disabled={!edit}
        />
        <input
          className="px-1"
          placeholder="reps"
          type={"number"}
          value={reps}
          onChange={(e) => setReps(+e.target.value)}
          disabled={!edit}
        />
      </div>

      <button
        onClick={handleEdit}
        className="block p-1 px-2 w-14 bg-orange-500 rounded-sm hover:bg-orange-400"
      >
        {edit ? "Save" : "Edit"}
      </button>
      <button className="block p-1 px-2 rounded-sm bg-red-600 text-white">
        Delete Exercise
      </button>
    </div>
  );
}
