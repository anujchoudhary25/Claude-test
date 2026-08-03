import { Router } from "express";
import { getAllSettings, setSetting } from "../db.js";

const router = Router();

router.get("/", (req, res) => {
  res.json(getAllSettings());
});

router.put("/", (req, res) => {
  for (const [key, value] of Object.entries(req.body)) {
    setSetting(key, value);
  }
  res.json(getAllSettings());
});

export default router;
