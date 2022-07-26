import Link from "next/link";

export default function WorkoutPreview({
  name,
  description,
  id,
}: {
  name: string;
  description: string | null;
  id: string;
}) {
  return (
    <div className="w-52 p-4 flex flex-col bg-slate-500">
      <Link href={`/workout/${id}`}>
        <a className="text-2xl font-bold">{name}</a>
      </Link>
      <p className="text-lg">{description}</p>
    </div>
  );
}
