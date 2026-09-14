import { z } from "zod";
import { query } from "@/lib/db";
import { checkRateLimit, requestIp } from "@/lib/rate-limit";

const slots = new Set(["09:00", "09:45", "10:30", "11:15", "12:00", "12:45", "13:30", "14:15", "15:00", "15:45"]);
const schema = z.object({
  appointmentType: z.enum(["vehicle_inspection", "vehicle_sale", "trade", "general"]),
  vehicleSlug: z.string().max(190).optional(),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  time: z.string().refine((value) => slots.has(value)),
  fullName: z.string().trim().min(3).max(160),
  phone: z.string().regex(/^05\d{9}$/),
  note: z.string().trim().max(1000).optional(),
  kvkkAccepted: z.literal(true),
}).superRefine((data, context) => {
  if (data.appointmentType === "vehicle_inspection" && !data.vehicleSlug) {
    context.addIssue({ code: "custom", path: ["vehicleSlug"], message: "AraÃ§ inceleme randevusu iÃ§in araÃ§ seÃ§ilmelidir." });
  }
});

export async function POST(request) {
  const ip = requestIp(request);
  if (!(await checkRateLimit(`appointment:${ip}`, 4, 60_000))) return Response.json({ error: "Çok fazla deneme yaptınız. Lütfen biraz bekleyin." }, { status: 429 });
  try {
    const parsed = schema.safeParse(await request.json());
    if (!parsed.success) return Response.json({ error: "Randevu bilgileri geçersiz." }, { status: 400 });
    const data = parsed.data;
    const appointmentAt = new Date(`${data.date}T${data.time}:00+03:00`);
    if (Number.isNaN(appointmentAt.getTime()) || appointmentAt.getDay() === 0 || appointmentAt.getTime() < Date.now() + 60 * 60 * 1000) {
      return Response.json({ error: "Seçilen randevu zamanı uygun değil." }, { status: 400 });
    }
    let vehicleId = null;
    if (data.vehicleSlug) {
      const rows = await query("SELECT id FROM vehicles WHERE slug = ? AND status = 'published' LIMIT 1", [data.vehicleSlug]);
      vehicleId = rows[0]?.id || null;
      if (!vehicleId) return Response.json({ error: "SeÃ§ilen araÃ§ bulunamadÄ± veya artÄ±k yayÄ±nda deÄŸil." }, { status: 400 });
    }
    await query("INSERT INTO appointments (appointment_type, vehicle_id, customer_name, phone, appointment_at, note) VALUES (?, ?, ?, ?, ?, ?)", [data.appointmentType, vehicleId, data.fullName, data.phone, new Date(appointmentAt), data.note || null]);
    return Response.json({ ok: true }, { status: 201 });
  } catch (error) {
    const constraintError = error?.code === "ER_DUP_ENTRY" || /(?:UNIQUE|SQLITE_CONSTRAINT)/i.test(`${error?.code || ""} ${error?.message || ""}`);
    if (constraintError) return Response.json({ error: "Bu saat için başka bir randevu bulunuyor. Lütfen farklı bir saat seçin." }, { status: 409 });
    console.error("Appointment submission failed", error);
    return Response.json({ error: "Randevu şu anda kaydedilemedi. Lütfen daha sonra tekrar deneyin." }, { status: 503 });
  }
}
