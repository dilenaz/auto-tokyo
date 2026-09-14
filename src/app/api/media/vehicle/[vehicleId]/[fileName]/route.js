import { extensionForMime, readUpload, uploadPath } from "@/lib/uploads";
import { query } from "@/lib/db";

const mimeByExtension = { ".jpg": "image/jpeg", ".png": "image/png", ".webp": "image/webp", ".avif": "image/avif" };

export async function GET(_request, { params }) {
  const { vehicleId, fileName } = await params;
  if (!/^\d+$/.test(vehicleId) || !/^[a-f0-9-]+\.(jpg|png|webp|avif)$/.test(fileName)) return new Response(null, { status: 404 });
  try {
    const imageUrl = `/api/media/vehicle/${vehicleId}/${fileName}`;
    const rows = await query(`SELECT vi.id FROM vehicle_images vi
      JOIN vehicles v ON v.id = vi.vehicle_id
      WHERE vi.vehicle_id = ? AND vi.image_url = ? AND v.status IN ('published','sold') LIMIT 1`, [vehicleId, imageUrl]);
    if (!rows[0]) return new Response(null, { status: 404 });
    const data = await readUpload(uploadPath("vehicles", vehicleId, fileName));
    if (!data) return new Response(null, { status: 404 });
    const extension = fileName.slice(fileName.lastIndexOf("."));
    const type = mimeByExtension[extension];
    if (!type || !extensionForMime(type)) return new Response(null, { status: 404 });
    return new Response(data.body, { headers: { "Content-Type": type, "Cache-Control": "public, max-age=31536000, immutable", "X-Content-Type-Options": "nosniff" } });
  } catch {
    return new Response(null, { status: 404 });
  }
}
