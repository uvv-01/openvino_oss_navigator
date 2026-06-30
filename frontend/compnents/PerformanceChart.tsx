"use client";

import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

type Trend = {
  version: string;
  fps: number;
};

export default function PerformanceChart({
  data,
}: {
  data: Trend[];
}) {
  return (
    <div className="bg-slate-800 rounded-xl p-6 mt-10">

      <h2 className="text-2xl font-bold mb-6">
        📈 FPS Trend
      </h2>

      <ResponsiveContainer width="100%" height={350}>
        <LineChart data={data}>

          <CartesianGrid strokeDasharray="3 3" />

          <XAxis dataKey="version" />

          <YAxis />

          <Tooltip />

          <Line
            type="monotone"
            dataKey="fps"
            stroke="#22d3ee"
            strokeWidth={3}
          />

        </LineChart>
      </ResponsiveContainer>

    </div>
  );
}