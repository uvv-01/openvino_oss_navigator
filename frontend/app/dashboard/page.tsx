"use client";

import { useEffect, useState } from "react";

export default function DashboardPage() {
  const [stats, setStats] = useState<any>(null);
  const [bestFps, setBestFps] = useState<any>(null);
  const [bestLatency, setBestLatency] = useState<any>(null);
  const [leaderboard, setLeaderboard] = useState<any[]>([]);

  useEffect(() => {
    fetch("http://127.0.0.1:8001/benchmark/stats")
      .then((response) => response.json())
      .then((data) => {
        setStats(data);
      })
      .catch((error) => {
        console.error("Error fetching stats:", error);
      });

    fetch("http://127.0.0.1:8001/benchmark/best-fps")
      .then((response) => response.json())
      .then((data) => {
        setBestFps(data);
      })
      .catch((error) => {
        console.error("Error fetching best FPS:", error);
      });

    fetch("http://127.0.0.1:8001/benchmark/best-latency")
      .then((response) => response.json())
      .then((data) => {
        setBestLatency(data);
      })
      .catch((error) => {
        console.error("Error fetching best latency:", error);
      });
    
    fetch("http://127.0.0.1:8001/benchmark/leaderboard")
      .then((response) => response.json())
      .then((data) => {
        setLeaderboard(data.leaderboard);
   });
  }, []);

  return (
    <div className="p-8">
      <h1 className="text-4xl font-bold mb-6">
        OSS Navigator Dashboard
      </h1>

      {!stats ? (
        <p>Loading...</p>
      ) : (
        <>
          {/* Stats Cards */}
          <div className="grid grid-cols-4 gap-4">
            <div className="border rounded-lg p-4 shadow">
              <h2 className="text-gray-500">Benchmarks</h2>
              <p className="text-3xl font-bold">
                {stats.total_benchmarks}
              </p>
            </div>

            <div className="border rounded-lg p-4 shadow">
              <h2 className="text-gray-500">Models</h2>
              <p className="text-3xl font-bold">
                {stats.total_models}
              </p>
            </div>

            <div className="border rounded-lg p-4 shadow">
              <h2 className="text-gray-500">Versions</h2>
              <p className="text-3xl font-bold">
                {stats.total_versions}
              </p>
            </div>

            <div className="border rounded-lg p-4 shadow">
              <h2 className="text-gray-500">Hardware</h2>
              <p className="text-3xl font-bold">
                {stats.total_hardware}
              </p>
            </div>
          </div>

          {/* Best Metrics */}
          <div className="grid grid-cols-2 gap-4 mt-8">
            {bestFps && (
              <div className="border rounded-lg p-6 shadow">
                <h2 className="text-xl font-bold mb-3">
                  🏆 Best FPS
                </h2>

                <p>
                  <strong>Model:</strong> {bestFps.model}
                </p>

                <p>
                  <strong>Version:</strong> {bestFps.version}
                </p>

                <p>
                  <strong>Hardware:</strong> {bestFps.hardware}
                </p>

                <p className="text-3xl font-bold mt-4">
                  {bestFps.fps} FPS
                </p>
              </div>
            )}

            {bestLatency && (
              <div className="border rounded-lg p-6 shadow">
                <h2 className="text-xl font-bold mb-3">
                  ⚡ Best Latency
                </h2>

                <p>
                  <strong>Model:</strong> {bestLatency.model}
                </p>

                <p>
                  <strong>Version:</strong> {bestLatency.version}
                </p>

                <p>
                  <strong>Hardware:</strong> {bestLatency.hardware}
                </p>

                <p className="text-3xl font-bold mt-4">
                  {bestLatency.latency} ms
                </p>
              </div>
            )}
            <div className="mt-8 border rounded-lg p-6 shadow">
  <h2 className="text-2xl font-bold mb-4">
    🏆 Benchmark Leaderboard
  </h2>

  <table className="w-full border-collapse">
    <thead>
      <tr className="border-b">
        <th className="text-left p-2">Rank</th>
        <th className="text-left p-2">Model</th>
        <th className="text-left p-2">Version</th>
        <th className="text-left p-2">Hardware</th>
        <th className="text-left p-2">FPS</th>
      </tr>
    </thead>

    <tbody>
      {leaderboard.map((item) => (
        <tr key={item.rank} className="border-b">
          <td className="p-2">{item.rank}</td>
          <td className="p-2">{item.model}</td>
          <td className="p-2">{item.version}</td>
          <td className="p-2">{item.hardware}</td>
          <td className="p-2 font-bold">{item.fps}</td>
        </tr>
      ))}
    </tbody>
  </table>
</div>
          </div>
        </>
      )}
    </div>
  );
}