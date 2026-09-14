import { z } from "zod";
import { query } from "@/lib/db";
import { checkRateLimit, requestIp } from "@/lib/rate-limit";

const schema = z.object({
  fullName: z.string().trim().min(3).max(160),
  phone: z.string().regex(/^05\d{9}$/),
  subject: z.string().trim().min(2).max(190),
  message: z.string().trim().min(10).max(1000),
  kvkkAccepted: z.literal(true),
});

export async function POST(request) {
  const ip = requestIp(request);
  if (!(await checkRateLimit(`contact:${ip}`, 4, 60_000))) return Response.json({ error: "Çok fazla deneme yaptınız. Lütfen biraz bekleyin." }, { status: 429 });
  try {
    const parsed = schema.safeParse(await request.json());
    if (!parsed.success) return Response.json({ error: "Form bilgileri geçersiz." }, { status: 400 });
    const data = parsed.data;
    await query("INSERT INTO contact_messages (customer_name, phone, subject, message) VALUES (?, ?, ?, ?)", [data.fullName, data.phone, data.subject, data.message]);
    return Response.json({ ok: true }, { status: 201 });
  } catch (error) {
    console.error("Contact submission failed", error);
    return Response.json({ error: "Mesaj şu anda kaydedilemedi. Lütfen daha sonra tekrar deneyin." }, { status: 503 });
  }
}
