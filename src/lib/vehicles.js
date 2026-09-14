import "server-only";
import { query } from "@/lib/db";

function mapVehicle(row) {
  return {
    id: Number(row.id),
    slug: row.slug,
    brand: row.brand,
    model: row.model,
    title: row.title,
    price: row.price == null ? null : Number(row.price),
    year: row.model_year == null ? null : Number(row.model_year),
    mileage: row.mileage == null ? null : `${Number(row.mileage).toLocaleString("tr-TR")} km`,
    mileageValue: row.mileage == null ? null : Number(row.mileage),
    fuel: row.fuel,
    transmission: row.transmission,
    bodyType: row.body_type,
    enginePower: row.engine_power,
    engineVolume: row.engine_volume,
    traction: row.traction,
    color: row.color,
    damageInfo: row.damage_info,
    description: row.description,
    sahibindenUrl: row.sahibinden_url,
    status: row.status,
    featured: Boolean(row.featured),
    image: row.cover_image || row.first_image || null,
    images: row.images ? row.images.split("||| ").filter(Boolean) : [],
    features: row.features ? row.features.split("||| ").filter(Boolean) : [],
  };
}

const select = `
  SELECT v.*,
    (SELECT image_url FROM vehicle_images WHERE vehicle_id = v.id AND is_cover = 1 ORDER BY sort_order, id LIMIT 1) cover_image,
    (SELECT image_url FROM vehicle_images WHERE vehicle_id = v.id ORDER BY sort_order, id LIMIT 1) first_image,
    (SELECT GROUP_CONCAT(image_url, '||| ') FROM (
      SELECT image_url FROM vehicle_images WHERE vehicle_id = v.id ORDER BY sort_order, id
    )) images,
    (SELECT GROUP_CONCAT(feature_name, '||| ') FROM (
      SELECT feature_name FROM vehicle_features WHERE vehicle_id = v.id ORDER BY sort_order, id
    )) features
  FROM vehicles v`;

export async function getPublicVehicles({ includeSold = true } = {}) {
  const statuses = includeSold ? ["published", "sold"] : ["published"];
  const rows = await query(`${select} WHERE v.status IN (${statuses.map(() => "?").join(",")}) ORDER BY v.featured DESC, v.published_at DESC, v.id DESC`, statuses);
  return rows.map(mapVehicle);
}

export async function getVehicleBySlug(slug) {
  const rows = await query(`${select} WHERE v.slug = ? AND v.status IN ('published', 'sold') LIMIT 1`, [slug]);
  return rows[0] ? mapVehicle(rows[0]) : null;
}

export async function getVehicleForAdmin(id) {
  const rows = await query(`${select} WHERE v.id = ? LIMIT 1`, [id]);
  return rows[0] ? mapVehicle(rows[0]) : null;
}
