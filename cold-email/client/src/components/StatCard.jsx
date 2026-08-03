export default function StatCard({ label, value, sub }) {
  return (
    <div className="bg-card rounded-xl p-5 border border-white/5">
      <div className="text-xs uppercase tracking-wide text-bone/50 mb-2">{label}</div>
      <div className="font-display text-3xl font-extrabold">{value}</div>
      {sub && <div className="text-xs text-bone/40 mt-1">{sub}</div>}
    </div>
  );
}
