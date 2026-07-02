"use client";

import { useEffect, useState } from "react";
import { getLeaderboard } from "@/libs/api";

export default function LeaderboardPage() {
  const [leaderboard, setLeaderboard] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadLeaderboard() {
      try {
        const data = await getLeaderboard();
        setLeaderboard(data.leaderboard || []);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    loadLeaderboard();
  }, []);

  const rankColor = (rank: number) => {
    if (rank === 1) return "text-yellow-400";
    if (rank === 2) return "text-gray-300";
    if (rank === 3) return "text-amber-600";
    return "text-cyan-400";
  };

  return (
    <main className="min-h-screen bg-slate-950 p-10 text-white">
      <h1 className="text-4xl font-bold">Performance Leaderboard</h1>

      <p className="mt-2 mb-8 text-slate-400">
        Top-performing OpenVINO benchmarks ranked by FPS.
      </p>

      {loading ? (
        <div className="flex h-64 items-center justify-center">
          <p className="text-lg text-slate-400">Loading leaderboard...</p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-slate-700 bg-slate-900 shadow-lg">
          <table className="w-full">
            <thead className="bg-slate-800 text-slate-200">
              <tr>
                <th className="p-4 text-left">Rank</th>
                <th className="p-4 text-left">Model</th>
                <th className="p-4 text-left">Version</th>
                <th className="p-4 text-left">Hardware</th>
                <th className="p-4 text-center">FPS</th>
                <th className="p-4 text-center">Latency</th>
              </tr>
            </thead>

            <tbody>
              {leaderboard.map((item, index) => (
                <tr
                  key={`${item.model}-${index}`}
                  className={`border-t border-slate-700 transition hover:bg-slate-800 ${
                    index % 2 === 0 ? "bg-slate-900" : "bg-slate-950"
                  }`}
                >
                  <td className={`p-4 font-bold ${rankColor(item.rank)}`}>
                    #{item.rank}
                  </td>

                  <td className="p-4 font-medium">{item.model}</td>

                  <td className="p-4">{item.version}</td>

                  <td className="p-4">{item.hardware}</td>

                  <td className="p-4 text-center font-semibold text-green-400">
                    {Number(item.best_fps).toFixed(2)}
                  </td>

                  <td className="p-4 text-center font-semibold text-cyan-400">
                    {Number(item.latency).toFixed(2)} ms
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {leaderboard.length === 0 && (
            <div className="p-10 text-center text-slate-400">
              No benchmark data available.
            </div>
          )}
        </div>
      )}
    </main>
  );
}