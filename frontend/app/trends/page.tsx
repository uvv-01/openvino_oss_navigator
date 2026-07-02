"use client";

import { useEffect, useState } from "react";
import { getModels, getTrend } from "@/libs/api";
import PerformanceChart from "@/compnents/PerformanceChart";

export default function TrendsPage() {
  const [models, setModels] = useState<string[]>([]);
  const [selectedModel, setSelectedModel] = useState("");
  const [trend, setTrend] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function loadModels() {
      try {
        const data = await getModels();
        setModels(data.models || []);
      } catch (error) {
        console.error(error);
      }
    }

    loadModels();
  }, []);

  useEffect(() => {
    if (!selectedModel) {
      setTrend([]);
      return;
    }

    async function loadTrend() {
      setLoading(true);

      try {
        const data = await getTrend(selectedModel);

        if (data.success) {
          setTrend(data.trend || []);
        } else {
          setTrend([]);
        }
      } catch (error) {
        console.error(error);
        setTrend([]);
      } finally {
        setLoading(false);
      }
    }

    loadTrend();
  }, [selectedModel]);

  return (
    <main className="min-h-screen bg-slate-950 p-10 text-white">
      <h1 className="text-4xl font-bold">Performance Trends</h1>

      <p className="mt-2 mb-8 text-slate-400">
        Visualize how benchmark performance changes across OpenVINO versions.
      </p>

      <div className="max-w-md">
        <label className="mb-2 block font-semibold">
          Select Model
        </label>

        <select
          className="w-full rounded-xl border border-slate-700 bg-slate-900 p-3 text-white focus:border-cyan-500 focus:outline-none"
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

      {loading && (
        <div className="mt-12 text-lg text-slate-400">
          Loading performance trend...
        </div>
      )}

      {!loading && !selectedModel && (
        <div className="mt-16 rounded-xl border border-dashed border-slate-700 bg-slate-900 p-12 text-center text-slate-400">
          Select a model to view its FPS trend across OpenVINO versions.
        </div>
      )}

      {!loading && selectedModel && trend.length > 0 && (
        <div className="mt-10">
          <PerformanceChart data={trend} />
        </div>
      )}

      {!loading && selectedModel && trend.length === 0 && (
        <div className="mt-12 rounded-xl border border-slate-700 bg-slate-900 p-8 text-center text-slate-400">
          No benchmark trend available for this model.
        </div>
      )}
    </main>
  );
}