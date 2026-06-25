import { Router } from "express";
import { createSession } from "../middleware/auth.js";

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

export default router;
