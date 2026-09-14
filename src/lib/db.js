import "server-only";
import { env } from "cloudflare:workers";

function valuesForD1(values) {
  return values.map((value) => value instanceof Date ? value.toISOString() : value);
}
import bcrypt from "bcryptjs";
import { vehicles } from "@/data/vehicles";

let seedPromise;

async function ensureSchema() {
  await env.DB.prepare(`CREATE TABLE IF NOT EXISTS admins (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'owner',
    is_active INTEGER NOT NULL DEFAULT 1,
    last_login_at TEXT,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
  )`).run();

  await env.DB.prepare(`CREATE TABLE IF NOT EXISTS vehicles (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    slug TEXT NOT NULL UNIQUE,
    brand TEXT NOT NULL,
    model TEXT NOT NULL,
    title TEXT NOT NULL,
    price REAL,
    model_year INTEGER,
    mileage INTEGER,
    fuel TEXT,
    transmission TEXT,
    body_type TEXT,
    engine_power TEXT,
    engine_volume TEXT,
    traction TEXT,
    color TEXT,
    damage_info TEXT,
    description TEXT,
    sahibinden_url TEXT,
    status TEXT NOT NULL DEFAULT 'draft',
    featured INTEGER NOT NULL DEFAULT 0,
    published_at TEXT,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
  )`).run();

  await env.DB.prepare(`CREATE TABLE IF NOT EXISTS vehicle_images (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    vehicle_id INTEGER NOT NULL REFERENCES vehicles(id) ON DELETE CASCADE,
    image_url TEXT NOT NULL,
    alt_text TEXT,
    sort_order INTEGER NOT NULL DEFAULT 0,
    is_cover INTEGER NOT NULL DEFAULT 0,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
  )`).run();

  await env.DB.prepare(`CREATE TABLE IF NOT EXISTS vehicle_features (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    vehicle_id INTEGER NOT NULL REFERENCES vehicles(id) ON DELETE CASCADE,
    feature_name TEXT NOT NULL,
    sort_order INTEGER NOT NULL DEFAULT 0
  )`).run();

  await env.DB.prepare(`CREATE TABLE IF NOT EXISTS appointments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    appointment_type TEXT NOT NULL,
    vehicle_id INTEGER REFERENCES vehicles(id) ON DELETE SET NULL,
    customer_name TEXT NOT NULL,
    phone TEXT NOT NULL,
    email TEXT,
    appointment_at TEXT NOT NULL,
    note TEXT,
    status TEXT NOT NULL DEFAULT 'pending',
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(appointment_at)
  )`).run();

  await env.DB.prepare(`CREATE TABLE IF NOT EXISTS vehicle_offers (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    request_type TEXT NOT NULL,
    customer_name TEXT NOT NULL,
    phone TEXT NOT NULL,
    email TEXT,
    vehicle_data TEXT NOT NULL,
    note TEXT,
    status TEXT NOT NULL DEFAULT 'new',
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
  )`).run();

  await env.DB.prepare(`CREATE TABLE IF NOT EXISTS offer_images (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    offer_id INTEGER NOT NULL REFERENCES vehicle_offers(id) ON DELETE CASCADE,
    image_url TEXT NOT NULL,
    sort_order INTEGER NOT NULL DEFAULT 0,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
  )`).run();

  await env.DB.prepare(`CREATE TABLE IF NOT EXISTS contact_messages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    customer_name TEXT NOT NULL,
    phone TEXT,
    email TEXT,
    subject TEXT,
    message TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'new',
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
  )`).run();

  await env.DB.prepare(`CREATE TABLE IF NOT EXISTS audit_logs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    admin_id INTEGER REFERENCES admins(id) ON DELETE SET NULL,
    action TEXT NOT NULL,
    entity_type TEXT,
    entity_id INTEGER,
    metadata TEXT,
    ip_address TEXT,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
  )`).run();

  await env.DB.prepare(`CREATE TABLE IF NOT EXISTS rate_limit_buckets (
    bucket_hash TEXT NOT NULL,
    window_start INTEGER NOT NULL,
    hit_count INTEGER NOT NULL DEFAULT 1,
    expires_at INTEGER NOT NULL,
    PRIMARY KEY (bucket_hash, window_start)
  )`).run();
  await env.DB.prepare("CREATE INDEX IF NOT EXISTS idx_rate_limit_expires ON rate_limit_buckets(expires_at)").run();
}

