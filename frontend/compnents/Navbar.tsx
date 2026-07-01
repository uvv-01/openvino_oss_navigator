"use client";

import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="w-full bg-slate-900 text-white shadow-md">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-8 py-4">

        <div className="text-2xl font-bold text-cyan-400">
          OSS Navigator
        </div>

        <div className="flex gap-6 text-sm">

          <Link href="/">Dashboard</Link>

          <Link href="/models-comparison">
            Model Compare
          </Link>

          <Link href="/leaderboard">
            Leaderboard
          </Link>

          <Link href="/version-compare">
            Version Compare
         </Link>

          <Link href="/trends">
            Trends
          </Link>

          <Link href="/recommendations">
            Recommendations
          </Link>

          <Link href="/export">
            Export
          </Link>

        </div>

      </div>
    </nav>
  );
}