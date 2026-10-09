import "server-only";

import { createHmac, timingSafeEqual, scryptSync } from "node:crypto";

const COOKIE_NAME = "sentinel_admin_session";
const SESSION_SECONDS = 60 * 60 * 8;

function secret() {
  const value = process.env.ADMIN_SESSION_SECRET;
  if (!value || value.length < 32) throw new Error("ADMIN_SESSION_SECRET must be at least 32 characters.");
  return value;
}

export function verifyAdminPassword(password: string) {
  const stored = process.env.ADMIN_PASSWORD_HASH;
  if (!stored) throw new Error("ADMIN_PASSWORD_HASH is not configured.");
  const [salt, expectedHex] = stored.split(":");
  if (!salt || !expectedHex || !/^[a-f0-9]{128}$/i.test(expectedHex)) {
    throw new Error("ADMIN_PASSWORD_HASH must use salt:128-character-scrypt-hex format.");
  }
  const actual = scryptSync(password, salt, 64);
  const expected = Buffer.from(expectedHex, "hex");
  return expected.length === actual.length && timingSafeEqual(actual, expected);
}

function signature(payload: string) {
  return createHmac("sha256", secret()).update(payload).digest("base64url");
}

export function createAdminSession() {
  const payload = Buffer.from(JSON.stringify({ role: "admin", exp: Math.floor(Date.now() / 1000) + SESSION_SECONDS })).toString("base64url");
  return { value: payload + "." + signature(payload), maxAge: SESSION_SECONDS, name: COOKIE_NAME };
}

export function isValidAdminSession(value?: string) {
  if (!value) return false;
  try {
    const [payload, suppliedSignature] = value.split(".");
    if (!payload || !suppliedSignature) return false;
    const expected = Buffer.from(signature(payload));
    const supplied = Buffer.from(suppliedSignature);
    if (expected.length !== supplied.length || !timingSafeEqual(expected, supplied)) return false;
    const data = JSON.parse(Buffer.from(payload, "base64url").toString("utf8")) as { role?: string; exp?: number };
    return data.role === "admin" && typeof data.exp === "number" && data.exp > Math.floor(Date.now() / 1000);
  } catch {
    return false;
  }
}

export { COOKIE_NAME, SESSION_SECONDS };
