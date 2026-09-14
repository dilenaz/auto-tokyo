import { getAdmin } from "@/lib/auth";
import { readUpload, uploadPath } from "@/lib/uploads";

const mimeByExtension = { ".jpg": "image/jpeg", ".png": "image/png", ".webp": "image/webp" };

export async function GET(_request, { params }) {
  if (!(await getAdmin())) return new Response(null, { status: 404 });
  const { offerId, index: fileName } = await params;
  if (!/^\d+$/.test(offerId) || !/^[a-f0-9-]+\.(jpg|png|webp)$/.test(fileName)) return new Response(null, { status: 404 });
  try {
    const data = await readUpload(uploadPath("offers", offerId, fileName));
    if (!data) return new Response(null, { status: 404 });
    const type = mimeByExtension[fileName.slice(fileName.lastIndexOf("."))];
    return new Response(data.body, { headers: { "Content-Type": type, "Cache-Control": "private, no-store", "X-Content-Type-Options": "nosniff" } });
  } catch {
    return new Response(null, { status: 404 });
  }
}
