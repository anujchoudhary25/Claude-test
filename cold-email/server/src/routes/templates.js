import { Router } from "express";
import { db } from "../db.js";

const router = Router();

router.get("/", (req, res) => {
  res.json(db.prepare("SELECT * FROM templates ORDER BY created_at DESC").all());
});

router.post("/", (req, res) => {
  const { name, subject, body } = req.body;
  if (!name || !subject || !body) {
    return res.status(400).json({ error: "name, subject and body are required" });
  }
  const result = db
    .prepare("INSERT INTO templates (name, subject, body) VALUES (?, ?, ?)")
    .run(name, subject, body);
  res.status(201).json(db.prepare("SELECT * FROM templates WHERE id = ?").get(result.lastInsertRowid));
});

router.put("/:id", (req, res) => {
  const { id } = req.params;
  const existing = db.prepare("SELECT * FROM templates WHERE id = ?").get(id);
  if (!existing) return res.status(404).json({ error: "Template not found" });
  const merged = {
    id,
    name: req.body.name ?? existing.name,
    subject: req.body.subject ?? existing.subject,
    body: req.body.body ?? existing.body,
    is_active: req.body.is_active ?? existing.is_active,
  };
  db.prepare(
    "UPDATE templates SET name=@name, subject=@subject, body=@body, is_active=@is_active WHERE id=@id"
  ).run(merged);
  res.json(db.prepare("SELECT * FROM templates WHERE id = ?").get(id));
});

router.delete("/:id", (req, res) => {
  db.prepare("DELETE FROM templates WHERE id = ?").run(req.params.id);
  res.status(204).end();
});

export default router;
