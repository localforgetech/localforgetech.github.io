import { createHmac, timingSafeEqual } from "node:crypto";

import { cookies } from "next/headers";

const COOKIE_NAME = "lf_crm_session";
const SESSION_PAYLOAD = "localforge-crm-session-v1";
const SESSION_MAX_AGE = 60 * 60 * 12;

function sessionSecret(): string {
  return process.env.CRM_SESSION_SECRET ?? "localforge-development-secret";
}

export function sessionToken(): string {
  return createHmac("sha256", sessionSecret())
    .update(SESSION_PAYLOAD)
    .digest("hex");
}

function safeEqual(a: string, b: string): boolean {
  const left = Buffer.from(a);
  const right = Buffer.from(b);
  if (left.length !== right.length) return false;
  return timingSafeEqual(left, right);
}

export function verifyPassword(input: string): boolean {
  const expected = process.env.CRM_PASSWORD ?? "";
  if (!expected) return false;
  return safeEqual(input, expected);
}

export async function isCrmAuthed(): Promise<boolean> {
  const store = await cookies();
  const token = store.get(COOKIE_NAME)?.value;
  if (!token) return false;
  return safeEqual(token, sessionToken());
}

export async function setCrmSession(): Promise<void> {
  const store = await cookies();
  store.set(COOKIE_NAME, sessionToken(), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_MAX_AGE,
  });
}

export async function clearCrmSession(): Promise<void> {
  const store = await cookies();
  store.delete(COOKIE_NAME);
}
