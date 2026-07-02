"use client";

import { useEffect, useState } from "react";
import { Trophy } from "lucide-react";

import {
  getModels,
  compareModels as compareModelsAPI,
} from "@/libs/api";

export default function ModelsComparisonPage() {
  const [models, setModels] = useState<string[]>([]);
  const [model1, setModel1] = useState("");
  const [model2, setModel2] = useState("");
  const [comparison, setComparison] = useState<any>(null);

  useEffect(() => {
    getModels()
      .then((data) => setModels(data.models || []))
      .catch(console.error);
  }, []);

  const compareModels = async () => {
    if (!model1 || !model2) {
      alert("Please select both models.");
      return;
    }

    const data = await compareModelsAPI(model1, model2);

    if (data.success) {
      setComparison(data);
    } else {
      alert(data.message || "Comparison failed.");
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-black text-white p-10">

      <div className="max-w-7xl mx-auto">

        <div className="mb-12">

          <h1 className="text-5xl font-extrabold">
            Model Comparison
          </h1>

          <p className="mt-4 max-w-3xl text-lg text-slate-300 leading-8">
            Compare the benchmark performance of two AI models across all
            available OpenVINO benchmark results.
          </p>

        </div>

        <div className="grid lg:grid-cols-2 gap-6">

          <div>

            <label className="block mb-2 font-semibold">
              Model 1
            </label>

            <select
              className="w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 focus:border-cyan-400 focus:outline-none"
              value={model1}
              onChange={(e) => setModel1(e.target.value)}
            >
              <option value="">Choose Model</option>

              {models.map((model) => (
                <option key={model} value={model}>
                  {model}
                </option>
              ))}

            </select>

          </div>

          <div>

            <label className="block mb-2 font-semibold">
              Model 2
            </label>

            <select
              className="w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 focus:border-cyan-400 focus:outline-none"
              value={model2}
              onChange={(e) => setModel2(e.target.value)}
            >
              <option value="">Choose Model</option>

              {models.map((model) => (
                <option key={model} value={model}>
                  {model}
                </option>
              ))}

            </select>

          </div>

        </div>

        <button
          onClick={compareModels}
          className="mt-8 rounded-xl bg-cyan-500 px-6 py-3 font-semibold text-black hover:bg-cyan-400 transition"
        >
          Compare Models
        </button>

        {comparison && (

          <div className="mt-12">

            <h2 className="text-3xl font-bold mb-8">
              Comparison Result
            </h2>

            <div className="grid lg:grid-cols-2 gap-8">

              <div className="rounded-2xl border border-slate-700 bg-slate-900/70 backdrop-blur-md p-8">

                <h3 className="text-2xl font-bold mb-6">
                  {comparison.model1.name}
                </h3>

                <div className="space-y-5">

                  <div>
                    <p className="text-slate-400 text-sm">
                      Best FPS
                    </p>

                    <p className="text-4xl font-bold text-green-400">
                      {Number(comparison.model1.best_fps).toFixed(2)}
                    </p>
                  </div>

                  <div>
                    <p className="text-slate-400 text-sm">
                      Latency
                    </p>

                    <p className="text-3xl font-bold text-cyan-400">
                      {Number(comparison.model1.latency).toFixed(2)} ms
                    </p>
                  </div>

                </div>

              </div>

              <div className="rounded-2xl border border-slate-700 bg-slate-900/70 backdrop-blur-md p-8">

                <h3 className="text-2xl font-bold mb-6">
                  {comparison.model2.name}
                </h3>

                <div className="space-y-5">

                  <div>
                    <p className="text-slate-400 text-sm">
                      Best FPS
                    </p>

                    <p className="text-4xl font-bold text-green-400">
                      {Number(comparison.model2.best_fps).toFixed(2)}
                    </p>
                  </div>

                  <div>
                    <p className="text-slate-400 text-sm">
                      Latency
                    </p>

                    <p className="text-3xl font-bold text-cyan-400">
                      {Number(comparison.model2.latency).toFixed(2)} ms
                    </p>
                  </div>

                </div>

              </div>

            </div>

            <div className="mt-10 rounded-2xl border border-yellow-500/40 bg-yellow-500/10 p-6">

              <div className="flex items-center gap-3">

                <Trophy className="text-yellow-400" size={30} />

                <div>

                  <p className="text-sm text-slate-300">
                    Best Performing Model
                  </p>

                  <h3 className="text-3xl font-bold text-yellow-400">
                    {comparison.winner}
                  </h3>

                </div>

              </div>

            </div>

          </div>

        )}

      </div>

    </main>
  );
}