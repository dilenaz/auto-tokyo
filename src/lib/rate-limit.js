import "server-only";
import crypto from "node:crypto";
import { query } from "@/lib/db";

export async function checkRateLimit(key, limit = 5, windowMs = 60_000) {
  const bucketHash = crypto.createHash("sha256").update(key).digest("hex");
  const now = Date.now();
  const windowStart = Math.floor(now / windowMs) * windowMs;
  const expiresAt = windowStart + windowMs * 2;
  await query(
    `INSERT INTO rate_limit_buckets (bucket_hash, window_start, hit_count, expires_at)
     VALUES (?, ?, 1, ?)
     ON CONFLICT(bucket_hash, window_start) DO UPDATE SET hit_count = hit_count + 1`,
    [bucketHash, windowStart, expiresAt],
  );
  const rows = await query(
    "SELECT hit_count FROM rate_limit_buckets WHERE bucket_hash = ? AND window_start = ?",
    [bucketHash, windowStart],
  );
  if (Number.parseInt(bucketHash.slice(0, 2), 16) % 16 === 0) {
    await query("DELETE FROM rate_limit_buckets WHERE expires_at < ?", [now]);
  }
  return Number(rows[0]?.hit_count || 0) <= limit;
}

export function requestIp(request) {
  return requestIpFromHeaders(request.headers);
}

export function requestIpFromHeaders(headers) {
  return headers.get("cf-connecting-ip") || headers.get("x-real-ip") || "unknown";
}