async function seedDatabase() {
  const count = await env.DB.prepare("SELECT COUNT(*) count FROM vehicles").first();
  if (!Number(count?.count || 0)) {
    for (const vehicle of vehicles) {
      await env.DB.prepare(`INSERT INTO vehicles
        (slug,brand,model,title,price,model_year,mileage,fuel,transmission,body_type,engine_power,engine_volume,traction,color,damage_info,description,sahibinden_url,status,featured,published_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)`)
        .bind(vehicle.slug, vehicle.brand, vehicle.model, vehicle.title, vehicle.price || null,
          vehicle.year || null, Number(String(vehicle.mileage || "").replace(/\D/g, "")) || null,
          vehicle.fuel || null, vehicle.transmission || null, vehicle.bodyType || null, vehicle.enginePower || null,
          vehicle.engineVolume || null, vehicle.traction || null, vehicle.color || null, vehicle.damageInfo || null,
          vehicle.description || null, vehicle.sahibindenUrl || null, vehicle.status, vehicle.featured ? 1 : 0).run();
      for (const [index, image] of (vehicle.images || [vehicle.image]).filter(Boolean).entries()) {
        await env.DB.prepare("INSERT INTO vehicle_images (vehicle_id,image_url,alt_text,sort_order,is_cover) VALUES (?,?,?,?,?)")
          .bind(vehicle.id, image, `${vehicle.brand} ${vehicle.model}`, index, index === 0 ? 1 : 0).run();
      }
      for (const [index, feature] of (vehicle.features || []).entries()) {
        await env.DB.prepare("INSERT INTO vehicle_features (vehicle_id,feature_name,sort_order) VALUES (?,?,?)")
          .bind(vehicle.id, feature, index).run();
      }
    }
  }
  const email = env.ADMIN_EMAIL;
  const password = env.ADMIN_INITIAL_PASSWORD;
  if (email && password && password.length >= 12) {
    const existing = await env.DB.prepare("SELECT id FROM admins WHERE email = ?").bind(email).first();
    if (!existing) {
      const hash = await bcrypt.hash(password, 12);
      await env.DB.prepare("INSERT INTO admins (name,email,password_hash,role,is_active) VALUES (?,?,?,'owner',1)")
        .bind("Yönetici", email, hash).run();
    }
  }
}

async function ensureSeeded() {
  seedPromise ||= (async () => {
    await ensureSchema();
    return seedDatabase();
  })().catch((error) => { seedPromise = null; throw error; });
  return seedPromise;
}

async function execute(sql, values = []) {
  await ensureSeeded();
  const statement = env.DB.prepare(sql).bind(...valuesForD1(values));
  if (/^\s*(SELECT|WITH|PRAGMA)/i.test(sql)) {
    const result = await statement.all();
    return [result.results || [], []];
  }
  const result = await statement.run();
  return [{
    affectedRows: result.meta?.changes || 0,
    insertId: result.meta?.last_row_id || 0,
  }, []];
}

const connection = {
  execute,
  query: execute,
  beginTransaction: async () => {},
  commit: async () => {},
  rollback: async () => {},
  release: () => {},
};

export function getPool() {
  if (!env.DB) throw new Error("D1 veritabanı bağlantısı bulunamadı.");
  return { execute, query: execute, getConnection: async () => connection };
}

export async function query(sql, values = []) {
  const [rows] = await execute(sql, values);
  return rows;
}
