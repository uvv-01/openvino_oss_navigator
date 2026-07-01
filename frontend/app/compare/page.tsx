"use client";

import { useState } from "react";

export default function ComparePage() {
  const [result, setResult] = useState<any>(null);

  async function compareVersions() {
    const response = await fetch(
      "http://127.0.0.1:8000/benchmark/models",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "resnet50",
          hardware: "Intel Arc A770",
          old_version: "2025.2",
          new_version: "2025.4",
        }),
      }
    );

    const data = await response.json();

    setResult(data);
  }

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">
        Version Comparison
      </h1>

      <button
        onClick={compareVersions}
        className="border rounded-lg px-4 py-2"
      >
        Compare Versions
      </button>

      {result && (
        <div className="mt-6 border rounded-lg p-6">

          <h2 className="text-2xl font-bold mb-4">
            Comparison Result
          </h2>

          <p>
            FPS Change:
            {" "}
            {result.comparison.fps_change}%
          </p>

          <p>
            Latency Change:
            {" "}
            {result.comparison.latency_change}%
          </p>

          <p>
            Status:
            {" "}
            {result.comparison.status}
          </p>

        </div>
      )}
    </div>
  );
}
