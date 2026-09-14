import crypto from "node:crypto";
import { access, writeFile } from "node:fs/promises";

const target = new URL("../deploy.env", import.meta.url);

try {
  await access(target);
  console.error("deploy.env zaten mevcut. Mevcut sırların üzerine yazılmadı.");
  process.exitCode = 1;
} catch {
  const databasePassword = crypto.randomBytes(32).toString("base64url");
  const content = [
    `MYSQL_ROOT_PASSWORD=${crypto.randomBytes(36).toString("base64url")}`,
    "MYSQL_DATABASE=auto_tokyo",
    "MYSQL_USER=auto_tokyo_app",
    `MYSQL_PASSWORD=${databasePassword}`,
    "DATABASE_NAME=auto_tokyo",
    "DATABASE_USER=auto_tokyo_app",
    `DATABASE_PASSWORD=${databasePassword}`,
    `SESSION_SECRET=${crypto.randomBytes(48).toString("base64url")}`,
    `NEXT_SERVER_ACTIONS_ENCRYPTION_KEY=${crypto.randomBytes(32).toString("base64")}`,
    "",
  ].join("\n");
  await writeFile(target, content, { encoding: "utf8", mode: 0o600, flag: "wx" });
  console.log("deploy.env güvenli rastgele değerlerle oluşturuldu.");
}
