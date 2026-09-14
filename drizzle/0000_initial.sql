CREATE TABLE IF NOT EXISTS admins (
  id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL, email TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL, role TEXT NOT NULL DEFAULT 'owner', is_active INTEGER NOT NULL DEFAULT 1,
  last_login_at TEXT, created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP, updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE IF NOT EXISTS vehicles (
  id INTEGER PRIMARY KEY AUTOINCREMENT, slug TEXT NOT NULL UNIQUE, brand TEXT NOT NULL, model TEXT NOT NULL,
  title TEXT NOT NULL, price REAL, model_year INTEGER, mileage INTEGER, fuel TEXT, transmission TEXT,
  body_type TEXT, engine_power TEXT, engine_volume TEXT, traction TEXT, color TEXT, damage_info TEXT,
  description TEXT, sahibinden_url TEXT, status TEXT NOT NULL DEFAULT 'draft', featured INTEGER NOT NULL DEFAULT 0,
  published_at TEXT, created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP, updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_vehicles_status ON vehicles(status);
CREATE INDEX IF NOT EXISTS idx_vehicles_featured ON vehicles(featured);
CREATE TABLE IF NOT EXISTS vehicle_images (
  id INTEGER PRIMARY KEY AUTOINCREMENT, vehicle_id INTEGER NOT NULL REFERENCES vehicles(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL, alt_text TEXT, sort_order INTEGER NOT NULL DEFAULT 0, is_cover INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_vehicle_images_order ON vehicle_images(vehicle_id, sort_order);
CREATE TABLE IF NOT EXISTS vehicle_features (
  id INTEGER PRIMARY KEY AUTOINCREMENT, vehicle_id INTEGER NOT NULL REFERENCES vehicles(id) ON DELETE CASCADE,
  feature_name TEXT NOT NULL, sort_order INTEGER NOT NULL DEFAULT 0
);
CREATE TABLE IF NOT EXISTS appointments (
  id INTEGER PRIMARY KEY AUTOINCREMENT, appointment_type TEXT NOT NULL, vehicle_id INTEGER REFERENCES vehicles(id) ON DELETE SET NULL,
  customer_name TEXT NOT NULL, phone TEXT NOT NULL, email TEXT, appointment_at TEXT NOT NULL, note TEXT,
  status TEXT NOT NULL DEFAULT 'pending', created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP, UNIQUE(appointment_at)
);
CREATE INDEX IF NOT EXISTS idx_appointments_status_date ON appointments(status, appointment_at);
CREATE TABLE IF NOT EXISTS vehicle_offers (
  id INTEGER PRIMARY KEY AUTOINCREMENT, request_type TEXT NOT NULL, customer_name TEXT NOT NULL, phone TEXT NOT NULL,
  email TEXT, vehicle_data TEXT NOT NULL, note TEXT, status TEXT NOT NULL DEFAULT 'new',
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP, updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_vehicle_offers_status ON vehicle_offers(status);
CREATE TABLE IF NOT EXISTS offer_images (
  id INTEGER PRIMARY KEY AUTOINCREMENT, offer_id INTEGER NOT NULL REFERENCES vehicle_offers(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL, sort_order INTEGER NOT NULL DEFAULT 0, created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE IF NOT EXISTS contact_messages (
  id INTEGER PRIMARY KEY AUTOINCREMENT, customer_name TEXT NOT NULL, phone TEXT, email TEXT, subject TEXT,
  message TEXT NOT NULL, status TEXT NOT NULL DEFAULT 'new', created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_contact_messages_status ON contact_messages(status);
CREATE TABLE IF NOT EXISTS audit_logs (
  id INTEGER PRIMARY KEY AUTOINCREMENT, admin_id INTEGER REFERENCES admins(id) ON DELETE SET NULL,
  action TEXT NOT NULL, entity_type TEXT, entity_id INTEGER, metadata TEXT, ip_address TEXT,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_audit_logs_admin_date ON audit_logs(admin_id, created_at);
