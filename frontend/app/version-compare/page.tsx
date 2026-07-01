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
    getModels().then((data) => {
      setModels(data.models || []);
    });
  }, []);

  useEffect(() => {
    if (!selectedModel) return;

    getVersions(selectedModel).then((data) => {
      setVersions(data.versions || []);
    });

    getHardware(selectedModel).then((data) => {
      setHardware(data.hardware || []);
    });
  }, [selectedModel]);

  const compare = async () => {
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

    <h1 className="text-4xl font-bold">
      Version Comparison
    </h1>

    <p className="text-gray-400 mt-2 mb-8">
      Compare benchmark performance between two OpenVINO releases.
    </p>

    <div className="grid md:grid-cols-2 gap-6">

      {/* Model */}
      <div>
        <label className="block mb-2 font-semibold">
          Model
        </label>

        <select
          className="w-full rounded-lg bg-slate-800 border border-slate-700 p-3"
          value={selectedModel}
          onChange={(e) => {
            setSelectedModel(e.target.value);
            setOldVersion("");
            setNewVersion("");
            setSelectedHardware("");
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

      {/* Hardware */}
      <div>
        <label className="block mb-2 font-semibold">
          Hardware
        </label>

        <select
          className="w-full rounded-lg bg-slate-800 border border-slate-700 p-3"
          value={selectedHardware}
          onChange={(e) => setSelectedHardware(e.target.value)}
        >
          <option value="">Select Hardware</option>

          {hardware.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>
      </div>

      {/* Old Version */}
      <div>
        <label className="block mb-2 font-semibold">
          Old Version
        </label>

        <select
          className="w-full rounded-lg bg-slate-800 border border-slate-700 p-3"
          value={oldVersion}
          onChange={(e) => setOldVersion(e.target.value)}
        >
          <option value="">Select Version</option>

          {versions.map((version) => (
            <option key={version} value={version}>
              {version}
            </option>
          ))}
        </select>
      </div>

      {/* New Version */}
      <div>
        <label className="block mb-2 font-semibold">
          New Version
        </label>

        <select
          className="w-full rounded-lg bg-slate-800 border border-slate-700 p-3"
          value={newVersion}
          onChange={(e) => setNewVersion(e.target.value)}
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
      onClick={compare}
      className="mt-8 bg-blue-600 hover:bg-blue-700 transition px-6 py-3 rounded-lg font-semibold"
    >
      Compare Versions
    </button>

    {result && (
      <div className="mt-10 bg-slate-900 border border-slate-700 rounded-xl p-6">

        <h2 className="text-2xl font-bold mb-6">
          Comparison Result
        </h2>

        <div className="grid md:grid-cols-2 gap-6">

          <div className="bg-slate-800 rounded-lg p-5">
            <h3 className="font-bold mb-4">
              Old Version
            </h3>

            <p>Version: {result.old.openvino_version}</p>
            <p>FPS: {result.old.fps}</p>
            <p>Latency: {result.old.latency}</p>
          </div>

          <div className="bg-slate-800 rounded-lg p-5">
            <h3 className="font-bold mb-4">
              New Version
            </h3>

            <p>Version: {result.new.openvino_version}</p>
            <p>FPS: {result.new.fps}</p>
            <p>Latency: {result.new.latency}</p>
          </div>

        </div>

        <div className="mt-8 bg-slate-800 rounded-lg p-5">

          <h3 className="font-bold mb-4">
            Performance Difference
          </h3>

          <p>
            FPS Change:
            {" "}
            <span className="text-green-400 font-bold">
              {result.comparison.fps_change_percent}%
            </span>
          </p>

          <p className="mt-2">
            Latency Change:
            {" "}
            <span className="text-blue-400 font-bold">
              {result.comparison.latency_change_percent}%
            </span>
          </p>

        </div>

      </div>
    )}

  </main>
);
}