import { useEffect, useState, useCallback } from "react";
import { RefreshCw } from "lucide-react";
import { api } from "../api.js";
import StatCard from "../components/StatCard.jsx";
import StatusBadge from "../components/StatusBadge.jsx";

export default function Dashboard() {
  const [overview, setOverview] = useState(null);
  const [daily, setDaily] = useState([]);
  const [recent, setRecent] = useState([]);
  const [checking, setChecking] = useState(false);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    try {
      const [ov, d, r] = await Promise.all([
        api.getOverview(),
        api.getDaily(14),
        api.getRecentSends(),
      ]);
      setOverview(ov);
      setDaily(d);
      setRecent(r);
    } catch (err) {
      setError(err.message);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function handleCheckReplies() {
    setChecking(true);
    setError("");
    try {
      await api.checkReplies();
      await load();
    } catch (err) {
      setError(err.message);
    } finally {
      setChecking(false);
    }
  }

  const maxSent = Math.max(1, ...daily.map((d) => d.sent));

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display text-2xl font-extrabold">Dashboard</h1>
        <button
          onClick={handleCheckReplies}
          disabled={checking}
          className="flex items-center gap-2 text-sm px-3 py-2 rounded-lg bg-card hover:bg-card-hover border border-white/10 disabled:opacity-50"
        >
          <RefreshCw size={14} className={checking ? "animate-spin" : ""} />
          {checking ? "Checking replies…" : "Check replies now"}
        </button>
      </div>

      {error && (
        <div className="mb-4 text-sm text-red-300 bg-red-500/10 border border-red-500/30 rounded-lg px-4 py-2">
          {error}
        </div>
      )}

      {overview && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <StatCard label="Sent today" value={overview.sentToday} />
          <StatCard label="Total sent" value={overview.totalSent} />
          <StatCard label="Reply rate" value={`${overview.replyRate}%`} sub={`${overview.totalReplied} replies`} />
          <StatCard label="Awaiting reply" value={overview.pendingReplies} />
          <StatCard label="Total leads" value={overview.totalLeads} />
          <StatCard label="New / unqueued" value={overview.newLeads} />
        </div>
      )}

      <div className="bg-card rounded-xl border border-white/5 p-5 mb-8">
        <div className="text-sm font-medium mb-4 text-bone/70">Sends — last 14 days</div>
        <div className="flex items-end gap-2 h-32">
          {daily.length === 0 && <div className="text-sm text-bone/40">No sends yet.</div>}
          {daily.map((d) => (
            <div key={d.day} className="flex-1 flex flex-col items-center gap-1 group">
              <div className="w-full flex flex-col justify-end h-24">
                <div
                  className="w-full bg-lime/80 group-hover:bg-lime rounded-t"
                  style={{ height: `${(d.sent / maxSent) * 100}%` }}
                  title={`${d.sent} sent, ${d.replied} replied`}
                />
              </div>
              <div className="text-[10px] text-bone/40 rotate-0">{d.day.slice(5)}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-card rounded-xl border border-white/5 p-5">
        <div className="text-sm font-medium mb-4 text-bone/70">Recent activity</div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-bone/40 border-b border-white/10">
                <th className="py-2 pr-4">Brand</th>
                <th className="py-2 pr-4">Subject</th>
                <th className="py-2 pr-4">Status</th>
                <th className="py-2 pr-4">Sent</th>
              </tr>
            </thead>
            <tbody>
              {recent.map((s) => (
                <tr key={s.id} className="border-b border-white/5">
                  <td className="py-2 pr-4">{s.brand_name}</td>
                  <td className="py-2 pr-4 max-w-xs truncate">{s.subject}</td>
                  <td className="py-2 pr-4">
                    <StatusBadge status={s.status} />
                  </td>
                  <td className="py-2 pr-4 text-bone/50">{new Date(s.sent_at).toLocaleString()}</td>
                </tr>
              ))}
              {recent.length === 0 && (
                <tr>
                  <td colSpan={4} className="py-4 text-bone/40">
                    Nothing sent yet — head to Send to start your first batch.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
