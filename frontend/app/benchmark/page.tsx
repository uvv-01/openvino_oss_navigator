'use client';

import { useState } from 'react';

export default function BenchmarkPage() {
  const [model, setModel] = useState('');
  const [hardware, setHardware] = useState('');
  const [oldVersion, setOldVersion] = useState('');
  const [newVersion, setNewVersion] = useState('');
  const [result, setResult] = useState<any>(null);

  const handleCompare = async () => {
    try {console.log({
  model,
  hardware,
  oldVersion,
  newVersion,
});
      
      const response = await fetch(
        'http://127.0.0.1:8001/benchmark/version-compare',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model,
            hardware,
            old_version: oldVersion,
            new_version: newVersion,
          }),
        }
      );

      const data = await response.json();

      console.log(data);

      setResult(data);
    } catch (error) {
      console.error(error);
      alert('Failed to connect to backend');
    }
  };

  return (
    <main className="p-10">
      <h1 className="text-3xl font-bold mb-6">
        Benchmark Comparison
      </h1>

      <div className="space-y-4 max-w-lg">
        <input
          className="w-full border p-3 rounded"
          placeholder="Model (e.g. resnet50)"
          value={model}
          onChange={(e) => setModel(e.target.value)}
        />

        <input
          className="w-full border p-3 rounded"
          placeholder="Hardware (e.g. Intel Arc A770)"
          value={hardware}
          onChange={(e) => setHardware(e.target.value)}
        />

        <input
          className="w-full border p-3 rounded"
          placeholder="Old Version (e.g. 2025.2)"
          value={oldVersion}
          onChange={(e) => setOldVersion(e.target.value)}
        />

        <input
          className="w-full border p-3 rounded"
          placeholder="New Version (e.g. 2025.3)"
          value={newVersion}
          onChange={(e) => setNewVersion(e.target.value)}
        />

        <button
          onClick={handleCompare}
          className="bg-blue-600 text-white px-6 py-3 rounded"
        >
          Compare
        </button>
      </div>

      {result?.success && (
        <div className="mt-8 border p-6 rounded">
          <h2 className="text-xl font-bold mb-4">
            Comparison Result
          </h2>

          <p>
            FPS Change:
            <strong> {result.comparison.fps_change}%</strong>
          </p>

          <p>
            Latency Change:
            <strong> {result.comparison.latency_change}%</strong>
          </p>

          <p>
            Status:
            <strong> {result.comparison.status}</strong>
          </p>
        </div>
      )}
    </main>
  );
}