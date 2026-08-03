import cron from "node-cron";
import { getSetting } from "./db.js";
import { isGmailConnected } from "./gmail.js";

async function checkRepliesJob() {
  if (!isGmailConnected()) return;
  try {
    const res = await fetch(`http://localhost:${process.env.PORT || 4000}/api/campaign/check-replies`, {
      method: "POST",
    });
    const data = await res.json();
    if (data.newlyReplied > 0) {
      console.log(`[scheduler] Reply check: ${data.newlyReplied} new replies out of ${data.checked} checked.`);
    }
  } catch (err) {
    console.error("[scheduler] Reply check failed:", err.message);
  }
}

async function autoSendJob() {
  if (getSetting("auto_send_enabled") !== "true") return;
  if (!isGmailConnected()) return;
  try {
    const res = await fetch(`http://localhost:${process.env.PORT || 4000}/api/campaign/send-batch`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({}),
    });
    const data = await res.json();
    console.log(`[scheduler] Auto-send: sent ${data.sent?.length || 0}, failed ${data.failed?.length || 0}.`);
  } catch (err) {
    console.error("[scheduler] Auto-send failed:", err.message);
  }
}

export function startScheduler() {
  // Reply tracking runs automatically every 30 minutes, no user action needed.
  cron.schedule("*/30 * * * *", checkRepliesJob);

  // Auto-send is opt-in (Settings > auto_send_enabled) and defaults to off;
  // checked every minute so it fires close to the configured auto_send_time.
  cron.schedule("* * * * *", () => {
    const target = getSetting("auto_send_time") || "09:00";
    const now = new Date();
    const hhmm = `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;
    if (hhmm === target) autoSendJob();
  });

  console.log("[scheduler] Started: reply-check every 30 min, auto-send check every minute (opt-in).");
}
