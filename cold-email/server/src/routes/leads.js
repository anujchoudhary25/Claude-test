import { Router } from "express";
import { db } from "../db.js";

const router = Router();

router.get("/", (req, res) => {
  const { status } = req.query;
  const leads = status
    ? db.prepare("SELECT * FROM leads WHERE status = ? ORDER BY created_at DESC").all(status)
    : db.prepare("SELECT * FROM leads ORDER BY created_at DESC").all();
  res.json(leads);
});

router.post("/", (req, res) => {
  const { brand_name, contact_name, email, website, niche, notes } = req.body;
  if (!brand_name || !email) {
    return res.status(400).json({ error: "brand_name and email are required" });
  }
  try {
    const result = db
      .prepare(
        `INSERT INTO leads (brand_name, contact_name, email, website, niche, notes)
         VALUES (?, ?, ?, ?, ?, ?)`
      )
      .run(brand_name, contact_name || null, email, website || null, niche || null, notes || null);
    res.status(201).json(db.prepare("SELECT * FROM leads WHERE id = ?").get(result.lastInsertRowid));
  } catch (err) {
    if (String(err.message).includes("UNIQUE")) {
      return res.status(409).json({ error: "A lead with this email already exists" });
    }
    res.status(500).json({ error: err.message });
  }
});

router.post("/import", (req, res) => {
  const { leads } = req.body;
  if (!Array.isArray(leads)) {
    return res.status(400).json({ error: "leads must be an array" });
  }
  const insert = db.prepare(
    `INSERT OR IGNORE INTO leads (brand_name, contact_name, email, website, niche, notes)
     VALUES (@brand_name, @contact_name, @email, @website, @niche, @notes)`
  );
  let inserted = 0;
  const tx = db.transaction((rows) => {
    for (const row of rows) {
      if (!row.brand_name || !row.email) continue;
      const result = insert.run({
        brand_name: row.brand_name,
        contact_name: row.contact_name || null,
        email: row.email,
        website: row.website || null,
        niche: row.niche || null,
        notes: row.notes || null,
      });
      if (result.changes) inserted += 1;
    }
  });
  tx(leads);
  res.json({ inserted, skipped: leads.length - inserted });
});

router.put("/:id", (req, res) => {
  const { id } = req.params;
  const existing = db.prepare("SELECT * FROM leads WHERE id = ?").get(id);
  if (!existing) return res.status(404).json({ error: "Lead not found" });

  const fields = ["brand_name", "contact_name", "email", "website", "niche", "notes", "status"];
  const updates = {};
  for (const f of fields) {
    if (req.body[f] !== undefined) updates[f] = req.body[f];
  }
  const merged = { ...existing, ...updates };
  db.prepare(
    `UPDATE leads SET brand_name=@brand_name, contact_name=@contact_name, email=@email,
     website=@website, niche=@niche, notes=@notes, status=@status WHERE id=@id`
  ).run(merged);
  res.json(db.prepare("SELECT * FROM leads WHERE id = ?").get(id));
});

router.delete("/:id", (req, res) => {
  db.prepare("DELETE FROM leads WHERE id = ?").run(req.params.id);
  res.status(204).end();
});

export default router;
