import { Router } from "express";
import {
  createInquiry,
  getAllInquiries,
  deleteInquiry,
  markInquiryRead,
} from "../db.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();

router.post("/", (req, res) => {
  const { firstName, lastName, email, projectType, message } = req.body;

  if (!firstName?.trim() || !lastName?.trim() || !email?.trim()) {
    return res
      .status(400)
      .json({ error: "First name, last name, and email are required" });
  }

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailPattern.test(email.trim())) {
    return res.status(400).json({ error: "Invalid email address" });
  }

  const inquiry = createInquiry({
    firstName: firstName.trim(),
    lastName: lastName.trim(),
    email: email.trim(),
    projectType: projectType?.trim() || "",
    message: message?.trim() || "",
  });

  res.status(201).json({ inquiry });
});

router.get("/", requireAuth, (_req, res) => {
  res.json({ inquiries: getAllInquiries() });
});

router.patch("/:id/read", requireAuth, (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id)) {
    return res.status(400).json({ error: "Invalid inquiry id" });
  }

  const inquiry = markInquiryRead(id, req.body.read !== false);
  if (!inquiry) {
    return res.status(404).json({ error: "Inquiry not found" });
  }

  res.json({ inquiry });
});

router.delete("/:id", requireAuth, (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id)) {
    return res.status(400).json({ error: "Invalid inquiry id" });
  }

  if (!deleteInquiry(id)) {
    return res.status(404).json({ error: "Inquiry not found" });
  }

  res.json({ success: true });
});

export default router;
