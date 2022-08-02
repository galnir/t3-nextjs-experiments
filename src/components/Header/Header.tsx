import { useSession } from "next-auth/react";
import Link from "next/link";

export default function Header() {
  const { data: session } = useSession();

  return (
    <header className="w-full flex justify-between items-center pr-1 sm:p-0">
      <div className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-red-300 to-orange-600 sm:text-6xl">
        <Link href="/">
          <a className="block">
            <p>Workout Planner</p>
          </a>
        </Link>
      </div>
      <div className="flex justify-between">
        <div>
          {session ? (
            <div className="flex gap-3 text-white sm:gap-4">
              <p className="text-red-400">Hi {session.user?.name}</p>
              <span className="hidden md:inline">-</span>
              <div className="grow flex justify-center px-3 py-1 w-fit rounded-sm bg-green-600 -mt-1 hover:bg-green-500">
                <Link href="/workout/create">
                  <a className="block">Create Workout</a>
                </Link>
              </div>
              <span className="hidden md:inline">-</span>
              <div className="grow flex justify-center py-1 px-3 rounded-sm bg-red-700 -mt-1 hover:bg-red-600 sm:px-2 sm:py-1">
                <Link href="api/auth/signout">
                  <a className="block">Sign Out</a>
                </Link>
              </div>
            </div>
          ) : (
            <div className="grow p-2 rounded-md bg-amber-600 hover:bg-amber-500">
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
