"use client";

import { useEffect, useState } from "react";
import { getModels, getRecommendation } from "@/libs/api";

export default function RecommendationsPage() {

  const [models, setModels] = useState<string[]>([]);
  const [selectedModel, setSelectedModel] = useState("");
  const [recommendation, setRecommendation] = useState<any>(null);

  useEffect(() => {
    getModels().then((data) => {
      setModels(data.models || []);
    });
  }, []);

  const loadRecommendation = async () => {
    const data = await getRecommendation(selectedModel);

    if (data.success) {
      setRecommendation(data);
    } else {
      alert(data.message);
    }
  };

  return (
    <main className="min-h-screen bg-slate-950 text-white p-10">

      <h1 className="text-4xl font-bold">
        Recommendations
      </h1>

      <p className="text-gray-400 mt-2 mb-8">
        Find the best OpenVINO version for every model.
      </p>

      <select
        className="bg-slate-800 border border-slate-700 rounded-lg p-3 w-full max-w-md"
        value={selectedModel}
        onChange={(e) => {
          setSelectedModel(e.target.value);
          setRecommendation(null);
        }}
      >
        <option value="">Select Model</option>

        {models.map((model) => (
          <option key={model} value={model}>
            {model}
          </option>
        ))}
      </select>

      <button
        onClick={loadRecommendation}
        className="mt-6 bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-lg"
      >
        Get Recommendation
      </button>

      {recommendation && (

        <div className="mt-10 bg-slate-900 rounded-xl border border-slate-700 p-6">

          <h2 className="text-2xl font-bold mb-5">
            Recommended Configuration
          </h2>

          <p><strong>Model:</strong> {recommendation.model}</p>

          <p><strong>Version:</strong> {recommendation.recommended_version}</p>

          <p><strong>Hardware:</strong> {recommendation.recommended_hardware}</p>

          <p className="text-green-400">
            <strong>Best FPS:</strong> {Number(recommendation.best_fps).toFixed(2)}
          </p>

          <p className="text-cyan-400">
            <strong>Latency:</strong> {Number(recommendation.latency).toFixed(2)} ms
          </p>

          <div className="mt-5 rounded-lg bg-green-900/20 border border-green-700 p-4">
            💡 {recommendation.reason}
          </div>

        </div>

      )}

    </main>
  );
}