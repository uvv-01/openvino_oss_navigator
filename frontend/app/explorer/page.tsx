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

  useEffect(() => {
    getModels()
      .then((data) => setModels(data.models || []))
      .catch(console.error);
  }, []);

  useEffect(() => {
    if (!selectedModel) return;

    getVersions(selectedModel)
      .then((data) => setVersions(data.versions || []))
      .catch(console.error);

    getHardware(selectedModel)
      .then((data) => setHardware(data.hardware || []))
      .catch(console.error);
  }, [selectedModel]);

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
    <main className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-black text-white p-10">

      <div className="max-w-7xl mx-auto">

        <div className="mb-12">

          <h1 className="text-5xl font-extrabold">
            Benchmark Explorer
          </h1>

          <p className="mt-4 max-w-3xl text-lg text-slate-300 leading-8">
            Search benchmark results across AI models, OpenVINO releases and
            supported hardware platforms.
          </p>

        </div>

        <div className="grid lg:grid-cols-2 gap-6">

          <div>

            <label className="block mb-2 font-semibold">
              Model
            </label>

            <select
              className="w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 focus:border-cyan-400 focus:outline-none"
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

          <div>

            <label className="block mb-2 font-semibold">
              OpenVINO Version
            </label>

            <select
              className="w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 focus:border-cyan-400 focus:outline-none"
              value={selectedVersion}
              onChange={(e) => {
                setSelectedVersion(e.target.value);
                setBenchmark(null);
              }}
              disabled={!selectedModel}
            >
              <option value="">Choose Version</option>

              {versions.map((version) => (
                <option key={version} value={version}>
                  {version}
                </option>
              ))}
            </select>

          </div>

          <div>

            <label className="block mb-2 font-semibold">
              Hardware
            </label>

            <select
              className="w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 focus:border-cyan-400 focus:outline-none"
              value={selectedHardware}
              onChange={(e) => {
                setSelectedHardware(e.target.value);
                setBenchmark(null);
              }}
              disabled={!selectedVersion}
            >
              <option value="">Choose Hardware</option>

              {hardware.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>

          </div>

          <div className="flex items-end">

            <button
              onClick={loadBenchmark}
              disabled={!selectedHardware}
              className="w-full rounded-xl bg-cyan-500 px-6 py-3 font-semibold text-black hover:bg-cyan-400 transition disabled:cursor-not-allowed disabled:bg-slate-700 disabled:text-slate-400"
            >
              🔍 Search Benchmark
            </button>

          </div>

        </div>

        {selectedModel && (

          <div className="mt-10 rounded-2xl border border-slate-700 bg-slate-900/70 backdrop-blur-md p-6">

            <h2 className="text-xl font-bold mb-5">
              Current Selection
            </h2>

            <div className="grid md:grid-cols-3 gap-6">

              <div>

                <p className="text-sm text-slate-400">
                  Model
                </p>

                <p className="mt-1 font-semibold">
                  {selectedModel}
                </p>

              </div>

              <div>

                <p className="text-sm text-slate-400">
                  Version
                </p>

                <p className="mt-1 font-semibold">
                  {selectedVersion || "-"}
                </p>

              </div>

              <div>

                <p className="text-sm text-slate-400">
                  Hardware
                </p>

                <p className="mt-1 font-semibold">
                  {selectedHardware || "-"}
                </p>

              </div>

            </div>

          </div>

        )}

        {benchmark && (

          <div className="mt-12">

            <BenchmarkCard benchmark={benchmark} />

          </div>

        )}

      </div>

    </main>
  );
}