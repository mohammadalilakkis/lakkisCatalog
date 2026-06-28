import { Router } from "express";
import { createSession, requireAuth } from "../middleware/auth.js";

const router = Router();

router.post("/login", (req, res) => {
  const { password } = req.body;
  const adminPassword = process.env.ADMIN_PASSWORD || "admin123";

  if (!password || password !== adminPassword) {
    return res.status(401).json({ error: "Invalid password" });
  }

  const token = createSession();
  res.json({ token });
});

router.get("/verify", requireAuth, (_req, res) => {
  res.json({ ok: true });
});

export default router;
