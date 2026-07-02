"use client";

import { useEffect, useState } from "react";
import {
  getModels,
  getVersions,
  getHardware,
  compareVersions,
} from "@/libs/api";

export default function VersionComparePage() {
  const [models, setModels] = useState<string[]>([]);
  const [versions, setVersions] = useState<string[]>([]);
  const [hardware, setHardware] = useState<string[]>([]);

  const [selectedModel, setSelectedModel] = useState("");
  const [selectedHardware, setSelectedHardware] = useState("");

  const [oldVersion, setOldVersion] = useState("");
  const [newVersion, setNewVersion] = useState("");

  const [result, setResult] = useState<any>(null);

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

  const compare = async () => {
    if (oldVersion === newVersion) {
      alert("Please choose two different OpenVINO versions.");
      return;
    }

    const data = await compareVersions(
      selectedModel,
      selectedHardware,
      oldVersion,
      newVersion
    );

    if (data.success) {
      setResult(data);
    } else {
      alert(data.message);
    }
  };

  return (
    <main className="min-h-screen bg-slate-950 text-white p-10">
      <h1 className="text-4xl font-bold">Version Comparison</h1>

      <p className="mt-2 mb-8 text-gray-400">
        Compare benchmark performance between two OpenVINO releases.
      </p>

      <div className="grid gap-6 md:grid-cols-2">
        <div>
          <label className="mb-2 block font-semibold">Model</label>

          <select
            className="w-full rounded-lg border border-slate-700 bg-slate-900 p-3"
            value={selectedModel}
            onChange={(e) => {
              setSelectedModel(e.target.value);
              setSelectedHardware("");
              setOldVersion("");
              setNewVersion("");
              setResult(null);
            }}
          >
            <option value="">Select Model</option>

            {models.map((model) => (
              <option key={model} value={model}>
                {model}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="mb-2 block font-semibold">Hardware</label>

          <select
            className="w-full rounded-lg border border-slate-700 bg-slate-900 p-3"
            value={selectedHardware}
            onChange={(e) => {
              setSelectedHardware(e.target.value);
              setResult(null);
            }}
          >
            <option value="">Select Hardware</option>

            {hardware.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="mb-2 block font-semibold">Old Version</label>

          <select
            className="w-full rounded-lg border border-slate-700 bg-slate-900 p-3"
            value={oldVersion}
            onChange={(e) => {
              setOldVersion(e.target.value);
              setResult(null);
            }}
          >
            <option value="">Select Version</option>

            {versions.map((version) => (
              <option key={version} value={version}>
                {version}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="mb-2 block font-semibold">New Version</label>

          <select
            className="w-full rounded-lg border border-slate-700 bg-slate-900 p-3"
            value={newVersion}
            onChange={(e) => {
              setNewVersion(e.target.value);
              setResult(null);
            }}
          >
            <option value="">Select Version</option>

            {versions.map((version) => (
              <option key={version} value={version}>
                {version}
              </option>
            ))}
          </select>
        </div>
      </div>

      <button
        disabled={
          !selectedModel ||
          !selectedHardware ||
          !oldVersion ||
          !newVersion
        }
        onClick={compare}
        className="mt-8 rounded-lg bg-blue-600 px-6 py-3 font-semibold transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-slate-700"
      >
        Compare Versions
      </button>

      {result && (
        <div className="mt-10 rounded-xl border border-slate-700 bg-slate-900 p-6">
          <h2 className="mb-6 text-2xl font-bold">
            Comparison Result
          </h2>

          <div className="grid gap-6 md:grid-cols-2">
            <div className="rounded-lg bg-slate-800 p-5">
              <h3 className="mb-4 text-lg font-bold text-cyan-400">
                Old Version
              </h3>

              <p>
                <strong>Version:</strong> {result.old.openvino_version}
              </p>

              <p>
                <strong>FPS:</strong> {Number(result.old.fps).toFixed(2)}
              </p>

              <p>
                <strong>Latency:</strong>{" "}
                {Number(result.old.latency).toFixed(2)} ms
              </p>
            </div>

            <div className="rounded-lg bg-slate-800 p-5">
              <h3 className="mb-4 text-lg font-bold text-green-400">
                New Version
              </h3>

              <p>
                <strong>Version:</strong> {result.new.openvino_version}
              </p>

              <p>
                <strong>FPS:</strong> {Number(result.new.fps).toFixed(2)}
              </p>

              <p>
                <strong>Latency:</strong>{" "}
                {Number(result.new.latency).toFixed(2)} ms
              </p>
            </div>
          </div>

          <div className="mt-8 rounded-lg bg-slate-800 p-5">
            <h3 className="mb-4 text-lg font-bold">
              Performance Difference
            </h3>

            <div className="space-y-2">
              <p>
                <strong>FPS Change:</strong>{" "}
                <span className="font-bold text-green-400">
                  {Number(result.comparison.fps_change_percent).toFixed(2)}%
                </span>
              </p>

              <p>
                <strong>Latency Change:</strong>{" "}
                <span className="font-bold text-cyan-400">
                  {Number(result.comparison.latency_change_percent).toFixed(2)}%
                </span>
              </p>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}