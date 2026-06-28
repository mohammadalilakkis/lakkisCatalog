import crypto from "crypto";

const MAX_AGE_MS = 7 * 24 * 60 * 60 * 1000;

function getSecret() {
  return process.env.ADMIN_PASSWORD || "admin123";
}

export function createSession() {
  const payload = { exp: Date.now() + MAX_AGE_MS };
  const data = Buffer.from(JSON.stringify(payload)).toString("base64url");
  const sig = crypto.createHmac("sha256", getSecret()).update(data).digest("base64url");
  return `${data}.${sig}`;
}

export function validateSession(token) {
  if (!token || !token.includes(".")) return false;

  const dot = token.lastIndexOf(".");
  const data = token.slice(0, dot);
  const sig = token.slice(dot + 1);
  if (!data || !sig) return false;

  const expected = crypto.createHmac("sha256", getSecret()).update(data).digest("base64url");

  try {
    const sigBuf = Buffer.from(sig);
    const expectedBuf = Buffer.from(expected);
    if (sigBuf.length !== expectedBuf.length) return false;
    if (!crypto.timingSafeEqual(sigBuf, expectedBuf)) return false;
  } catch {
    return false;
  }

  try {
    const payload = JSON.parse(Buffer.from(data, "base64url").toString("utf8"));
    return typeof payload.exp === "number" && payload.exp > Date.now();
  } catch {
    return false;
  }
}

export function requireAuth(req, res, next) {
  const authHeader = req.headers.authorization;
  const token = authHeader?.startsWith("Bearer ") ? authHeader.slice(7) : null;

  if (!validateSession(token)) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  next();
}
