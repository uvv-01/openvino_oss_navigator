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

  return (
    <main className="min-h-screen bg-slate-950 text-white p-10">

      <h1 className="text-4xl font-bold">
        Performance Leaderboard
      </h1>

      <p className="text-slate-400 mt-2 mb-8">
        Top performing OpenVINO benchmarks ranked by FPS.
      </p>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="overflow-hidden rounded-xl border border-slate-700">

          <table className="w-full">

            <thead className="bg-slate-900">

              <tr>

                <th className="p-4 text-left">Rank</th>
                <th className="p-4 text-left">Model</th>
                <th className="p-4 text-left">Version</th>
                <th className="p-4 text-left">Hardware</th>
                <th className="p-4 text-left"> Best FPS</th>
                <th className="p-4 text-left">Latency</th>

              </tr>

            </thead>

            <tbody>

              {leaderboard.map((item) => (

                <tr
                  key={item.rank}
                  className="border-t border-slate-700 hover:bg-slate-900 transition"
                >

                  <td className="p-4 font-bold text-yellow-400">
                    #{item.rank}
                  </td>

                  <td className="p-4">
                    {item.model}
                  </td>

                  <td className="p-4">
                    {item.version}
                  </td>

                  <td className="p-4">
                    {item.hardware}
                  </td>

                  <td className="p-4 text-green-400 font-semibold">
                    {Number(item.best_fps).toFixed(2)}
                  </td>

                  <td className="p-4 text-cyan-400">
                    {Number(item.latency).toFixed(2)} ms
                  </td>

                </tr>

              ))}

            </tbody>

          </table>

        </div>
      )}

    </main>
  );
}