"use client";

import { useState } from "react";
import { exportBenchmarks } from "@/libs/api";

export default function ExportPage() {
  const [loading, setLoading] = useState(false);
  const [downloaded, setDownloaded] = useState(false);

  const downloadJSON = async () => {
    setLoading(true);
    setDownloaded(false);

    try {
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

      setDownloaded(true);
    } catch (error) {
      console.error(error);
      alert("Failed to export benchmark data.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-950 p-10 text-white">
      <h1 className="text-4xl font-bold">
        Export Benchmark Data
      </h1>

      <p className="mt-2 mb-10 text-slate-400">
        Download the complete OpenVINO benchmark dataset for offline analysis,
        reporting, or integration with external tools.
      </p>

      <div className="max-w-2xl rounded-2xl border border-slate-700 bg-slate-900 p-8 shadow-lg">
        <h2 className="text-2xl font-bold">
          JSON Export
        </h2>

        <p className="mt-3 text-slate-400">
          Export all benchmark records including model names, OpenVINO versions,
          hardware platforms, FPS, latency, and related benchmark metrics in
          JSON format.
        </p>

        <div className="mt-8 flex flex-wrap gap-4">
          <button
            onClick={downloadJSON}
            disabled={loading}
            className="rounded-xl bg-cyan-600 px-6 py-3 font-semibold transition hover:bg-cyan-700 disabled:cursor-not-allowed disabled:bg-slate-700"
          >
            {loading ? "Preparing Download..." : "Download JSON"}
          </button>

          {downloaded && (
            <div className="flex items-center rounded-xl border border-green-700 bg-green-900/20 px-5 py-3 text-green-400">
              ✓ Download completed successfully
            </div>
          )}
        </div>

        <div className="mt-8 rounded-xl border border-slate-700 bg-slate-800 p-5">
          <h3 className="mb-3 font-semibold">
            Export Includes
          </h3>

          <ul className="space-y-2 text-slate-300">
            <li>• Model information</li>
            <li>• OpenVINO versions</li>
            <li>• Hardware platforms</li>
            <li>• FPS metrics</li>
            <li>• Latency metrics</li>
            <li>• Complete benchmark records</li>
          </ul>
        </div>
      </div>
    </main>
  );
}