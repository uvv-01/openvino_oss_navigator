"use client";

import { useEffect, useState } from "react";

export default function ExplorerPage() {
  const [models, setModels] = useState<string[]>([]);
  const [selectedModel, setSelectedModel] = useState("");

  const [versions, setVersions] = useState<string[]>([]);
  const [selectedVersion, setSelectedVersion] = useState("");

  const [hardware, setHardware] = useState<string[]>([]);
  const [selectedHardware, setSelectedHardware] = useState("");

  const [benchmark, setBenchmark] = useState<any>(null);

  useEffect(() => {
    fetch("http://127.0.0.1:8001/benchmark/models")
      .then((res) => res.json())
      .then((data) => {
        setModels(data.models || []);
      })
      .catch(console.error);
  }, []);

  useEffect(() => {
    if (!selectedModel) return;

    fetch(`http://127.0.0.1:8001/benchmark/versions/${selectedModel}`)
      .then((res) => res.json())
      .then((data) => {
        setVersions(data.versions || []);
      })
      .catch(console.error);
  }, [selectedModel]);

  useEffect(() => {
    if (!selectedModel) return;

    fetch(`http://127.0.0.1:8001/benchmark/hardware/${selectedModel}`)
      .then((res) => res.json())
      .then((data) => {
        setHardware(data.hardware || []);
      })
      .catch(console.error);
  }, [selectedModel]);

  const loadBenchmark = async () => {
    try {
      const response = await fetch(
        "http://127.0.0.1:8001/benchmark/details"
      );
      const data = await response.json();

      const result = data.find(
        (item: any) =>
          item.model === selectedModel &&
          item.openvino_version === selectedVersion &&
          item.hardware === selectedHardware
      );

      setBenchmark(result || null);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Benchmark Explorer</h1>

      {/* Model Selector */}
      <div className="mb-4">
        <label className="block mb-2 font-semibold">
          Select Model
        </label>

        <select
          className="border rounded p-2"
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

      {/* Version Selector */}
      {selectedModel && (
        <div className="mb-4">
          <label className="block mb-2 font-semibold">
            Select Version
          </label>

          <select
            className="border rounded p-2"
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

      {/* Hardware Selector */}
      {selectedVersion && (
        <div className="mb-4">
          <label className="block mb-2 font-semibold">
            Select Hardware
          </label>

          <select
            className="border rounded p-2"
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
          className="bg-blue-600 text-white px-4 py-2 rounded mb-6"
        >
          Show Benchmark
        </button>
      )}

      {/* Selection Summary */}
      {selectedModel && (
        <div className="mt-4 border rounded-lg p-4">
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

      {/* Benchmark Output */}
      {benchmark && (
        <div className="mt-6 border rounded-lg p-4 shadow">
          <h2 className="text-xl font-bold mb-3">
            Benchmark Details
          </h2>

          <p>
            <strong>FPS:</strong> {benchmark.fps}
          </p>

          <p>
            <strong>Latency:</strong> {benchmark.latency}
          </p>
        </div>
      )}
    </div>
  );
}