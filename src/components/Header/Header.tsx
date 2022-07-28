import { useSession } from "next-auth/react";
import Link from "next/link";

export default function Header() {
  const { data: session } = useSession();

  return (
    <header className="w-full flex justify-between items-center">
      <div className="font-extrabold text-transparent text-6xl bg-clip-text bg-gradient-to-r from-red-300 to-orange-600">
        <Link href="/">
          <a className="block w-fit">
            <p>Workout Planner</p>
          </a>
        </Link>
      </div>
      <div className="flex justify-between">
        <div>
          {session ? (
            <div className="flex gap-4 text-white">
              <p className="text-red-400">Hi {session.user?.name}</p>
              <span>-</span>
              <div className="px-2 py-1 w-fit rounded-sm bg-green-600 -mt-1 hover:bg-green-500">
                <Link href="/workout/create">
                  <a>Create Workout</a>
                </Link>
              </div>
              <span>-</span>
              <div className="px-2 py-1 w-fit rounded-sm bg-red-700 -mt-1 hover:bg-red-600">
                <Link href="api/auth/signout">
                  <a>Sign Out</a>
                </Link>
              </div>
            </div>
          ) : (
            <div className="p-2 rounded-md bg-amber-600 hover:bg-amber-500">
              <Link href="/api/auth/signin">
                <a className="block">Sign In</a>
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
