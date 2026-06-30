const BASE_URL = "http://127.0.0.1:8000";

export async function getStats() {
    const response = await fetch(
        `${BASE_URL}/benchmark/stats`
    );

    return response.json();
}

export async function getLeaderboard() {
    const response = await fetch(
        `${BASE_URL}/benchmark/leaderboard`
    );

    return response.json();
}

export async function getBestFPS() {
    const response = await fetch(
        `${BASE_URL}/benchmark/best-fps`
    );

    return response.json();
}

export async function getBestLatency() {
    const response = await fetch(
        `${BASE_URL}/benchmark/best-latency`
    );

    return response.json();
}

export async function getTrend(model: string) {
    const res = await fetch(
        `http://127.0.0.1:8000/benchmark/trends/${model}`
    );

    return res.json();
}