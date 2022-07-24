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
            <div className="flex gap-4">
              <p className="text-red-400">Hi {session.user?.name}</p>
              <span>-</span>
              <Link href="api/auth/signout">
                <a className="block">Sign Out</a>
              </Link>
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
