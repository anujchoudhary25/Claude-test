import { useEffect, useState } from "react";
import { Send as SendIcon } from "lucide-react";
import { api } from "../api.js";

export default function Send() {
  const [eligible, setEligible] = useState(0);
  const [batchSize, setBatchSize] = useState(20);
  const [gmail, setGmail] = useState(null);
  const [sending, setSending] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  async function load() {
    const [ec, status, settings] = await Promise.all([
      api.eligibleCount(),
      api.getGmailStatus(),
      api.getSettings(),
    ]);
    setEligible(ec.count);
    setGmail(status);
    setBatchSize(Number(settings.daily_batch_size) || 20);
  }

  useEffect(() => {
    load();
  }, []);

  async function handleSend() {
    setSending(true);
    setError("");
    setResult(null);
    try {
      const res = await api.sendBatch({ batchSize });
      setResult(res);
      await load();
    } catch (err) {
      setError(err.message);
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="max-w-2xl">
      <h1 className="font-display text-2xl font-extrabold mb-6">Send today's batch</h1>

      {!gmail?.connected && (
        <div className="mb-6 text-sm text-yellow-300 bg-yellow-500/10 border border-yellow-500/30 rounded-lg px-4 py-3">
          Gmail isn't connected yet. Go to Settings to connect the account you want to send from.
        </div>
      )}

      <div className="bg-card rounded-xl border border-white/5 p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="text-sm text-bone/50">Eligible leads right now</div>
            <div className="font-display text-3xl font-extrabold">{eligible}</div>
          </div>
          <div className="text-right">
            <div className="text-sm text-bone/50 mb-1">Batch size</div>
            <input
              type="number"
              min={1}
              max={100}
              value={batchSize}
              onChange={(e) => setBatchSize(Number(e.target.value))}
              className="w-24 bg-ink border border-white/10 rounded-lg px-3 py-1 text-sm text-right"
            />
          </div>
        </div>

        <button
          onClick={handleSend}
          disabled={sending || !gmail?.connected || eligible === 0}
          className="w-full flex items-center justify-center gap-2 bg-lime text-ink font-medium rounded-lg px-4 py-3 disabled:opacity-40"
        >
          <SendIcon size={16} />
          {sending ? "Sending…" : `Send to next ${Math.min(batchSize, eligible)} leads`}
        </button>
        <p className="text-xs text-bone/40 mt-3">
          Uses the most recently created active template, sent from {gmail?.email || "your connected Gmail"}.
          Each lead gets a cooldown before being re-contacted (configurable in Settings).
        </p>
      </div>

      {error && (
        <div className="mb-4 text-sm text-red-300 bg-red-500/10 border border-red-500/30 rounded-lg px-4 py-2">
          {error}
        </div>
      )}

      {result && (
        <div className="bg-card rounded-xl border border-white/5 p-6">
          <div className="font-medium mb-3">
            Sent {result.sent?.length || 0} · Failed {result.failed?.length || 0}
          </div>
          {result.sent?.length > 0 && (
            <ul className="text-sm text-bone/60 mb-3 space-y-1">
              {result.sent.map((s) => (
                <li key={s.leadId}>✅ {s.brand_name} — {s.email}</li>
              ))}
            </ul>
          )}
          {result.failed?.length > 0 && (
            <ul className="text-sm text-red-300 space-y-1">
              {result.failed.map((f) => (
                <li key={f.leadId}>❌ {f.email} — {f.error}</li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
