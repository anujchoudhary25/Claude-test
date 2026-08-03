import { Router } from "express";
import { db, getSetting } from "../db.js";
import { sendMail, checkThreadForReply, isGmailConnected } from "../gmail.js";

const router = Router();

function personalize(text, lead) {
  return text
    .replaceAll("{{brand_name}}", lead.brand_name || "")
    .replaceAll("{{contact_name}}", lead.contact_name || "there")
    .replaceAll("{{website}}", lead.website || "")
    .replaceAll("{{niche}}", lead.niche || "");
}

function getEligibleLeads(limit) {
  return db
    .prepare(
      `SELECT * FROM leads
       WHERE status = 'new'
          OR (status = 'sent' AND next_eligible_at IS NOT NULL AND next_eligible_at <= datetime('now'))
       ORDER BY created_at ASC
       LIMIT ?`
    )
    .all(limit);
}

router.get("/eligible-count", (req, res) => {
  const rows = getEligibleLeads(100000);
  res.json({ count: rows.length });
});

router.post("/send-batch", async (req, res) => {
  if (!isGmailConnected()) {
    return res.status(400).json({ error: "Gmail is not connected. Go to Settings first." });
  }

  const batchSize = Number(req.body.batchSize) || Number(getSetting("daily_batch_size")) || 20;
  const cooldownDays = Number(getSetting("cooldown_days")) || 14;

  let template;
  if (req.body.templateId) {
    template = db.prepare("SELECT * FROM templates WHERE id = ?").get(req.body.templateId);
  } else {
    template = db
      .prepare("SELECT * FROM templates WHERE is_active = 1 ORDER BY created_at DESC LIMIT 1")
      .get();
  }
  if (!template) {
    return res.status(400).json({ error: "No active email template found. Create one first." });
  }

  const leads = getEligibleLeads(batchSize);
  if (leads.length === 0) {
    return res.json({ sent: [], failed: [], message: "No eligible leads to email right now." });
  }

  const sent = [];
  const failed = [];

  for (const lead of leads) {
    const subject = personalize(template.subject, lead);
    const body = personalize(template.body, lead);
    try {
      const { messageId, threadId } = await sendMail({ to: lead.email, subject, body });
      db.prepare(
        `INSERT INTO sends (lead_id, template_id, thread_id, message_id, subject, status)
         VALUES (?, ?, ?, ?, ?, 'sent')`
      ).run(lead.id, template.id, threadId, messageId, subject);

      db.prepare(
        `UPDATE leads SET status = 'sent', last_contacted_at = datetime('now'),
         next_eligible_at = datetime('now', '+${cooldownDays} days') WHERE id = ?`
      ).run(lead.id);

      sent.push({ leadId: lead.id, email: lead.email, brand_name: lead.brand_name });
    } catch (err) {
      failed.push({ leadId: lead.id, email: lead.email, error: err.message });
    }
  }

  res.json({ sent, failed, templateUsed: template.name });
});

router.post("/check-replies", async (req, res) => {
  if (!isGmailConnected()) {
    return res.status(400).json({ error: "Gmail is not connected. Go to Settings first." });
  }

  const pending = db
    .prepare(
      `SELECT sends.*, leads.email as lead_email FROM sends
       JOIN leads ON leads.id = sends.lead_id
       WHERE sends.status = 'sent' AND sends.thread_id IS NOT NULL`
    )
    .all();

  let newlyReplied = 0;
  const errors = [];

  for (const send of pending) {
    try {
      const result = await checkThreadForReply({
        threadId: send.thread_id,
        leadEmail: send.lead_email,
      });
      if (result.replied) {
        db.prepare(
          `UPDATE sends SET status = 'replied', replied_at = ?, reply_snippet = ? WHERE id = ?`
        ).run(result.repliedAt, result.snippet, send.id);
        db.prepare(`UPDATE leads SET status = 'replied' WHERE id = ?`).run(send.lead_id);
        newlyReplied += 1;
      }
    } catch (err) {
      errors.push({ sendId: send.id, error: err.message });
    }
  }

  res.json({ checked: pending.length, newlyReplied, errors });
});

export default router;
