export default function WorkoutPreview({
  name,
  description,
}: {
  name: string;
  description: string | null;
}) {
  return (
    <div className="p-4 flex flex-col">
      <h1 className="text-2xl font-bold">{name}</h1>
      <p className="text-lg">{description}</p>
    </div>
  );
}
