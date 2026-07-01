const BASE_URL = "http://127.0.0.1:8000";

// ================= Dashboard =================

export async function getStats() {
  const res = await fetch(`${BASE_URL}/benchmark/stats`);
  return res.json();
}

export async function getLeaderboard() {
  const res = await fetch(`${BASE_URL}/benchmark/model-leaderboard`);
  return res.json();
}

export async function getBestFPS() {
  const res = await fetch(`${BASE_URL}/benchmark/best-fps`);
  return res.json();
}

export async function getBestLatency() {
  const res = await fetch(`${BASE_URL}/benchmark/best-latency`);
  return res.json();
}

// ================= Explorer =================

export async function getModels() {
  const res = await fetch(`${BASE_URL}/benchmark/models`);
  return res.json();
}

export async function getVersions(model: string) {
  const res = await fetch(
    `${BASE_URL}/benchmark/versions/${encodeURIComponent(model)}`
  );

  return res.json();
}

export async function getHardware(model: string) {
  const res = await fetch(
    `${BASE_URL}/benchmark/hardware/${encodeURIComponent(model)}`
  );

  return res.json();
}

export async function getBenchmark(
  model: string,
  version: string,
  hardware: string
) {
  const res = await fetch(
    `${BASE_URL}/benchmark/details?model=${encodeURIComponent(
      model
    )}&version=${encodeURIComponent(
      version
    )}&hardware=${encodeURIComponent(hardware)}`
  );

  return res.json();
}

// ================= Trends =================

export async function getTrend(model: string) {
  const res = await fetch(
    `${BASE_URL}/benchmark/trends/${encodeURIComponent(model)}`
  );

  return res.json();
}

// ================= Version Compare =================

export async function compareVersions(
  model: string,
  hardware: string,
  oldVersion: string,
  newVersion: string
) {
  const res = await fetch(`${BASE_URL}/benchmark/version-compare`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model,
      hardware,
      old_version: oldVersion,
      new_version: newVersion,
    }),
  });

  return res.json();
}

// ================= Model Compare =================

export async function compareModels(
  model1: string,
  model2: string
) {
  const res = await fetch(
    `${BASE_URL}/benchmark/models-comparison?model1=${encodeURIComponent(
      model1
    )}&model2=${encodeURIComponent(model2)}`
  );

  return res.json();
}

export async function getRecommendation(model: string) {
  const res = await fetch(
    `${BASE_URL}/benchmark/recommend/${encodeURIComponent(model)}`
  );

  return res.json();
}

export async function exportBenchmarks() {
  const res = await fetch(`${BASE_URL}/benchmark/export`);
  return res.json();
}