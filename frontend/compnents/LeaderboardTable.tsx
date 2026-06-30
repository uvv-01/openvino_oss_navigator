type Entry = {
  rank: number;
  model: string;
  hardware: string;
  fps: number;
};

export default function LeaderboardTable({
  data,
}: {
  data: Entry[];
}) {
  return (
    <div className="bg-slate-800 rounded-xl p-6 mt-10">

      <h2 className="text-2xl font-bold mb-4">
        🏆 Top Benchmarks
      </h2>

      <table className="w-full">

        <thead>

          <tr className="text-left border-b border-slate-700">

            <th>Rank</th>

            <th>Model</th>

            <th>Hardware</th>

            <th>FPS</th>

          </tr>

        </thead>

        <tbody>

          {data.map((item) => (

            <tr
              key={item.rank}
              className="border-b border-slate-700"
            >

              <td>{item.rank}</td>

              <td>{item.model}</td>

              <td>{item.hardware}</td>

              <td>{item.fps}</td>

            </tr>

          ))}

        </tbody>

      </table>

    </div>
  );
}