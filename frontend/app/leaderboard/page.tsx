"use client";

import { useEffect, useState } from "react";

export default function LeaderboardPage() {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    fetch("http://127.0.0.1:8001/benchmark/model-leaderboard")
      .then((response) => response.json())
      .then((result) => {
        setData(result);
      });
  }, []);

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">
        Benchmark Leaderboard
      </h1>

      {!data ? (
        <p>Loading...</p>
      ) : (
        <table className="border-collapse border w-full">
          <thead>
            <tr>
              <th className="border p-2">Rank</th>
              <th className="border p-2">Model</th>
              <th className="border p-2">FPS</th>
              <th className="border p-2">Latency</th>
              <th className="border p-2">Version</th>
              <th className="border p-2">Hardware</th>
            </tr>
          </thead>

          <tbody>
            {data.leaderboard.map((item: any) => (
              <tr key={item.rank}>
                <td className="border p-2">{item.rank}</td>
                <td className="border p-2">{item.model}</td>
                <td className="border p-2">{item.best_fps}</td>
                <td className="border p-2">{item.latency}</td>
                <td className="border p-2">{item.version}</td>
                <td className="border p-2">{item.hardware}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}