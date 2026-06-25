"use client";

import { useEffect, useState } from "react";
import { use } from "react";
import FpsChart from "@/compnents/PerformanceChart";
import PerformanceChart from "@/compnents/PerformanceChart";

export default function ModelDetailsPage({
  params,
}: {
  params: Promise<{ model: string }>;
}) {
  const { model } = use(params);

  const [summary, setSummary] = useState<any>(null);

  const [trend, setTrend] = useState<any[]>([]);

  useEffect(() => {
    fetch(
      `http://127.0.0.1:8001/benchmark/model-summary/${model}`
    )
      .then((response) => response.json())
      .then((data) => {
        setSummary(data);
      });

    fetch(
  `http://127.0.0.1:8001/benchmark/trends/${model}`
)
  .then((response) => response.json())
  .then((data) => {
    setTrend(data.trend);
  });
  }, [model]);

  if (!summary) {
    return <p className="p-8">Loading...</p>;
  }

  return (
    <div className="p-8">
      <h1 className="text-4xl font-bold mb-6">
        Model: {model}
      </h1>

        <div className="border rounded-lg p-6 shadow">
  <p>
    <strong>Total Benchmarks:</strong> {summary.benchmark_count}
  </p>

  <hr className="my-4" />

  <h2 className="text-xl font-bold mb-2">
    🏆 Best FPS
  </h2>

  <p>
    <strong>FPS:</strong> {summary.best_fps.value}
  </p>

  <p>
    <strong>Version:</strong> {summary.best_fps.version}
  </p>

  <p>
    <strong>Hardware:</strong> {summary.best_fps.hardware}
  </p>

  <hr className="my-4" />

  <h2 className="text-xl font-bold mb-2">
    ⚡ Best Latency
  </h2>

  <p>
    <strong>Latency:</strong> {summary.best_latency.value} ms
  </p>

  <p>
    <strong>Version:</strong> {summary.best_latency.version}
  </p>

  <p>
    <strong>Hardware:</strong> {summary.best_latency.hardware}
  </p>
  <div className="border rounded-lg p-6 shadow mt-6">
  <h2 className="text-2xl font-bold mb-4">
    📈 Version Trend
  </h2>

  <table className="w-full">
    <thead>
      <tr className="border-b">
        <th className="text-left p-2">Version</th>
        <th className="text-left p-2">FPS</th>
        <th className="text-left p-2">Latency</th>
      </tr>
    </thead>

    <tbody>
      {trend.map((item, index) => (
        <tr
          key={index}
          className="border-b"
        >
          <td className="p-2">
            {item.version}
          </td>

          <td className="p-2">
            {item.fps}
          </td>

          <td className="p-2">
            {item.latency}
          </td>
        </tr>
      ))}
    </tbody>
  </table>
  <div className="border rounded-lg p-6 shadow mt-6">
  <h2 className="text-2xl font-bold mb-4">
    📈 FPS Trend
  </h2>

  <PerformanceChart data={trend} />
</div>
</div>
</div>
    </div>
  );
}