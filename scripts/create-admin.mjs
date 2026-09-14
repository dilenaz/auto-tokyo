import nextEnv from "@next/env";
import mysql from "mysql2/promise";
import bcrypt from "bcryptjs";

const { loadEnvConfig } = nextEnv;
loadEnvConfig(process.cwd());

try {
  const [, , nameArg, emailArg] = process.argv;
  const name = nameArg?.trim();
  const email = emailArg?.trim().toLowerCase();
  const password = process.env.ADMIN_INITIAL_PASSWORD;

  if (!name || !email?.includes("@") || !password || password.length < 12) {
    throw new Error(
      "Kullanım: ADMIN_INITIAL_PASSWORD ortam değişkenini ayarlayın ve npm run admin:create -- \"Ad Soyad\" \"eposta@adres.com\" çalıştırın. Parola en az 12 karakter olmalıdır.",
    );
  }

  const connection = await mysql.createConnection({
    host: process.env.DATABASE_HOST,
    port: Number(process.env.DATABASE_PORT || 3306),
    database: process.env.DATABASE_NAME,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
  });
  const hash = await bcrypt.hash(password, 12);
  await connection.execute(
    "INSERT INTO admins (name, email, password_hash, role) VALUES (?, ?, ?, 'owner') ON DUPLICATE KEY UPDATE name = VALUES(name), password_hash = VALUES(password_hash), is_active = 1",
    [name, email, hash],
  );
  await connection.end();
  process.stdout.write("Yönetici hesabı güvenli biçimde oluşturuldu veya güncellendi.\n");
} catch (error) {
  process.stderr.write(`Hata: ${error.message}\n`);
  process.exitCode = 1;
}
