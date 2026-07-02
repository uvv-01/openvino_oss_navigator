"use client";

import { useEffect, useState } from "react";
import { getModels, getRecommendation } from "@/libs/api";

export default function RecommendationsPage() {
  const [models, setModels] = useState<string[]>([]);
  const [selectedModel, setSelectedModel] = useState("");
  const [recommendation, setRecommendation] = useState<any>(null);
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

  const loadRecommendation = async () => {
    if (!selectedModel) {
      alert("Please select a model.");
      return;
    }

    setLoading(true);

    try {
      const data = await getRecommendation(selectedModel);

      if (data.success) {
        setRecommendation(data);
      } else {
        setRecommendation(null);
        alert(data.message);
      }
    } catch (error) {
      console.error(error);
      setRecommendation(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-950 p-10 text-white">
      <h1 className="text-4xl font-bold">
        Recommendation Engine
      </h1>

      <p className="mt-2 mb-8 text-slate-400">
        Discover the best OpenVINO version and hardware configuration for maximum performance.
      </p>

      <div className="max-w-md">
        <label className="mb-2 block font-semibold">
          Select Model
        </label>

        <select
          className="w-full rounded-xl border border-slate-700 bg-slate-900 p-3 text-white focus:border-cyan-500 focus:outline-none"
          value={selectedModel}
          onChange={(e) => {
            setSelectedModel(e.target.value);
            setRecommendation(null);
          }}
        >
          <option value="">Choose Model</option>

          {models.map((model) => (
            <option key={model} value={model}>
              {model}
            </option>
          ))}
        </select>

        <button
          onClick={loadRecommendation}
          className="mt-6 w-full rounded-xl bg-blue-600 px-6 py-3 font-semibold transition hover:bg-blue-700"
        >
          Get Recommendation
        </button>
      </div>

      {loading && (
        <div className="mt-12 text-lg text-slate-400">
          Generating recommendation...
        </div>
      )}

      {!loading && !recommendation && (
        <div className="mt-16 rounded-xl border border-dashed border-slate-700 bg-slate-900 p-12 text-center text-slate-400">
          Select a model to receive the optimal OpenVINO configuration.
        </div>
      )}

      {!loading && recommendation && (
        <div className="mt-10 rounded-2xl border border-slate-700 bg-slate-900 p-8 shadow-lg">
          <h2 className="mb-6 text-2xl font-bold">
            Recommended Configuration
          </h2>

          <div className="grid gap-6 md:grid-cols-2">
            <div className="rounded-xl bg-slate-800 p-5">
              <p className="text-slate-400">Model</p>
              <p className="mt-1 text-lg font-semibold">
                {recommendation.model}
              </p>
            </div>

            <div className="rounded-xl bg-slate-800 p-5">
              <p className="text-slate-400">Recommended Version</p>
              <p className="mt-1 text-lg font-semibold">
                {recommendation.recommended_version}
              </p>
            </div>

            <div className="rounded-xl bg-slate-800 p-5">
              <p className="text-slate-400">Hardware</p>
              <p className="mt-1 text-lg font-semibold">
                {recommendation.recommended_hardware}
              </p>
            </div>

            <div className="rounded-xl bg-slate-800 p-5">
              <p className="text-slate-400">Best FPS</p>
              <p className="mt-1 text-2xl font-bold text-green-400">
                {Number(recommendation.best_fps).toFixed(2)}
              </p>
            </div>

            <div className="rounded-xl bg-slate-800 p-5 md:col-span-2">
              <p className="text-slate-400">Latency</p>
              <p className="mt-1 text-2xl font-bold text-cyan-400">
                {Number(recommendation.latency).toFixed(2)} ms
              </p>
            </div>
          </div>

          <div className="mt-8 rounded-xl border border-green-700 bg-green-900/20 p-5">
            <h3 className="mb-2 font-bold text-green-400">
              Why this recommendation?
            </h3>

            <p className="text-slate-300">
              {recommendation.reason}
            </p>
          </div>
        </div>
      )}
    </main>
  );
}