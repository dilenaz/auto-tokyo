import "server-only";
import { env } from "cloudflare:workers";

export function uploadPath(...segments) {
  const key = segments.map(String).join("/");
  if (!key || key.includes("..") || key.startsWith("/")) throw new Error("Geçersiz yükleme yolu.");
  return key;
}

export async function saveUpload(key, data, type) {
  await env.UPLOADS.put(key, data, { httpMetadata: { contentType: type } });
}

export async function deleteUpload(key) {
  await env.UPLOADS.delete(key);
}

export async function readUpload(key) {
  return env.UPLOADS.get(key);
}

export function extensionForMime(type) {
  return ({ "image/jpeg": ".jpg", "image/png": ".png", "image/webp": ".webp", "image/avif": ".avif" })[type] || null;
}
