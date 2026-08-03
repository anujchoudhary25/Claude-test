import { Router } from "express";
import { db } from "../db.js";

const router = Router();

router.get("/overview", (req, res) => {
  const totalLeads = db.prepare("SELECT COUNT(*) c FROM leads").get().c;
  const totalSent = db.prepare("SELECT COUNT(*) c FROM sends").get().c;
  const totalReplied = db.prepare("SELECT COUNT(*) c FROM sends WHERE status = 'replied'").get().c;
  const sentToday = db
    .prepare("SELECT COUNT(*) c FROM sends WHERE date(sent_at) = date('now')")
    .get().c;
  const pendingReplies = db
    .prepare("SELECT COUNT(*) c FROM sends WHERE status = 'sent'")
    .get().c;
  const newLeads = db.prepare("SELECT COUNT(*) c FROM leads WHERE status = 'new'").get().c;

  const replyRate = totalSent > 0 ? Number(((totalReplied / totalSent) * 100).toFixed(1)) : 0;

  res.json({
    totalLeads,
    newLeads,
    totalSent,
    totalReplied,
    replyRate,
    sentToday,
    pendingReplies,
  });
});

router.get("/daily", (req, res) => {
  const days = Number(req.query.days) || 30;
  const rows = db
    .prepare(
      `SELECT date(sent_at) as day,
              COUNT(*) as sent,
              SUM(CASE WHEN status = 'replied' THEN 1 ELSE 0 END) as replied
       FROM sends
       WHERE sent_at >= datetime('now', '-${days} days')
       GROUP BY date(sent_at)
       ORDER BY day ASC`
    )
    .all();
  res.json(rows);
});

router.get("/recent-sends", (req, res) => {
  const rows = db
    .prepare(
      `SELECT sends.id, sends.subject, sends.status, sends.sent_at, sends.replied_at, sends.reply_snippet,
              leads.brand_name, leads.email
       FROM sends
       JOIN leads ON leads.id = sends.lead_id
       ORDER BY sends.sent_at DESC
       LIMIT 50`
    )
    .all();
  res.json(rows);
});

export default router;
