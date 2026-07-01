"use client";

import { useEffect, useState } from "react";

import BenchmarkCard from "@/compnents/BenchmarkCard";

import {
  getModels,
  getVersions,
  getHardware,
  getBenchmark,
} from "@/libs/api";

export default function ExplorerPage() {
  const [models, setModels] = useState<string[]>([]);
  const [versions, setVersions] = useState<string[]>([]);
  const [hardware, setHardware] = useState<string[]>([]);

  const [selectedModel, setSelectedModel] = useState("");
  const [selectedVersion, setSelectedVersion] = useState("");
  const [selectedHardware, setSelectedHardware] = useState("");

  const [benchmark, setBenchmark] = useState<any>(null);

  // Load Models
  useEffect(() => {
    getModels()
      .then((data) => setModels(data.models || []))
      .catch(console.error);
  }, []);

  // Load Versions
  useEffect(() => {
    if (!selectedModel) return;

    getVersions(selectedModel)
      .then((data) => setVersions(data.versions || []))
      .catch(console.error);
  }, [selectedModel]);

  // Load Hardware
  useEffect(() => {
    if (!selectedModel) return;

    getHardware(selectedModel)
      .then((data) => setHardware(data.hardware || []))
      .catch(console.error);
  }, [selectedModel]);

  // Load Benchmark
  const loadBenchmark = async () => {
    const data = await getBenchmark(
      selectedModel,
      selectedVersion,
      selectedHardware
    );

    if (data.success) {
      setBenchmark(data.benchmark);
    } else {
      setBenchmark(null);
      alert(data.message);
    }
  };

  return (
    <main className="min-h-screen bg-slate-950 text-white p-10">

      <h1 className="text-4xl font-bold">
        Benchmark Explorer
      </h1>

      <p className="text-gray-400 mt-2 mb-8">
        Explore benchmark performance for any model,
        hardware and OpenVINO version.
      </p>

      {/* Model */}

      <div className="mb-6">
        <label className="block mb-2 font-semibold">
          Select Model
        </label>

        <select
          className="w-full max-w-md rounded-lg border border-slate-700 bg-slate-900 p-3"
          value={selectedModel}
          onChange={(e) => {
            setSelectedModel(e.target.value);
            setSelectedVersion("");
            setSelectedHardware("");
            setBenchmark(null);
          }}
        >
          <option value="">Choose Model</option>

          {models.map((model) => (
            <option key={model} value={model}>
              {model}
            </option>
          ))}
        </select>
      </div>

      {/* Version */}

      {selectedModel && (
        <div className="mb-6">
          <label className="block mb-2 font-semibold">
            Select Version
          </label>

          <select
            className="w-full max-w-md rounded-lg border border-slate-700 bg-slate-900 p-3"
            value={selectedVersion}
            onChange={(e) => {
              setSelectedVersion(e.target.value);
              setBenchmark(null);
            }}
          >
            <option value="">Choose Version</option>

            {versions.map((version) => (
              <option key={version} value={version}>
                {version}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Hardware */}

      {selectedVersion && (
        <div className="mb-6">
          <label className="block mb-2 font-semibold">
            Select Hardware
          </label>

          <select
            className="w-full max-w-md rounded-lg border border-slate-700 bg-slate-900 p-3"
            value={selectedHardware}
            onChange={(e) => {
              setSelectedHardware(e.target.value);
              setBenchmark(null);
            }}
          >
            <option value="">Choose Hardware</option>

            {hardware.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Button */}

      {selectedHardware && (
        <button
          onClick={loadBenchmark}
          className="rounded-lg bg-blue-600 px-6 py-3 font-semibold hover:bg-blue-700 transition"
        >
          Show Benchmark
        </button>
      )}

      {/* Current Selection */}

      {selectedModel && (
        <div className="mt-8 rounded-xl border border-slate-700 bg-slate-900 p-5 max-w-xl">

          <h2 className="font-semibold mb-3">
            Current Selection
          </h2>

          <p>
            <strong>Model:</strong> {selectedModel}
          </p>

          {selectedVersion && (
            <p>
              <strong>Version:</strong> {selectedVersion}
            </p>
          )}

          {selectedHardware && (
            <p>
              <strong>Hardware:</strong> {selectedHardware}
            </p>
          )}

        </div>
      )}

      {/* Benchmark Card */}

      {benchmark && (
        <div className="mt-10">
          <BenchmarkCard benchmark={benchmark} />
        </div>
      )}

    </main>
  );
}