type StatCardProps = {
  title: string;
  value: number | string;
};

export default function StatCard({
  title,
  value,
}: StatCardProps) {
  return (
    <div className="rounded-xl bg-slate-800 p-6 shadow-lg hover:shadow-cyan-500/30 transition">

      <h3 className="text-gray-400 text-sm">
        {title}
      </h3>

      <p className="text-3xl font-bold text-cyan-400 mt-2">
        {value}
      </p>

    </div>
  );
}