"use client";

import { exportBenchmarks } from "@/libs/api";

export default function ExportPage() {
  const downloadJSON = async () => {
    const data = await exportBenchmarks();

    const blob = new Blob(
      [JSON.stringify(data, null, 2)],
      {
        type: "application/json",
      }
    );

    const url = window.URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "openvino_benchmarks.json";
    a.click();

    window.URL.revokeObjectURL(url);
  };

  return (
    <main className="min-h-screen bg-slate-950 text-white p-10">

      <h1 className="text-4xl font-bold">
        Export Benchmarks
      </h1>

      <p className="text-gray-400 mt-2 mb-8">
        Download all benchmark data in JSON format.
      </p>

      <button
        onClick={downloadJSON}
        className="bg-cyan-600 hover:bg-cyan-700 px-6 py-3 rounded-lg font-semibold transition"
      >
        Download JSON
      </button>

    </main>
  );
}