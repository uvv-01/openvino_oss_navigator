"use client";

import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

type Trend = {
  version: string;
  fps: number;
  latency: number;
};

export default function PerformanceChart({
  data,
}: {
  data: Trend[];
}) {
  return (
    <div className="bg-slate-900 rounded-xl border border-slate-700 p-6">

      <h2 className="text-2xl font-bold mb-6">
        Performance Trend
      </h2>

      <ResponsiveContainer width="100%" height={400}>
        <LineChart data={data}>

          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />

          <XAxis
            dataKey="version"
            stroke="#94a3b8"
          />

          <YAxis stroke="#94a3b8" />

          <Tooltip />

          <Legend />

          <Line
            type="monotone"
            dataKey="fps"
            name="FPS"
            stroke="#22c55e"
            strokeWidth={3}
          />

          <Line
            type="monotone"
            dataKey="latency"
            name="Latency"
            stroke="#3b82f6"
            strokeWidth={3}
          />

        </LineChart>
      </ResponsiveContainer>

    </div>
  );
}