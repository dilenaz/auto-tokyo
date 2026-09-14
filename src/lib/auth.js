import "server-only";
import { cache } from "react";
import { redirect } from "next/navigation";
import { query } from "@/lib/db";
import { readSession } from "@/lib/session";

export const getAdmin = cache(async () => {
  const session = await readSession();
  if (!session?.adminId) return null;
  const rows = await query(
    "SELECT id, name, email, role FROM admins WHERE id = ? AND is_active = 1 LIMIT 1",
    [session.adminId],
  );
  return rows[0] || null;
});

export async function requireAdmin() {
  const admin = await getAdmin();
  if (!admin) redirect("/yonetim/giris");
  return admin;
}
