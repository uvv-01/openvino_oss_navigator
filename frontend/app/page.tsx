import Link from "next/link";
import { ArrowRight, BarChart3 } from "lucide-react";

import LeaderboardTable from "@/compnents/LeaderboardTable";
import PerformanceChart from "@/compnents/PerformanceChart";
import StatCard from "@/compnents/StatCard";

import { getLeaderboard, getStats, getTrend } from "@/libs/api";

export default async function Home() {
  const stats = await getStats();
  const leaderboard = await getLeaderboard();
  const trend = await getTrend("resnet-50");

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-black text-white p-10">

      <div className="max-w-7xl mx-auto">

        <div className="mb-14">

          <div className="inline-flex items-center gap-2 rounded-full border border-cyan-500/30 bg-cyan-500/10 px-4 py-2 text-cyan-400 text-sm">
            <BarChart3 size={18} />
            OpenVINO Benchmark Analytics
          </div>

          <h1 className="mt-6 text-6xl font-extrabold bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-400 bg-clip-text text-transparent">
            OpenVINO OSS Navigator
          </h1>

          <p className="mt-6 max-w-3xl text-lg text-slate-300 leading-8">
            Analyze, compare and visualize benchmark performance across
            different OpenVINO releases, AI models and hardware platforms.
          </p>

          <div className="mt-8 flex flex-wrap gap-4">

            <Link
              href="/explorer"
              className="rounded-xl bg-cyan-500 px-6 py-3 font-semibold text-black hover:bg-cyan-400 transition"
            >
              Explore Benchmarks
            </Link>

            <Link
              href="/version-compare"
              className="flex items-center gap-2 rounded-xl border border-slate-700 px-6 py-3 hover:bg-slate-800 transition"
            >
              Compare Versions
              <ArrowRight size={18} />
            </Link>

          </div>

        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-8">

          <StatCard
            title="Benchmarks"
            value={stats.total_benchmarks}
          />

          <StatCard
            title="Models"
            value={stats.total_models}
          />

          <StatCard
            title="Versions"
            value={stats.total_versions}
          />

          <StatCard
            title="Hardware"
            value={stats.total_hardware}
          />

        </div>

        <div className="mt-16 mb-6">

          <h2 className="text-3xl font-bold">
            Performance Overview
          </h2>

          <p className="mt-2 text-slate-400">
            Top benchmark results and FPS trends across OpenVINO releases.
          </p>

        </div>

        <div className="grid lg:grid-cols-2 gap-8">

          <LeaderboardTable
            data={leaderboard.leaderboard.slice(0, 5)}
          />

          <PerformanceChart
            data={trend.trend}
          />

        </div>

      </div>

    </main>
  );
}