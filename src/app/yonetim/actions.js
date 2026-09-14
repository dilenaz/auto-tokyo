"use server";

import bcrypt from "bcryptjs";
import { z } from "zod";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import crypto from "node:crypto";
import { query } from "@/lib/db";
import { createSession, deleteSession } from "@/lib/session";
import { requireAdmin } from "@/lib/auth";
import { checkRateLimit, requestIpFromHeaders } from "@/lib/rate-limit";
import { deleteUpload, extensionForMime, saveUpload, uploadPath } from "@/lib/uploads";

const loginSchema = z.object({
  email: z.string().email().max(190).transform((value) => value.toLowerCase().trim()),
  password: z.string().min(8).max(128),
});

export async function loginAction(_state, formData) {
  const requestHeaders = await headers();
  const ip = requestIpFromHeaders(requestHeaders);
  const emailKey = String(formData.get("email") || "").trim().toLowerCase();
  if (!(await checkRateLimit(`admin-login:${ip}:${emailKey}`, 5, 15 * 60_000))) {
    return { error: "Çok fazla giriş denemesi yapıldı. Lütfen 15 dakika sonra tekrar deneyin." };
  }
  const parsed = loginSchema.safeParse({ email: formData.get("email"), password: formData.get("password") });
  if (!parsed.success) return { error: "E-posta veya parola geçersiz." };
  try {
    const rows = await query(
      "SELECT id, name, email, role, password_hash FROM admins WHERE email = ? AND is_active = 1 LIMIT 1",
      [parsed.data.email],
    );
    const admin = rows[0];
    if (!admin || !(await bcrypt.compare(parsed.data.password, admin.password_hash))) {
      return { error: "E-posta veya parola hatalı." };
    }
    await query("UPDATE admins SET last_login_at = CURRENT_TIMESTAMP WHERE id = ?", [admin.id]);
    await createSession(admin);
  } catch (error) {
    console.error("Admin login failed", error);
    return { error: "Yönetim sistemi henüz yapılandırılmamış veya erişilemiyor." };
  }
  redirect("/yonetim");
}

export async function logoutAction() {
  await deleteSession();
  redirect("/yonetim/giris");
}

const statusSchema = z.enum(["draft", "published", "sold", "archived"]);
export async function updateVehicleStatus(formData) {
  const admin = await requireAdmin();
  const vehicleId = z.coerce.number().int().positive().parse(formData.get("vehicleId"));
  const status = statusSchema.parse(formData.get("status"));
  await query("UPDATE vehicles SET status = ?, published_at = CASE WHEN ? = 'published' THEN COALESCE(published_at, CURRENT_TIMESTAMP) ELSE published_at END WHERE id = ?", [status, status, vehicleId]);
  await query("INSERT INTO audit_logs (admin_id, action, entity_type, entity_id) VALUES (?, 'vehicle.status_updated', 'vehicle', ?)", [admin.id, vehicleId]);
  revalidatePath("/yonetim/araclar");
  revalidatePath("/araclar");
}

const requestConfig = {
  appointment: { table: "appointments", path: "/yonetim/randevular", statuses: ["pending", "approved", "completed", "rejected", "cancelled", "no_show"] },
  offer: { table: "vehicle_offers", path: "/yonetim/teklifler", statuses: ["new", "reviewing", "contacted", "appointment_created", "completed", "rejected"] },
  message: { table: "contact_messages", path: "/yonetim/mesajlar", statuses: ["new", "read", "replied", "archived"] },
};

export async function updateRequestStatus(formData) {
  const admin = await requireAdmin();
  const entity = z.enum(["appointment", "offer", "message"]).parse(formData.get("entity"));
  const id = z.coerce.number().int().positive().parse(formData.get("id"));
  const config = requestConfig[entity];
  const status = z.enum(config.statuses).parse(formData.get("status"));
  await query(`UPDATE ${config.table} SET status = ? WHERE id = ?`, [status, id]);
  await query("INSERT INTO audit_logs (admin_id, action, entity_type, entity_id, metadata) VALUES (?, 'request.status_updated', ?, ?, ?)", [admin.id, entity, id, JSON.stringify({ status })]);
  revalidatePath(config.path);
  redirect(config.path);
}

