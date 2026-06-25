import crypto from "crypto";

const sessions = new Map();

export function createSession() {
  const token = crypto.randomBytes(32).toString("hex");
  sessions.set(token, { createdAt: Date.now() });
  return token;
}

export function validateSession(token) {
  if (!token || !sessions.has(token)) return false;
  const session = sessions.get(token);
  const maxAge = 7 * 24 * 60 * 60 * 1000;
  if (Date.now() - session.createdAt > maxAge) {
    sessions.delete(token);
    return false;
  }
  return true;
}

export function requireAuth(req, res, next) {
  const authHeader = req.headers.authorization;
  const token = authHeader?.startsWith("Bearer ") ? authHeader.slice(7) : null;

  if (!validateSession(token)) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  next();
}
