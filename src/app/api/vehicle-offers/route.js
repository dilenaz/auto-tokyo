import { z } from "zod";
import crypto from "node:crypto";
import { getPool } from "@/lib/db";
import { checkRateLimit, requestIp } from "@/lib/rate-limit";
import { deleteUpload, extensionForMime, saveUpload, uploadPath } from "@/lib/uploads";

const schema = z.object({
  transactionType: z.enum(["sale", "trade"]),
  interestedVehicle: z.string().max(190).optional(),
  brand: z.string().trim().min(1).max(100), model: z.string().trim().min(1).max(160), packageName: z.string().trim().max(160).optional(),
  year: z.coerce.number().int().min(1950).max(new Date().getFullYear() + 1), mileage: z.coerce.number().int().min(0).max(2_000_000),
  fuel: z.string().max(60), transmission: z.string().max(60), color: z.string().max(60).optional(),
  paintedParts: z.string().max(1000).optional(), changedParts: z.string().max(1000).optional(), tramer: z.string().trim().min(1).max(500), conditionNote: z.string().max(2000).optional(),
  fullName: z.string().trim().min(3).max(160), phone: z.string().regex(/^05\d{9}$/), preferredContactTime: z.string().max(100).optional(), kvkkAccepted: z.literal(true),
});

const allowedImageTypes = new Set(["image/jpeg", "image/png", "image/webp"]);
const maxImageSize = 8 * 1024 * 1024;

export async function POST(request) {
  const ip = requestIp(request);
  if (!(await checkRateLimit(`offer:${ip}`, 3, 60_000))) return Response.json({ error: "Çok fazla deneme yaptınız. Lütfen biraz bekleyin." }, { status: 429 });
  let connection;
  let offerId;
  const savedFiles = [];
  try {
    const body = await request.formData();
    const parsed = schema.safeParse(JSON.parse(String(body.get("payload") || "{}")));
    if (!parsed.success) return Response.json({ error: "Araç bilgileri geçersiz." }, { status: 400 });
    const photos = body.getAll("photos").filter((file) => file instanceof File && file.size > 0);
    const totalPhotoSize = photos.reduce((total, file) => total + file.size, 0);
    if (photos.length < 4 || photos.length > 10 || totalPhotoSize > 40 * 1024 * 1024 || photos.some((file) => !allowedImageTypes.has(file.type) || file.size > maxImageSize)) {
      return Response.json({ error: "4-10 adet JPG, PNG veya WebP fotoğraf yükleyin. Her fotoğraf en fazla 8 MB, toplam yükleme en fazla 40 MB olabilir." }, { status: 400 });
    }
    const data = parsed.data;
    const vehicleData = { ...data };
    delete vehicleData.transactionType; delete vehicleData.fullName; delete vehicleData.phone; delete vehicleData.kvkkAccepted;
    connection = await getPool().getConnection();
    await connection.beginTransaction();
    const [result] = await connection.execute("INSERT INTO vehicle_offers (request_type, customer_name, phone, vehicle_data, note) VALUES (?, ?, ?, ?, ?)", [data.transactionType, data.fullName, data.phone, JSON.stringify(vehicleData), data.conditionNote || null]);
    offerId = result.insertId;
    for (const [index, photo] of photos.entries()) {
      const extension = extensionForMime(photo.type);
      const filename = `${crypto.randomUUID()}${extension}`;
      const filePath = uploadPath("offers", String(result.insertId), filename);
      await saveUpload(filePath, await photo.arrayBuffer(), photo.type);
      savedFiles.push(filePath);
      await connection.execute(
        "INSERT INTO offer_images (offer_id, image_url, sort_order) VALUES (?, ?, ?)",
        [result.insertId, `/api/media/offer/${result.insertId}/${filename}`, index],
      );
    }
    await connection.commit();
    return Response.json({ ok: true }, { status: 201 });
  } catch (error) {
    await connection?.rollback();
    await Promise.all(savedFiles.map((filePath) => deleteUpload(filePath).catch(() => {})));
    if (connection && offerId) await connection.execute("DELETE FROM vehicle_offers WHERE id = ?", [offerId]).catch(() => {});
    console.error("Vehicle offer submission failed", error);
    return Response.json({ error: "Talebiniz şu anda kaydedilemedi. Lütfen daha sonra tekrar deneyin." }, { status: 503 });
  } finally {
    connection?.release();
  }
}
