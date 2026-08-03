import { Router } from "express";
import {
  getAuthUrl,
  handleOAuthCallback,
  isGmailConnected,
  getConnectedEmail,
  disconnectGmail,
} from "../gmail.js";

const router = Router();

router.get("/gmail/url", (req, res) => {
  try {
    res.json({ url: getAuthUrl() });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/gmail/callback", async (req, res) => {
  const { code, error } = req.query;
  if (error) return res.status(400).send(`Google OAuth error: ${error}`);
  try {
    const email = await handleOAuthCallback(code);
    res.send(
      `<html><body style="font-family:sans-serif;padding:40px">
        <h2>Gmail connected: ${email}</h2>
        <p>You can close this tab and return to the dashboard.</p>
      </body></html>`
    );
  } catch (err) {
    res.status(500).send(`Failed to connect Gmail: ${err.message}`);
  }
});

router.get("/gmail/status", (req, res) => {
  res.json({ connected: isGmailConnected(), email: getConnectedEmail() });
});

router.post("/gmail/disconnect", (req, res) => {
  disconnectGmail();
  res.json({ ok: true });
});

export default router;
