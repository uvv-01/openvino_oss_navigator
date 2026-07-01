"use client";

import { useEffect, useState } from "react";
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
    .then((data) => {
      setModels(data.models || []);
    })
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
        alert(data.message);
        }

    if (data.success) {
      setComparison(data);
    } else {
      alert("Comparison failed.");
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">
        Models Comparison
      </h1>

      <div className="grid grid-cols-2 gap-6">

        <div>
          <label className="block mb-2 font-semibold">
            Model 1
          </label>

          <select
            className="border rounded p-2 w-full"
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
            className="border rounded p-2 w-full"
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
        className="mt-6 bg-blue-600 text-white px-5 py-2 rounded"
      >
        Compare Models
      </button>

      {comparison && (
        <div className="mt-8 border rounded-lg p-6 shadow">

          <h2 className="text-2xl font-bold mb-4">
            Comparison Result
          </h2>

          <table className="table-auto border-collapse border w-full">

            <thead>
              <tr className="bg-gray-100">
                <th className="border p-2">Metric</th>
                <th className="border p-2">{comparison.model1.name}</th>
                <th className="border p-2">{comparison.model2.name}</th>
              </tr>
            </thead>

            <tbody>
              <tr>
                <td className="border p-2 font-semibold">
                  Best FPS
                </td>

                <td className="border p-2">
                  {comparison.model1.best_fps}
                </td>

                <td className="border p-2">
                  {comparison.model2.best_fps}
                </td>
              </tr>

              <tr>
                <td className="border p-2 font-semibold">
                  Latency
                </td>

                <td className="border p-2">
                  {comparison.model1.latency}
                </td>

                <td className="border p-2">
                  {comparison.model2.latency}
                </td>
              </tr>

            </tbody>

          </table>

          <div className="mt-6 text-xl font-bold text-green-600">
            Winner: {comparison.winner}
          </div>

        </div>
      )}
    </div>
  );
}