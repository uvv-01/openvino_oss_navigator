"use client";

import { useEffect, useState } from "react";

import {
  getModels,
  getTrend,
} from "@/libs/api";

import PerformanceChart from "@/compnents/PerformanceChart";

export default function TrendsPage() {

  const [models, setModels] = useState<string[]>([]);
  const [selectedModel, setSelectedModel] = useState("");

  const [trend, setTrend] = useState<any[]>([]);

  useEffect(() => {
    getModels().then((data) => {
      setModels(data.models || []);
    });
  }, []);

  useEffect(() => {

    if (!selectedModel) return;

    getTrend(selectedModel).then((data) => {

      if (data.success) {
        setTrend(data.trend);
      }

    });

  }, [selectedModel]);

  return (
    <main className="min-h-screen bg-slate-950 text-white p-10">

      <h1 className="text-4xl font-bold">
        Performance Trends
      </h1>

      <p className="text-gray-400 mt-2 mb-8">
        Analyze how benchmark performance changes across OpenVINO versions.
      </p>

      <div className="mb-8">

        <label className="block mb-2 font-semibold">
          Select Model
        </label>

        <select
          className="bg-slate-800 border border-slate-700 rounded-lg p-3"
          value={selectedModel}
          onChange={(e) => setSelectedModel(e.target.value)}
        >

          <option value="">Choose Model</option>

          {models.map((model) => (
            <option key={model} value={model}>
              {model}
            </option>
          ))}

        </select>

      </div>

      {trend.length > 0 && (
        <PerformanceChart data={trend} />
      )}

    </main>
  );
}