import { useEffect, useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { api } from "../api.js";

const emptyForm = { name: "", subject: "", body: "" };

export default function Templates() {
  const [templates, setTemplates] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState("");

  async function load() {
    setTemplates(await api.getTemplates());
  }

  useEffect(() => {
    load();
  }, []);

  async function handleAdd(e) {
    e.preventDefault();
    setError("");
    try {
      await api.addTemplate(form);
      setForm(emptyForm);
      await load();
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleDelete(id) {
    await api.deleteTemplate(id);
    await load();
  }

  async function handleToggleActive(t) {
    await api.updateTemplate(t.id, { is_active: t.is_active ? 0 : 1 });
    await load();
  }

  return (
    <div>
      <h1 className="font-display text-2xl font-extrabold mb-6">Templates</h1>
      <p className="text-xs text-bone/40 mb-4">
        Use placeholders: {"{{brand_name}}"}, {"{{contact_name}}"}, {"{{website}}"}, {"{{niche}}"} — they're
        filled in automatically per lead. The most recently created active template is used for each send batch.
      </p>

      <form onSubmit={handleAdd} className="bg-card rounded-xl border border-white/5 p-5 mb-8 flex flex-col gap-3">
        <input required placeholder="Template name" value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          className="bg-ink border border-white/10 rounded-lg px-3 py-2 text-sm" />
        <input required placeholder="Subject line, e.g. Quick idea for {{brand_name}}" value={form.subject}
          onChange={(e) => setForm({ ...form, subject: e.target.value })}
          className="bg-ink border border-white/10 rounded-lg px-3 py-2 text-sm" />
        <textarea required placeholder="Email body" rows={8} value={form.body}
          onChange={(e) => setForm({ ...form, body: e.target.value })}
          className="bg-ink border border-white/10 rounded-lg px-3 py-2 text-sm font-mono" />
        <button type="submit" className="self-start flex items-center gap-2 bg-lime text-ink font-medium rounded-lg px-4 py-2 text-sm">
          <Plus size={14} /> Save template
        </button>
        {error && <div className="text-sm text-red-300">{error}</div>}
      </form>

      <div className="flex flex-col gap-4">
        {templates.map((t) => (
          <div key={t.id} className="bg-card rounded-xl border border-white/5 p-5">
            <div className="flex items-center justify-between mb-2">
              <div className="font-medium">{t.name}</div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => handleToggleActive(t)}
                  className={`text-xs px-2 py-1 rounded-full border ${
                    t.is_active ? "border-lime text-lime" : "border-white/20 text-bone/40"
                  }`}
                >
                  {t.is_active ? "Active" : "Inactive"}
                </button>
                <button onClick={() => handleDelete(t.id)} className="text-bone/40 hover:text-red-400">
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
            <div className="text-sm text-bone/60 mb-2">{t.subject}</div>
            <div className="text-sm text-bone/40 whitespace-pre-wrap font-mono">{t.body}</div>
          </div>
        ))}
        {templates.length === 0 && <div className="text-bone/40 text-sm">No templates yet.</div>}
      </div>
    </div>
  );
}
