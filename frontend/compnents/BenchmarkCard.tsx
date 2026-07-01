interface Props {
  benchmark: {
    model: string;
    openvino_version: string;
    hardware: string;
    fps: number;
    latency: number;
  };
}

export default function BenchmarkCard({ benchmark }: Props) {
  return (
    <div className="mt-8 rounded-xl border border-slate-700 bg-slate-900 p-6 shadow-lg">

      <h2 className="text-2xl font-bold mb-6">
        Benchmark Result
      </h2>

      <div className="grid md:grid-cols-2 gap-6">

        <div className="rounded-lg bg-slate-800 p-5">
          <p className="text-gray-400 text-sm">Model</p>
          <p className="text-lg font-semibold mt-1">
            {benchmark.model}
          </p>
        </div>

        <div className="rounded-lg bg-slate-800 p-5">
          <p className="text-gray-400 text-sm">OpenVINO Version</p>
          <p className="text-lg font-semibold mt-1">
            {benchmark.openvino_version}
          </p>
        </div>

        <div className="rounded-lg bg-slate-800 p-5">
          <p className="text-gray-400 text-sm">Hardware</p>
          <p className="text-lg font-semibold mt-1">
            {benchmark.hardware}
          </p>
        </div>

        <div className="rounded-lg bg-slate-800 p-5">
          <p className="text-gray-400 text-sm">FPS</p>
          <p className="text-3xl font-bold text-green-400 mt-2">
            {benchmark.fps}
          </p>
        </div>

        <div className="rounded-lg bg-slate-800 p-5">
          <p className="text-gray-400 text-sm">Latency</p>
          <p className="text-3xl font-bold text-blue-400 mt-2">
            {benchmark.latency} ms
          </p>
        </div>

      </div>

    </div>
  );
}