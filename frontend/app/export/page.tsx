"use client";

import { useEffect, useState } from "react";

export default function ExportPage() {
  const [benchmarks, setBenchmarks] = useState<any[]>([]);

  useEffect(() => {
    fetch("http://127.0.0.1:8001/benchmark/export")
      .then((response) => response.json())
      .then((data) => {
        setBenchmarks(data);
      });
  }, []);

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">
        Export Benchmarks
      </h1>

      <table className="border-collapse border border-gray-300 w-full">
        <thead>
          <tr className="bg-gray-100">
            <th className="border p-3">Model</th>
            <th className="border p-3">Version</th>
            <th className="border p-3">Hardware</th>
            <th className="border p-3">FPS</th>
            <th className="border p-3">Latency</th>
          </tr>
        </thead>

        <tbody>
          {benchmarks.map((item, index) => (
            <tr key={index}>
              <td className="border p-3">{item.model}</td>
              <td className="border p-3">{item.version}</td>
              <td className="border p-3">{item.hardware}</td>
              <td className="border p-3">{item.fps}</td>
              <td className="border p-3">{item.latency}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}