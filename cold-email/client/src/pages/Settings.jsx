import { useEffect, useState } from "react";
import { api } from "../api.js";

export default function Settings() {
  const [gmail, setGmail] = useState(null);
  const [settings, setSettings] = useState(null);
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);

  async function load() {
    const [status, s] = await Promise.all([api.getGmailStatus(), api.getSettings()]);
    setGmail(status);
    setSettings(s);
  }

  useEffect(() => {
    load();
  }, []);

  async function handleConnect() {
    setError("");
    try {
      const { url } = await api.getGmailUrl();
      window.open(url, "_blank");
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleDisconnect() {
    await api.disconnectGmail();
    await load();
  }

  async function handleSave(e) {
    e.preventDefault();
    setSaved(false);
    await api.updateSettings(settings);
    setSaved(true);
  }

  if (!settings) return null;

  return (
    <div className="max-w-xl">
      <h1 className="font-display text-2xl font-extrabold mb-6">Settings</h1>

      <div className="bg-card rounded-xl border border-white/5 p-6 mb-6">
        <div className="font-medium mb-3">Gmail account</div>
        {gmail?.connected ? (
          <div>
            <p className="text-sm text-bone/60 mb-3">
              Connected: <span className="text-lime">{gmail.email}</span>
            </p>
            <button
              onClick={handleDisconnect}
              className="text-sm px-3 py-2 rounded-lg bg-ink border border-white/10 hover:border-red-400 hover:text-red-300"
            >
              Disconnect
            </button>
          </div>
        ) : (
          <div>
            <p className="text-sm text-bone/60 mb-3">
              Connect the Gmail account you want cold emails sent from. Requires a Google Cloud OAuth
              client (see cold-email/README.md) configured in the server's .env.
            </p>
            <button onClick={handleConnect} className="text-sm px-4 py-2 rounded-lg bg-lime text-ink font-medium">
              Connect Gmail
            </button>
          </div>
        )}
        {error && <p className="text-sm text-red-300 mt-3">{error}</p>}
      </div>

      <form onSubmit={handleSave} className="bg-card rounded-xl border border-white/5 p-6 flex flex-col gap-4">
        <div className="font-medium">Sending rules</div>

        <label className="flex flex-col gap-1 text-sm">
          Daily batch size
          <input
            type="number"
            min={1}
            max={200}
            value={settings.daily_batch_size}
            onChange={(e) => setSettings({ ...settings, daily_batch_size: e.target.value })}
            className="bg-ink border border-white/10 rounded-lg px-3 py-2"
          />
        </label>

        <label className="flex flex-col gap-1 text-sm">
          Cooldown before re-contacting a non-responder (days)
          <input
            type="number"
            min={1}
            max={90}
            value={settings.cooldown_days}
            onChange={(e) => setSettings({ ...settings, cooldown_days: e.target.value })}
            className="bg-ink border border-white/10 rounded-lg px-3 py-2"
          />
        </label>

        <label className="flex flex-col gap-1 text-sm">
          From name (shown alongside your email)
          <input
            value={settings.from_name}
            onChange={(e) => setSettings({ ...settings, from_name: e.target.value })}
            className="bg-ink border border-white/10 rounded-lg px-3 py-2"
          />
        </label>

        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={settings.auto_send_enabled === "true"}
            onChange={(e) =>
              setSettings({ ...settings, auto_send_enabled: e.target.checked ? "true" : "false" })
            }
          />
          Auto-send today's batch automatically (no manual click needed)
        </label>

        {settings.auto_send_enabled === "true" && (
          <label className="flex flex-col gap-1 text-sm">
            Auto-send time (24h, server local time)
            <input
              type="time"
              value={settings.auto_send_time}
              onChange={(e) => setSettings({ ...settings, auto_send_time: e.target.value })}
              className="bg-ink border border-white/10 rounded-lg px-3 py-2"
            />
          </label>
        )}

        <button type="submit" className="self-start bg-lime text-ink font-medium rounded-lg px-4 py-2 text-sm">
          Save settings
        </button>
        {saved && <p className="text-sm text-lime">Saved.</p>}
      </form>
    </div>
  );
}
