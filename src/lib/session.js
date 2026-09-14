import "server-only";
import { cookies } from "next/headers";
import { SignJWT, jwtVerify } from "jose";
import { env } from "cloudflare:workers";

const COOKIE_NAME = "auto_tokyo_admin_session";
const MAX_AGE = 60 * 60 * 8;

function key() {
  const secret = String(env.SESSION_SECRET || "");
  if (!secret || secret.length < 32) throw new Error("SESSION_SECRET en az 32 karakter olmalıdır.");
  return new TextEncoder().encode(secret);
}

export async function createSession(admin) {
  const token = await new SignJWT({ adminId: String(admin.id), role: admin.role, name: admin.name })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${MAX_AGE}s`)
    .setJti(crypto.randomUUID())
    .sign(key());
  const store = await cookies();
  store.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: MAX_AGE,
  });
}

export async function readSession() {
  const store = await cookies();
  const token = store.get(COOKIE_NAME)?.value;
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, key(), { algorithms: ["HS256"] });
    return payload;
  } catch {
    return null;
  }
}

export async function deleteSession() {
  const store = await cookies();
  store.delete(COOKIE_NAME);
}
