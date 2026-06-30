import LeaderboardTable from "@/compnents/LeaderboardTable";
import StatCard from "@/compnents/StatCard";
import { getLeaderboard, getStats } from "@/libs/api";
import PerformanceChart from "@/compnents/PerformanceChart";
import { getTrend } from "@/libs/api";

export default async function Home() {

    const stats = await getStats();
    const leaderboard = await getLeaderboard();
    const trend = await getTrend("resnet-50");
     
    return (
        <main className="p-10 min-h-screen bg-slate-950 text-white">

            <h1 className="text-4xl font-bold">
                OpenVINO OSS Navigator
            </h1>

            <p className="mt-4 text-gray-400">
                Explore OpenVINO benchmark performance across models,
                hardware and releases.
            </p>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-10">

                <StatCard
                    title="Benchmarks"
                    value={stats.total_benchmarks}
                />

                <StatCard
                    title="Models"
                    value={stats.total_models}
                />

                <StatCard
                    title="Versions"
                    value={stats.total_versions}
                />

                <StatCard
                    title="Hardware"
                    value={stats.total_hardware}
                />

            </div>

            {/* Leaderboard */}
            <div className="mt-12">

                <LeaderboardTable
                    data={leaderboard.leaderboard.slice(0, 5)}
                />

            </div>
            <div className="mt-12">
              <PerformanceChart
                 data={trend.trend}
               />
</div>

        </main>
    );
}