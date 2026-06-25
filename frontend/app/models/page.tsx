"use client";

import Link from "next/link";

import { useEffect, useState } from "react";

export default function ModelsPage() {
  const [models, setModels] = useState<string[]>([]);

  useEffect(() => {
    fetch("http://127.0.0.1:8001/benchmark/models")
      .then((response) => response.json())
      .then((data) => {
        setModels(data.models);
      });
  }, []);

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">
        Available Models
      </h1>

      <div className="grid grid-cols-3 gap-4">
        {models.map((model) => (
          <Link
  key={model}
  href={`/models/${model}`}
>
  <div className="border rounded-lg p-4 shadow hover:bg-gray-100 cursor-pointer">
    <h2 className="text-xl font-bold">
      {model}
    </h2>
  </div>
</Link>
        ))}
      </div>
    </div>
  );
}