const vehicleSchema = z.object({
  id: z.coerce.number().int().positive().optional(),
  brand: z.string().trim().min(1).max(100),
  model: z.string().trim().min(1).max(160),
  title: z.string().trim().min(1).max(255),
  slug: z.string().trim().min(1).max(190),
  price: z.coerce.number().nonnegative().nullable(),
  modelYear: z.coerce.number().int().min(1900).max(2100).nullable(),
  mileage: z.coerce.number().int().nonnegative().nullable(),
  status: statusSchema,
});

const optionalText = (formData, name) => String(formData.get(name) || "").trim() || null;
const nullableNumber = (value) => value === "" || value == null ? null : value;

function makeSlug(value) {
  return value.toLocaleLowerCase("tr-TR").normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/ı/g, "i").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

function decodeHtml(value = "") {
  const named = { amp: "&", quot: '"', apos: "'", lt: "<", gt: ">", nbsp: " " };
  return String(value)
    .replace(/&#(\d+);/g, (_, code) => String.fromCodePoint(Number(code)))
    .replace(/&#x([\da-f]+);/gi, (_, code) => String.fromCodePoint(Number.parseInt(code, 16)))
    .replace(/&([a-z]+);/gi, (match, name) => named[name.toLowerCase()] ?? match)
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function metaContent(html, name) {
  const escaped = name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const patterns = [
    new RegExp(`<meta[^>]+(?:property|name)=["']${escaped}["'][^>]+content=["']([^"']*)["']`, "i"),
    new RegExp(`<meta[^>]+content=["']([^"']*)["'][^>]+(?:property|name)=["']${escaped}["']`, "i"),
  ];
  return decodeHtml(patterns.map((pattern) => html.match(pattern)?.[1]).find(Boolean) || "");
}

function listingDetails(html) {
  const details = {};
  for (const match of html.matchAll(/<li[^>]*>\s*<strong[^>]*>([\s\S]*?)<\/strong>\s*<span[^>]*>([\s\S]*?)<\/span>/gi)) {
    details[decodeHtml(match[1]).toLocaleLowerCase("tr-TR")] = decodeHtml(match[2]);
  }
  return details;
}

function jsonLdEntries(html) {
  const entries = [];
  for (const match of html.matchAll(/<script[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)) {
    try {
      const parsed = JSON.parse(decodeHtml(match[1]));
      entries.push(...(Array.isArray(parsed) ? parsed : [parsed]));
    } catch {}
  }
  return entries.flatMap((entry) => Array.isArray(entry?.["@graph"]) ? entry["@graph"] : [entry]);
}

function numberFromText(value) {
  const digits = String(value || "").replace(/\D/g, "");
  return digits ? Number(digits) : null;
}

function validateSahibindenUrl(value) {
  const url = new URL(String(value || ""));
  if (url.protocol !== "https:" || !["sahibinden.com", "www.sahibinden.com"].includes(url.hostname) || !url.pathname.startsWith("/ilan/")) {
    throw new Error("Geçerli bir Sahibinden ilan bağlantısı girin.");
  }
  url.hash = "";
  return url;
}

async function fetchListing(url) {
  const response = await fetch(url, {
    redirect: "manual",
    headers: { "user-agent": "Mozilla/5.0 (compatible; AutoTokyo/1.0)", accept: "text/html" },
    signal: AbortSignal.timeout(12_000),
  });
  if (response.status === 403 || response.status === 429) return null;
  if (!response.ok) throw new Error("İlan sayfasına erişilemedi. İlanın yayında olduğunu kontrol edin.");
  if (!response.headers.get("content-type")?.includes("text/html")) throw new Error("Bağlantı bir ilan sayfası döndürmedi.");
  const length = Number(response.headers.get("content-length") || 0);
  if (length > 5 * 1024 * 1024) throw new Error("İlan sayfası güvenli boyut sınırını aşıyor.");
  const html = await response.text();
  if (html.length > 5 * 1024 * 1024) throw new Error("İlan sayfası güvenli boyut sınırını aşıyor.");
  return html;
}

function listingFallback(url) {
  const lastPart = url.pathname.split("/").filter(Boolean).at(-2) || "sahibinden-ilani";
  const listingId = lastPart.match(/(\d+)$/)?.[1] || crypto.randomUUID().slice(0, 8);
  const readable = lastPart
    .replace(/-ilanda-?\d*$/i, "")
    .replace(/^vasita-(?:otomobil|arazi-suv-pickup)-/i, "")
    .split("-")
    .filter(Boolean)
    .map((word) => word.charAt(0).toLocaleUpperCase("tr-TR") + word.slice(1))
    .join(" ");
  return {
    brand: "Belirtilmedi", model: "Belirtilmedi", title: readable || "Sahibinden İlanı",
    slug: makeSlug(`sahibinden-${listingId}`), price: null, modelYear: null, mileage: null,
    fuel: null, transmission: null, bodyType: null, enginePower: null, engineVolume: null,
    traction: null, color: null, description: "Sahibinden bağlantısından oluşturulan taslak. Yayınlamadan önce araç bilgilerini ve fotoğrafları tamamlayın.", images: [],
  };
}

function parseSahibindenListing(html, url) {
  const nodes = jsonLdEntries(html);
  const product = nodes.find((node) => ["Product", "Vehicle", "Car"].includes(node?.["@type"])) || {};
  const details = listingDetails(html);
  const title = decodeHtml(product.name || metaContent(html, "og:title")).replace(/\s*[|\-]\s*sahibinden\.com.*$/i, "").trim();
  const description = decodeHtml(product.description || metaContent(html, "og:description"));
  const rawImages = [
    ...(Array.isArray(product.image) ? product.image : [product.image]),
    metaContent(html, "og:image"),
    ...html.replaceAll("\\/", "/").match(/https:\/\/[^"'\s<>]+/g) || [],
  ];
  const images = [...new Set(rawImages.filter(Boolean).map((item) => {
    try {
      const imageUrl = new URL(typeof item === "string" ? item : item?.url);
      return imageUrl.protocol === "https:" && (imageUrl.hostname === "sahibinden.com" || imageUrl.hostname.endsWith(".sahibinden.com")) ? imageUrl.href : null;
    } catch { return null; }
  }).filter(Boolean))].filter((item) => /\.(?:jpe?g|png|webp)(?:\?|$)/i.test(item)).slice(0, 20);
  const brand = decodeHtml(product.brand?.name || product.brand || details.marka || "Belirtilmedi");
  const model = decodeHtml(product.model || details.model || details.seri || "Belirtilmedi");
  const listingId = url.pathname.match(/-(\d+)\/detay\/?$/)?.[1] || crypto.randomUUID().slice(0, 8);
  return {
    brand, model, title: title || `${brand} ${model}`,
    slug: makeSlug(`${brand}-${model}-${listingId}`),
    price: numberFromText(product.offers?.price || details.fiyat || metaContent(html, "product:price:amount")),
    modelYear: numberFromText(product.vehicleModelDate || product.modelDate || details.yıl),
    mileage: numberFromText(product.mileageFromOdometer?.value || details.km),
    fuel: decodeHtml(product.fuelType || details.yakıt || "") || null,
    transmission: decodeHtml(product.vehicleTransmission || details.vites || "") || null,
    bodyType: decodeHtml(product.bodyType || details["kasa tipi"] || "") || null,
    enginePower: details["motor gücü"] || null,
    engineVolume: details["motor hacmi"] || null,
    traction: details.çekiş || null,
    color: decodeHtml(product.color || details.renk || "") || null,
    description, images,
  };
}

async function importRemoteImages(connection, vehicleId, urls, altText, budget = null) {
  let order = 0;
  let totalBytes = 0;
  for (const url of urls.slice(0, 10)) {
    if (budget && (budget.imagesRemaining <= 0 || budget.bytesRemaining <= 0 || Date.now() >= budget.deadline)) break;
    try {
      const response = await fetch(url, { redirect: "manual", signal: AbortSignal.timeout(12_000) });
      const type = response.headers.get("content-type")?.split(";")[0] || "";
      const extension = extensionForMime(type);
      if (!response.ok || !extension) continue;
      const data = await response.arrayBuffer();
      if (data.byteLength > 12 * 1024 * 1024 || totalBytes + data.byteLength > 48 * 1024 * 1024 || (budget && data.byteLength > budget.bytesRemaining)) continue;
      totalBytes += data.byteLength;
      const filename = `${crypto.randomUUID()}${extension}`;
      await saveUpload(uploadPath("vehicles", String(vehicleId), filename), data, type);
      await connection.execute("INSERT INTO vehicle_images (vehicle_id, image_url, alt_text, sort_order, is_cover) VALUES (?, ?, ?, ?, ?)", [vehicleId, `/api/media/vehicle/${vehicleId}/${filename}`, altText, order, order === 0 ? 1 : 0]);
      order += 1;
      if (budget) { budget.imagesRemaining -= 1; budget.bytesRemaining -= data.byteLength; }
    } catch {}
  }
  return order;
}

function normalizedImportKey(value) {
  return String(value || "").toLocaleLowerCase("tr-TR").normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/ı/g, "i").replace(/[^a-z0-9]/g, "");
}

function parseCsv(text) {
  const delimiter = (text.split(/\r?\n/, 1)[0].match(/;/g)?.length || 0) > (text.split(/\r?\n/, 1)[0].match(/,/g)?.length || 0) ? ";" : ",";
  const rows = []; let row = []; let value = ""; let quoted = false;
  for (let index = 0; index < text.length; index += 1) {
    const char = text[index];
    if (char === '"' && quoted && text[index + 1] === '"') { value += '"'; index += 1; }
    else if (char === '"') quoted = !quoted;
    else if (char === delimiter && !quoted) { row.push(value.trim()); value = ""; }
    else if ((char === "\n" || char === "\r") && !quoted) {
      if (char === "\r" && text[index + 1] === "\n") index += 1;
      row.push(value.trim()); value = ""; if (row.some(Boolean)) rows.push(row); row = [];
    } else value += char;
  }
  row.push(value.trim()); if (row.some(Boolean)) rows.push(row);
  const headers = rows.shift()?.map(normalizedImportKey) || [];
  return rows.map((values) => Object.fromEntries(headers.map((header, index) => [header, values[index] || ""])));
}

function parseXml(text) {
  const blocks = [...text.matchAll(/<(ilan|listing|vehicle|item|ad)\b[^>]*>([\s\S]*?)<\/\1>/gi)].map((match) => match[2]);
  return blocks.map((block) => {
    const record = {};
    for (const match of block.matchAll(/<([\w:-]+)\b[^>]*>(?:<!\[CDATA\[)?([\s\S]*?)(?:\]\]>)?<\/\1>/g)) record[normalizedImportKey(match[1])] = decodeHtml(match[2]);
    record.images = [...block.replaceAll("&amp;", "&").matchAll(/https:\/\/[^\s<"']+/g)].map((match) => match[0]);
    return record;
  });
}

function parseImportFile(text, extension) {
  if (extension === "json") {
    const parsed = JSON.parse(text);
    const records = Array.isArray(parsed) ? parsed : parsed.listings || parsed.ilanlar || parsed.vehicles || parsed.items || parsed.ads;
    if (!Array.isArray(records)) throw new Error("JSON dosyasında ilan listesi bulunamadı.");
    return records;
  }
  if (extension === "xml") return parseXml(text);
  return parseCsv(text.replace(/^\uFEFF/, ""));
}

function normalizeImportRecord(record) {
  const source = Object.fromEntries(Object.entries(record || {}).map(([key, value]) => [normalizedImportKey(key), value]));
  const pick = (...keys) => keys.map((key) => source[normalizedImportKey(key)]).find((value) => value !== undefined && value !== null && String(value).trim() !== "");
  const listingId = String(pick("ilanNo", "listingId", "adId", "id") || "").replace(/\D/g, "");
  const brand = decodeHtml(pick("marka", "brand", "make") || "Belirtilmedi").slice(0, 100);
  const model = decodeHtml(pick("model", "seri", "modelName") || "Belirtilmedi").slice(0, 160);
  const title = decodeHtml(pick("baslik", "title", "ilanBasligi") || `${brand} ${model}`).slice(0, 255);
  const rawUrl = pick("ilanLinki", "listingUrl", "url", "sahibindenUrl");
  let sahibindenUrl = null;
  try { const url = new URL(String(rawUrl || "")); if (url.protocol === "https:" && (url.hostname === "sahibinden.com" || url.hostname.endsWith(".sahibinden.com"))) sahibindenUrl = url.href; } catch {}
  const imageValue = pick("fotograflar", "resimler", "images", "imageUrls", "photos");
  const candidates = [...(Array.isArray(imageValue) ? imageValue : String(imageValue || "").split(/[|,;\s]+/)), ...(Array.isArray(record.images) ? record.images : [])];
  const images = [...new Set(candidates.map((value) => { try { const url = new URL(String(value)); return url.protocol === "https:" && (url.hostname.endsWith(".sahibinden.com") || url.hostname === "sahibinden.com" || url.hostname.endsWith(".shbdn.com") || url.hostname === "shbdn.com") ? url.href : null; } catch { return null; } }).filter(Boolean))].slice(0, 20);
  return {
    listingId, brand, model, title, sahibindenUrl, images,
    slug: makeSlug(`${brand}-${model}-${listingId || crypto.randomUUID().slice(0, 8)}`),
    price: numberFromText(pick("fiyat", "price")), modelYear: numberFromText(pick("yil", "modelYili", "year")), mileage: numberFromText(pick("km", "kilometre", "mileage")),
    fuel: decodeHtml(pick("yakit", "fuel", "fuelType") || "") || null, transmission: decodeHtml(pick("vites", "transmission") || "") || null,
    bodyType: decodeHtml(pick("kasaTipi", "bodyType") || "") || null, enginePower: decodeHtml(pick("motorGucu", "enginePower") || "") || null,
    engineVolume: decodeHtml(pick("motorHacmi", "engineVolume") || "") || null, traction: decodeHtml(pick("cekis", "traction") || "") || null,
    color: decodeHtml(pick("renk", "color") || "") || null, description: decodeHtml(pick("aciklama", "description") || "") || null,
  };
}

export async function importSahibindenFileAction(_state, formData) {
  const admin = await requireAdmin();
  const file = formData.get("listingFile");
  if (!(file instanceof File) || !file.size) return { error: "Bir ilan dosyası seçin." };
  if (file.size > 8 * 1024 * 1024) return { error: "İlan dosyası en fazla 8 MB olabilir." };
  const extension = file.name.split(".").pop()?.toLowerCase();
  if (!["csv", "json", "xml"].includes(extension)) return { error: "CSV, JSON veya XML dosyası yükleyin." };
  try {
    const records = parseImportFile(await file.text(), extension);
    if (!records.length) return { error: "Dosyada aktarılabilir ilan bulunamadı." };
    if (records.length > 20) return { error: "Tek seferde en fazla 20 ilan aktarabilirsiniz." };
    const connection = await (await import("@/lib/db")).getPool().getConnection();
    const importBudget = { imagesRemaining: 40, bytesRemaining: 96 * 1024 * 1024, deadline: Date.now() + 25_000 };
    let imported = 0; let skipped = 0; let photoCount = 0;
    try {
      for (const rawRecord of records) {
        const data = normalizeImportRecord(rawRecord);
        const existing = await query("SELECT id FROM vehicles WHERE slug = ? OR (? IS NOT NULL AND sahibinden_url = ?) LIMIT 1", [data.slug, data.sahibindenUrl, data.sahibindenUrl]);
        if (existing[0]) { skipped += 1; continue; }
        const [result] = await connection.execute(`INSERT INTO vehicles
          (slug,brand,model,title,price,model_year,mileage,fuel,transmission,body_type,engine_power,engine_volume,traction,color,description,sahibinden_url,status,featured)
          VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?, 'draft', 0)`,
          [data.slug, data.brand, data.model, data.title, data.price, data.modelYear, data.mileage, data.fuel, data.transmission, data.bodyType, data.enginePower, data.engineVolume, data.traction, data.color, data.description, data.sahibindenUrl]);
        photoCount += await importRemoteImages(connection, result.insertId, data.images, `${data.brand} ${data.model}`, importBudget);
        imported += 1;
      }
      await connection.execute("INSERT INTO audit_logs (admin_id, action, entity_type, metadata) VALUES (?, 'vehicle.file_imported', 'vehicle', ?)", [admin.id, JSON.stringify({ source: "sahibinden_file", imported, skipped, photoCount, extension })]);
    } finally { connection.release(); }
    revalidatePath("/yonetim/araclar"); revalidatePath("/araclar");
    return { success: `${imported} araç taslak olarak aktarıldı, ${skipped} tekrar atlandı, ${photoCount} fotoğraf kaydedildi.` };
  } catch (error) {
    console.error("Sahibinden file import failed", error);
    return { error: error?.message || "İlan dosyası içe aktarılamadı." };
  }
}

export async function importSahibindenAction(_state, formData) {
  const admin = await requireAdmin();
  let connection;
  try {
    const url = validateSahibindenUrl(formData.get("sahibindenUrl"));
    const existing = await query("SELECT id FROM vehicles WHERE sahibinden_url = ? LIMIT 1", [url.href]);
    if (existing[0]) redirect(`/yonetim/araclar/${existing[0].id}/duzenle`);
    const data = listingFallback(url);
    const pool = (await import("@/lib/db")).getPool();
    connection = await pool.getConnection();
    const [result] = await connection.execute(`INSERT INTO vehicles
      (slug,brand,model,title,price,model_year,mileage,fuel,transmission,body_type,engine_power,engine_volume,traction,color,description,sahibinden_url,status,featured)
      VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?, 'draft', 0)`,
      [data.slug, data.brand, data.model, data.title, data.price, data.modelYear, data.mileage, data.fuel, data.transmission, data.bodyType, data.enginePower, data.engineVolume, data.traction, data.color, data.description, url.href]);
    await connection.execute("INSERT INTO audit_logs (admin_id, action, entity_type, entity_id, metadata) VALUES (?, 'vehicle.linked_draft_created', 'vehicle', ?, ?)", [admin.id, result.insertId, JSON.stringify({ source: "sahibinden", url: url.href, apiAccess: false })]);
    revalidatePath("/yonetim/araclar");
    redirect(`/yonetim/araclar/${result.insertId}/duzenle`);
  } catch (error) {
    if (error?.digest?.startsWith("NEXT_REDIRECT")) throw error;
    console.error("Sahibinden linked draft creation failed", error);
    return { error: error?.message || "Bağlantılı taslak oluşturulamadı. Bilgileri elle girmeyi deneyin." };
  } finally {
    connection?.release();
  }
}


const setupSchema = z.object({
  name: z.string().trim().min(2).max(100),
  password: z.string().min(12).max(128),
});
const INITIAL_ADMIN_EMAIL = "autotokyo68@gmail.com";

export async function setupAdminAction(_state, formData) {
  const parsed = setupSchema.safeParse({
    name: formData.get("name"), password: formData.get("password"),
  });
  if (!parsed.success) return { error: "Bilgileri kontrol edin. Parola en az 12 karakter olmalıdır." };
  const requestHeaders = await headers();
  const authenticatedEmail = requestHeaders.get("oai-authenticated-user-email")?.trim().toLowerCase();
  if (!authenticatedEmail || !z.string().email().safeParse(authenticatedEmail).success) {
    return { error: "Doğrulanmış kullanıcı bilgisi alınamadı. Siteye ChatGPT hesabınızla yeniden giriş yapın." };
  }
  if (authenticatedEmail !== INITIAL_ADMIN_EMAIL) {
    return { error: "Bu hesap yÃ¶netici kurulumunu tamamlamaya yetkili deÄŸil." };
  }
  const existing = await query("SELECT COUNT(*) total FROM admins");
  if (Number(existing[0]?.total || 0) > 0) return { error: "Yönetici hesabı zaten oluşturulmuş. Giriş ekranını kullanın." };
  const hash = await bcrypt.hash(parsed.data.password, 12);
  const pool = (await import("@/lib/db")).getPool();
  const [result] = await pool.execute(
    "INSERT INTO admins (name,email,password_hash,role,is_active) VALUES (?,?,?,'owner',1)",
    [parsed.data.name, INITIAL_ADMIN_EMAIL, hash],
  );
  await createSession({ id: result.insertId, name: parsed.data.name, role: "owner" });
  redirect("/yonetim");
}

async function saveVehicleImages(connection, vehicleId, files, altText) {
  const validFiles = files.filter((file) => file instanceof File && file.size > 0);
  if (!validFiles.length) return;
  if (validFiles.reduce((total, file) => total + file.size, 0) > 48 * 1024 * 1024) throw new Error("Toplam fotoğraf boyutu 48 MB'ı geçmemelidir.");
  const current = await connection.execute("SELECT COALESCE(MAX(sort_order), -1) max_order, COUNT(*) image_count FROM vehicle_images WHERE vehicle_id = ?", [vehicleId]);
  let order = Number(current[0][0].max_order) + 1;
  let imageCount = Number(current[0][0].image_count);
  for (const file of validFiles) {
    if (!file.type.startsWith("image/") || file.size > 12 * 1024 * 1024) throw new Error("Fotoğraflar JPEG, PNG, WebP veya AVIF olmalı ve 12 MB'ı geçmemelidir.");
    const extension = extensionForMime(file.type);
    if (!extension) throw new Error("Desteklenmeyen fotoğraf biçimi.");
    const filename = `${crypto.randomUUID()}${extension}`;
    await saveUpload(uploadPath("vehicles", String(vehicleId), filename), await file.arrayBuffer(), file.type);
    const imageUrl = `/api/media/vehicle/${vehicleId}/${filename}`;
    await connection.execute("INSERT INTO vehicle_images (vehicle_id, image_url, alt_text, sort_order, is_cover) VALUES (?, ?, ?, ?, ?)", [vehicleId, imageUrl, altText, order++, imageCount === 0 ? 1 : 0]);
    imageCount += 1;
  }
}

export async function saveVehicleAction(_state, formData) {
  const admin = await requireAdmin();
  const parsed = vehicleSchema.safeParse({
    id: formData.get("id") || undefined,
    brand: formData.get("brand"), model: formData.get("model"), title: formData.get("title"),
    slug: makeSlug(String(formData.get("slug") || `${formData.get("brand")} ${formData.get("model")}`)),
    price: nullableNumber(formData.get("price")), modelYear: nullableNumber(formData.get("modelYear")), mileage: nullableNumber(formData.get("mileage")),
    status: formData.get("status"),
  });
  if (!parsed.success) return { error: "Zorunlu araç bilgilerini kontrol edin." };
  const data = parsed.data;
  const pool = (await import("@/lib/db")).getPool();
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();
    const values = [data.slug, data.brand, data.model, data.title, data.price, data.modelYear, data.mileage,
      optionalText(formData, "fuel"), optionalText(formData, "transmission"), optionalText(formData, "bodyType"), optionalText(formData, "enginePower"), optionalText(formData, "engineVolume"), optionalText(formData, "traction"), optionalText(formData, "color"), optionalText(formData, "damageInfo"), optionalText(formData, "description"), optionalText(formData, "sahibindenUrl"), data.status, formData.get("featured") === "on" ? 1 : 0];
    let vehicleId = data.id;
    if (vehicleId) {
      await connection.execute("UPDATE vehicles SET slug=?, brand=?, model=?, title=?, price=?, model_year=?, mileage=?, fuel=?, transmission=?, body_type=?, engine_power=?, engine_volume=?, traction=?, color=?, damage_info=?, description=?, sahibinden_url=?, status=?, featured=?, published_at=CASE WHEN ?='published' THEN COALESCE(published_at,CURRENT_TIMESTAMP) ELSE published_at END WHERE id=?", [...values, data.status, vehicleId]);
      await connection.execute("DELETE FROM vehicle_features WHERE vehicle_id = ?", [vehicleId]);
    } else {
      const [result] = await connection.execute("INSERT INTO vehicles (slug,brand,model,title,price,model_year,mileage,fuel,transmission,body_type,engine_power,engine_volume,traction,color,damage_info,description,sahibinden_url,status,featured,published_at) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,CASE WHEN ?='published' THEN CURRENT_TIMESTAMP ELSE NULL END)", [...values, data.status]);
      vehicleId = result.insertId;
    }
    const features = String(formData.get("features") || "").split(/\r?\n|,/).map((item) => item.trim()).filter(Boolean);
    for (const [index, feature] of features.entries()) await connection.execute("INSERT INTO vehicle_features (vehicle_id, feature_name, sort_order) VALUES (?, ?, ?)", [vehicleId, feature.slice(0, 190), index]);
    await saveVehicleImages(connection, vehicleId, formData.getAll("images"), `${data.brand} ${data.model}`);
    await connection.execute("INSERT INTO audit_logs (admin_id, action, entity_type, entity_id) VALUES (?, ?, 'vehicle', ?)", [admin.id, data.id ? "vehicle.updated" : "vehicle.created", vehicleId]);
    await connection.commit();
  } catch (error) {
    await connection.rollback();
    console.error("Vehicle save failed", error);
    return { error: error?.code === "ER_DUP_ENTRY" ? "Bu bağlantı adı başka bir araçta kullanılıyor." : error.message || "Araç kaydedilemedi." };
  } finally { connection.release(); }
  revalidatePath("/"); revalidatePath("/araclar"); revalidatePath("/yonetim/araclar");
  redirect("/yonetim/araclar");
}

export async function deleteVehicleImage(formData) {
  const admin = await requireAdmin();
  const imageId = z.coerce.number().int().positive().parse(formData.get("imageId"));
  const rows = await query("SELECT id, vehicle_id, image_url FROM vehicle_images WHERE id = ? LIMIT 1", [imageId]);
  if (!rows[0]) return;
  await query("DELETE FROM vehicle_images WHERE id = ?", [imageId]);
  if (rows[0].image_url.startsWith("/api/media/vehicle/")) {
    const relativePath = rows[0].image_url.slice("/api/media/vehicle/".length).split("/");
    await deleteUpload(uploadPath("vehicles", ...relativePath)).catch(() => {});
  }
  await query("UPDATE vehicle_images SET is_cover = (id = (SELECT chosen FROM (SELECT id chosen FROM vehicle_images WHERE vehicle_id = ? ORDER BY sort_order,id LIMIT 1) x)) WHERE vehicle_id = ?", [rows[0].vehicle_id, rows[0].vehicle_id]);
  await query("INSERT INTO audit_logs (admin_id, action, entity_type, entity_id) VALUES (?, 'vehicle.image_deleted', 'vehicle', ?)", [admin.id, rows[0].vehicle_id]);
  revalidatePath(`/yonetim/araclar/${rows[0].vehicle_id}/duzenle`);
}

export async function changePasswordAction(_state, formData) {
  const admin = await requireAdmin();
  const currentPassword = String(formData.get("currentPassword") || "");
  const newPassword = String(formData.get("newPassword") || "");
  if (newPassword.length < 10) return { error: "Yeni parola en az 10 karakter olmalıdır." };
  const rows = await query("SELECT password_hash FROM admins WHERE id = ?", [admin.id]);
  if (!rows[0] || !(await bcrypt.compare(currentPassword, rows[0].password_hash))) return { error: "Mevcut parola hatalı." };
  await query("UPDATE admins SET password_hash = ? WHERE id = ?", [await bcrypt.hash(newPassword, 12), admin.id]);
  await query("INSERT INTO audit_logs (admin_id, action, entity_type, entity_id) VALUES (?, 'admin.password_changed', 'admin', ?)", [admin.id, admin.id]);
  return { success: "Parolanız güvenle değiştirildi." };
}
