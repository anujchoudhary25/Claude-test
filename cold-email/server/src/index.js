import "dotenv/config";
import express from "express";
import cors from "cors";

import leadsRouter from "./routes/leads.js";
import templatesRouter from "./routes/templates.js";
import campaignRouter from "./routes/campaign.js";
import statsRouter from "./routes/stats.js";
import settingsRouter from "./routes/settings.js";
import authRouter from "./routes/auth.js";
import { startScheduler } from "./scheduler.js";

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

app.get("/api/health", (req, res) => res.json({ ok: true }));

app.use("/api/leads", leadsRouter);
app.use("/api/templates", templatesRouter);
app.use("/api/campaign", campaignRouter);
app.use("/api/stats", statsRouter);
app.use("/api/settings", settingsRouter);
app.use("/api/auth", authRouter);

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: err.message || "Internal server error" });
});

app.listen(PORT, () => {
  console.log(`Cold email server running on http://localhost:${PORT}`);
  startScheduler();
});
