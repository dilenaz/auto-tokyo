This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.js`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
# Auto Tokyo

## Yönetici paneli kurulumu

1. MySQL üzerinde `database/schema.sql` dosyasını çalıştırın.
2. `.env.example` dosyasını `.env.local` adıyla kopyalayın ve gerçek veritabanı bilgilerini girin.
3. `SESSION_SECRET` için en az 32 karakterlik rastgele bir değer kullanın.
4. İlk yönetici hesabını oluşturun:

```powershell
$env:ADMIN_INITIAL_PASSWORD="REPLACE_WITH_A_STRONG_PASSWORD"
npm run admin:create -- "Yönetici Adı" "yonetici@autotokyo.com.tr"
Remove-Item Env:ADMIN_INITIAL_PASSWORD
```

5. Uygulamayı başlatıp `/yonetim/giris` adresinden giriş yapın.

Yerel proje MySQL örneğini açmak ve kapatmak için:

```bash
npm run mysql:start
npm run mysql:stop
```

Parola düz metin olarak veritabanına yazılmaz; bcrypt ile karma değere dönüştürülür. Oturum çerezi `httpOnly`, `sameSite=lax` ve üretimde `secure` olarak ayarlanır. `.env.local` dosyasını kaynak kod deposuna eklemeyin.

## Kontroller

```bash
npm run lint
npm run build
```

## Production deployment

This application requires a persistent Node.js server and MySQL 8. It is not suitable for an ephemeral/serverless filesystem unless the upload layer is replaced with an object-storage provider.

Required production configuration:

- Set all variables from `.env.example` with production values.
- Use a unique `SESSION_SECRET` of at least 32 random characters.
- Set `UPLOAD_DIR` to a writable, persistent volume and include it in backups.
- Run `database/schema.sql` with a database administrator account, then grant the application user only `SELECT`, `INSERT`, `UPDATE` and `DELETE` permissions on the application database.
- Terminate traffic with HTTPS and forward the original client IP using `X-Forwarded-For`.
- Run `npm run build`, then serve with `npm run start` behind a reverse proxy.

Uploaded vehicle and offer images are served through controlled application routes. Offer images require an authenticated administrator session. Rate limits are shared through the database audit log, so they continue to work with multiple application instances.

### Docker deployment

```bash
npm run deploy:env
docker compose up -d --build
docker compose ps
```

Create the first administrator after the services become healthy:

```bash
docker compose exec -e ADMIN_INITIAL_PASSWORD="REPLACE_WITH_A_STRONG_PASSWORD" app node scripts/create-admin.mjs "Yönetici" "admin@example.com"
```

Do not add `ADMIN_INITIAL_PASSWORD` to `deploy.env`. Pass it only to the one-off command and remove it from shell history where appropriate. Configure HTTPS at the hosting provider or replace the included HTTP-only Nginx proxy with the server's TLS reverse proxy configuration.
