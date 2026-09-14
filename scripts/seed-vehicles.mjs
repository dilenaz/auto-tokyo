import nextEnv from "@next/env";
import mysql from "mysql2/promise";
import { vehicles } from "../src/data/vehicles.js";

const { loadEnvConfig } = nextEnv;
loadEnvConfig(process.cwd());

const connection = await mysql.createConnection({
  host: process.env.DATABASE_HOST,
  port: Number(process.env.DATABASE_PORT || 3306),
  database: process.env.DATABASE_NAME,
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
});

try {
  await connection.beginTransaction();
  for (const vehicle of vehicles) {
    await connection.execute(
      `INSERT INTO vehicles
        (id, slug, brand, model, title, price, model_year, mileage, fuel, transmission, body_type, engine_power, engine_volume, traction, color, damage_info, description, sahibinden_url, status, featured, published_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, IF(? = 'published', NOW(), NULL))
       ON DUPLICATE KEY UPDATE slug=VALUES(slug), brand=VALUES(brand), model=VALUES(model), title=VALUES(title), price=VALUES(price), model_year=VALUES(model_year), mileage=VALUES(mileage), fuel=VALUES(fuel), transmission=VALUES(transmission), body_type=VALUES(body_type), engine_power=VALUES(engine_power), engine_volume=VALUES(engine_volume), traction=VALUES(traction), color=VALUES(color), damage_info=VALUES(damage_info), description=VALUES(description), sahibinden_url=VALUES(sahibinden_url), featured=VALUES(featured)`,
      [vehicle.id, vehicle.slug, vehicle.brand, vehicle.model, vehicle.title, vehicle.price || null, vehicle.year || null, Number(String(vehicle.mileage || "").replace(/\D/g, "")) || null, vehicle.fuel || null, vehicle.transmission || null, vehicle.bodyType || null, vehicle.enginePower || null, vehicle.engineVolume || null, vehicle.traction || null, vehicle.color || null, vehicle.damageInfo || null, vehicle.description || null, vehicle.sahibindenUrl || null, vehicle.status, Boolean(vehicle.featured), vehicle.status],
    );
    await connection.execute("DELETE FROM vehicle_images WHERE vehicle_id = ?", [vehicle.id]);
    for (const [index, image] of (vehicle.images || [vehicle.image]).filter(Boolean).entries()) {
      await connection.execute("INSERT INTO vehicle_images (vehicle_id, image_url, alt_text, sort_order, is_cover) VALUES (?, ?, ?, ?, ?)", [vehicle.id, image, `${vehicle.brand} ${vehicle.model}`, index, index === 0]);
    }
    await connection.execute("DELETE FROM vehicle_features WHERE vehicle_id = ?", [vehicle.id]);
    for (const [index, feature] of (vehicle.features || []).entries()) {
      await connection.execute("INSERT INTO vehicle_features (vehicle_id, feature_name, sort_order) VALUES (?, ?, ?)", [vehicle.id, feature, index]);
    }
  }
  await connection.commit();
  console.log(`${vehicles.length} araç ve fotoğraf listeleri veritabanına aktarıldı.`);
} catch (error) {
  await connection.rollback();
  console.error(error);
  process.exitCode = 1;
} finally {
  await connection.end();
}
