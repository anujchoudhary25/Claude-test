import { useEffect, useState, useRef } from "react";
import { Plus, Upload, Trash2 } from "lucide-react";
import { api } from "../api.js";
import StatusBadge from "../components/StatusBadge.jsx";

const emptyForm = { brand_name: "", contact_name: "", email: "", website: "", niche: "", notes: "" };

function parseCsv(text) {
  const lines = text.trim().split(/\r?\n/);
  const headers = lines[0].split(",").map((h) => h.trim().toLowerCase());
  return lines.slice(1).map((line) => {
    const cells = line.split(",").map((c) => c.trim());
    const row = {};
    headers.forEach((h, i) => (row[h] = cells[i] || ""));
    return row;
  });
}

export default function Leads() {
  const [leads, setLeads] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState("");
  const [importMsg, setImportMsg] = useState("");
  const fileRef = useRef(null);

  async function load() {
    setLeads(await api.getLeads());
  }

  useEffect(() => {
    load();
  }, []);

  async function handleAdd(e) {
    e.preventDefault();
    setError("");
    try {
      await api.addLead(form);
      setForm(emptyForm);
      await load();
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleDelete(id) {
    await api.deleteLead(id);
    await load();
  }

  async function handleFile(e) {
    const file = e.target.files[0];
    if (!file) return;
    const text = await file.text();
    const rows = parseCsv(text);
    const result = await api.importLeads(rows);
    setImportMsg(`Imported ${result.inserted}, skipped ${result.skipped} (duplicates/invalid).`);
    fileRef.current.value = "";
    await load();
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display text-2xl font-extrabold">Leads</h1>
        <label className="flex items-center gap-2 text-sm px-3 py-2 rounded-lg bg-card hover:bg-card-hover border border-white/10 cursor-pointer">
          <Upload size={14} />
          Import CSV
          <input ref={fileRef} type="file" accept=".csv" className="hidden" onChange={handleFile} />
        </label>
      </div>

      {importMsg && (
        <div className="mb-4 text-sm text-lime bg-lime/10 border border-lime/30 rounded-lg px-4 py-2">
          {importMsg}
        </div>
      )}
      <p className="text-xs text-bone/40 mb-4">
        CSV columns: brand_name, contact_name, email, website, niche, notes
      </p>

      <form onSubmit={handleAdd} className="bg-card rounded-xl border border-white/5 p-5 mb-8 grid grid-cols-2 md:grid-cols-3 gap-3">
        <input required placeholder="Brand name" value={form.brand_name}
          onChange={(e) => setForm({ ...form, brand_name: e.target.value })}
          className="bg-ink border border-white/10 rounded-lg px-3 py-2 text-sm" />
        <input placeholder="Contact name" value={form.contact_name}
          onChange={(e) => setForm({ ...form, contact_name: e.target.value })}
          className="bg-ink border border-white/10 rounded-lg px-3 py-2 text-sm" />
        <input required type="email" placeholder="Email" value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          className="bg-ink border border-white/10 rounded-lg px-3 py-2 text-sm" />
        <input placeholder="Website" value={form.website}
          onChange={(e) => setForm({ ...form, website: e.target.value })}
          className="bg-ink border border-white/10 rounded-lg px-3 py-2 text-sm" />
        <input placeholder="Niche" value={form.niche}
          onChange={(e) => setForm({ ...form, niche: e.target.value })}
          className="bg-ink border border-white/10 rounded-lg px-3 py-2 text-sm" />
        <button type="submit" className="flex items-center justify-center gap-2 bg-lime text-ink font-medium rounded-lg px-3 py-2 text-sm">
          <Plus size={14} /> Add lead
        </button>
        {error && <div className="col-span-full text-sm text-red-300">{error}</div>}
      </form>

      <div className="bg-card rounded-xl border border-white/5 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-bone/40 border-b border-white/10">
              <th className="py-2 px-4">Brand</th>
              <th className="py-2 px-4">Contact</th>
              <th className="py-2 px-4">Email</th>
              <th className="py-2 px-4">Status</th>
              <th className="py-2 px-4">Last contacted</th>
              <th className="py-2 px-4"></th>
            </tr>
          </thead>
          <tbody>
            {leads.map((l) => (
              <tr key={l.id} className="border-b border-white/5">
                <td className="py-2 px-4">{l.brand_name}</td>
                <td className="py-2 px-4 text-bone/60">{l.contact_name || "—"}</td>
                <td className="py-2 px-4 text-bone/60">{l.email}</td>
                <td className="py-2 px-4">
                  <StatusBadge status={l.status} />
                </td>
                <td className="py-2 px-4 text-bone/40">
                  {l.last_contacted_at ? new Date(l.last_contacted_at).toLocaleDateString() : "—"}
                </td>
                <td className="py-2 px-4">
                  <button onClick={() => handleDelete(l.id)} className="text-bone/40 hover:text-red-400">
                    <Trash2 size={14} />
                  </button>
                </td>
              </tr>
            ))}
            {leads.length === 0 && (
              <tr>
                <td colSpan={6} className="py-4 px-4 text-bone/40">
                  No leads yet. Add one above or import a CSV.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
