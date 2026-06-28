import { Router } from "express";
import { getSiteAnalytics } from "../db.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();

router.get("/", requireAuth, (_req, res) => {
  res.json({ analytics: getSiteAnalytics() });
});

export default router;
