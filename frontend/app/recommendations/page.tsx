"use client";

import { useEffect, useState } from "react";

export default function RecommendationsPage() {
  const [recommendation, setRecommendation] = useState<any>(null);

  useEffect(() => {
    fetch("http://127.0.0.1:8001/benchmark/recommend/resnet50")
      .then((response) => response.json())
      .then((data) => {
        setRecommendation(data);
      });
  }, []);

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">
        Benchmark Recommendations
      </h1>

      {!recommendation ? (
        <p>Loading...</p>
      ) : (
        <div className="border rounded-lg p-6 shadow max-w-2xl">

          <h2 className="text-2xl font-bold mb-4">
            Recommended Setup
          </h2>

          <p>
            <strong>Model:</strong>{" "}
            {recommendation.model}
          </p>

          <p>
            <strong>Version:</strong>{" "}
            {recommendation.recommended_version}
          </p>

          <p>
            <strong>Hardware:</strong>{" "}
            {recommendation.recommended_hardware}
          </p>

          <p>
            <strong>Best FPS:</strong>{" "}
            {recommendation.best_fps}
          </p>

          <p>
            <strong>Latency:</strong>{" "}
            {recommendation.latency} ms
          </p>

          <p className="mt-4 text-green-600 font-semibold">
            {recommendation.reason}
          </p>

        </div>
      )}
    </div>
  );
}