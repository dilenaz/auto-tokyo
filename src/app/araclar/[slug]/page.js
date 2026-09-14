import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  CalendarDays,
  CheckCircle2,
  ExternalLink,
  Fuel,
  Gauge,
  MessageCircle,
  Phone,
  Settings2,
  RefreshCw,
} from "lucide-react";
import { getPublicVehicles, getVehicleBySlug } from "@/lib/vehicles";
import Container from "@/components/ui/Container";
import VehicleCard from "@/components/ui/VehicleCard";
import VehicleViewTracker from "@/components/vehicles/VehicleViewTracker";
import VehicleShare from "@/components/vehicles/VehicleShare";
import VehicleActions from "@/components/vehicles/VehicleActions";
import VehicleGallery from "@/components/vehicles/VehicleGallery";
import MobileActionBar from "@/components/layout/MobileActionBar";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }) {
  const { slug } = await params;

  const vehicle = await getVehicleBySlug(slug);

  if (!vehicle) {
    return {
      title: "Araç Bulunamadı",
    };
  }

  return {
    title: `${vehicle.brand} ${vehicle.model}`,
    description: `${vehicle.brand} ${vehicle.model} aracını Auto Tokyo güvencesiyle inceleyin ve randevu oluşturun.`,
  };
}

export default async function VehicleDetailPage({ params }) {
  const { slug } = await params;

  const vehicle = await getVehicleBySlug(slug);

  if (!vehicle) {
    notFound();
  }

  const vehicles = await getPublicVehicles();
  const similarVehicles = vehicles
    .filter(
      (item) =>
        item.id !== vehicle.id &&
        item.status === "published",
    )
    .slice(0, 3);
  const isSold = vehicle.status === "sold";

  const whatsappMessage = encodeURIComponent(
    `Merhaba, Auto Tokyo internet sitesindeki ${vehicle.brand} ${vehicle.model} aracı hakkında bilgi almak istiyorum.`,
  );

  const detailItems = [
    {
      icon: Gauge,
      label: "Kilometre",
      value: vehicle.mileage || "Bilgi eklenecek",
    },
    {
      icon: Fuel,
      label: "Yakıt",
      value: vehicle.fuel || "Bilgi eklenecek",
    },
    {
      icon: Settings2,
      label: "Vites",
      value: vehicle.transmission || "Bilgi eklenecek",
    },
    {
      icon: CalendarDays,
      label: "Model Yılı",
      value: vehicle.year || "Bilgi eklenecek",
    },
  ];

  const technicalItems = [
    ["Kasa Tipi", vehicle.bodyType],
    ["Motor Gücü", vehicle.enginePower],
    ["Motor Hacmi", vehicle.engineVolume],
    ["Çekiş", vehicle.traction],
    ["Renk", vehicle.color],
  ].filter(([, value]) => value);

  return (
    <>
      <VehicleViewTracker vehicleId={vehicle.id} />
      <section className="border-b border-white/10 py-4">
        <Container>
          <Link
            href="/araclar"
            className="inline-flex items-center gap-2 text-sm font-semibold text-tokyo-silver transition-colors hover:text-white"
          >
            <ArrowLeft aria-hidden="true" className="size-4" />
            Araçlara Geri Dön
          </Link>
        </Container>
      </section>

      <section className="py-6 sm:py-8">
        <Container>
          <div className="grid w-full min-w-0 items-stretch overflow-hidden rounded-[2rem] border border-white/10 bg-tokyo-surface shadow-[0_30px_100px_rgba(0,0,0,.35)] xl:grid-cols-[minmax(0,1.25fr)_minmax(22rem,.75fr)]">
            <div className="relative min-w-0 bg-black/35 p-3 sm:p-5">
              <VehicleGallery vehicle={vehicle} />
              <span className={`absolute left-7 top-7 z-10 rounded-full px-4 py-2 text-xs font-bold uppercase tracking-wider sm:left-9 sm:top-9 ${isSold ? "bg-white text-black" : "bg-tokyo-red text-white"}`}>
                {isSold ? "Satıldı" : vehicle.featured ? "Öne Çıkan" : "Auto Tokyo"}
              </span>
            </div>

            <aside className="min-w-0 border-t border-white/10 bg-[radial-gradient(circle_at_top_right,rgba(237,17,31,.12),transparent_18rem)] p-5 sm:p-7 xl:border-l xl:border-t-0">
              <p className="text-xs font-bold uppercase tracking-[0.25em] text-tokyo-red">
                {vehicle.brand}
              </p>

              <h1 className="mt-2 break-words font-display text-3xl font-extrabold uppercase leading-[.95] text-white sm:text-4xl">
                {vehicle.model}
              </h1>

              <p className="mt-3 text-sm leading-6 text-tokyo-silver">
                {vehicle.title}
              </p>

              <div className="mt-5 rounded-2xl border border-tokyo-red/25 bg-tokyo-red/[.07] p-4">
                <p className="text-xs uppercase tracking-wider text-tokyo-muted">
                  {isSold ? "İlan Durumu" : "Fiyat"}
                </p>

                <p className="mt-1 break-words font-display text-2xl font-bold text-white sm:text-3xl">
                  {isSold ? "Satıldı" : vehicle.price
                    ? `${vehicle.price.toLocaleString("tr-TR")} TL`
                    : "Bilgi için iletişime geçin"}
                </p>
              </div>

              <div className="mt-5 grid grid-cols-2 gap-2">
                {detailItems.map((detail) => {
                  const Icon = detail.icon;

                  return (
                    <div
                      key={detail.label}
                      className="rounded-2xl border border-white/10 bg-black/30 p-3"
                    >
                      <Icon
                        aria-hidden="true"
                        className="size-5 text-tokyo-red"
                      />

                      <p className="mt-2 text-[0.65rem] uppercase tracking-wider text-tokyo-muted">
                        {detail.label}
                      </p>

                      <p className="mt-1 text-xs font-semibold text-white">
                        {detail.value}
                      </p>
                    </div>
                  );
                })}
              </div>

              <div className="mt-5 grid gap-2">
                {!isSold && <>
                <Link
                  href={`/randevu?vehicle=${vehicle.slug}`}
                  className="red-glow inline-flex items-center justify-center gap-2 rounded-full bg-tokyo-red px-6 py-4 text-sm font-bold text-white transition-all hover:-translate-y-1 hover:bg-red-500"
                >
                  <CalendarDays
                    aria-hidden="true"
                    className="size-4"
                  />
                  Bu Araç İçin Randevu Al
                </Link>

                <Link href={`/aracini-sat?type=trade&vehicle=${vehicle.slug}`} className="inline-flex items-center justify-center gap-2 rounded-full border border-tokyo-red/50 bg-tokyo-red/10 px-6 py-4 text-sm font-bold text-white transition-all hover:bg-tokyo-red">
                  <RefreshCw aria-hidden="true" className="size-4" /> Aracını Bu Araçla Takas Et
                </Link>

                <a
                  href={`https://wa.me/905455520786?text=${whatsappMessage}`}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-white/15 px-6 py-4 text-sm font-bold text-white transition-all hover:border-tokyo-red/50 hover:bg-tokyo-red/10"
                >
                  <MessageCircle
                    aria-hidden="true"
                    className="size-4"
                  />
                  WhatsApp&apos;tan Bilgi Al
                </a>
                </>}

                <a
                  href="tel:+905455520786"
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-white/15 px-6 py-4 text-sm font-bold text-white transition-all hover:border-white/30 hover:bg-white/[0.05]"
                >
                  <Phone aria-hidden="true" className="size-4" />
                  Hemen Ara
                </a>
              </div>
            </aside>

            <div className="grid min-w-0 gap-3 border-t border-white/10 bg-black/20 p-4 md:grid-cols-2 xl:col-span-2 xl:px-6 xl:pb-6">
              <VehicleActions vehicleId={vehicle.id} />
              <VehicleShare title={`${vehicle.brand} ${vehicle.model} | Auto Tokyo`} />
            </div>
          </div>
        </Container>
      </section>

      <section className="border-y border-white/10 bg-white/[0.02] py-10 sm:py-12">
        <Container>
          <div className="grid gap-5 lg:grid-cols-[1.15fr_.85fr]">
            <article className="rounded-3xl border border-white/10 bg-tokyo-surface p-6 sm:p-7">
              <h2 className="font-display text-3xl font-bold uppercase text-white">
                Araç Hakkında
              </h2>

              <p className="mt-4 text-sm leading-7 text-tokyo-silver">
                {vehicle.description || `${vehicle.title}. Ayrıntılı açıklama daha sonra eklenecektir.`}
              </p>

              {vehicle.sahibindenUrl && <a
                href={vehicle.sahibindenUrl}
                target="_blank"
                rel="noreferrer"
                className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-tokyo-red transition-colors hover:text-red-400"
              >
                Sahibinden İlanını Görüntüle
                <ExternalLink
                  aria-hidden="true"
                  className="size-4"
                />
              </a>}
            </article>

            <article className="rounded-3xl border border-white/10 bg-tokyo-surface p-6 sm:p-7">
              <h2 className="font-display text-3xl font-bold uppercase text-white">
                Ekspertiz Bilgileri
              </h2>

              <div className="mt-5 grid gap-3">
                {[vehicle.damageInfo || "Boya, değişen ve tramer bilgileri doğrulanmayı bekliyor", "Bağımsız ekspertiz raporu henüz siteye yüklenmemiştir."].map((item) => (
                  <div
                    key={item}
                    className="flex items-center gap-3 rounded-2xl border border-white/10 bg-black/20 p-4"
                  >
                    <CheckCircle2
                      aria-hidden="true"
                      className="size-5 shrink-0 text-tokyo-red"
                    />

                    <span className="text-sm text-tokyo-silver">
                      {item}
                    </span>
                  </div>
                ))}
              </div>
            </article>
          </div>
        </Container>
      </section>

      {(technicalItems.length > 0 || vehicle.features?.length > 0) && (
        <section className="py-10 sm:py-12">
          <Container>
            <div className="grid gap-5 lg:grid-cols-[.85fr_1.15fr]">
              <article className="rounded-3xl border border-white/10 bg-tokyo-surface p-6 sm:p-7">
                <h2 className="font-display text-3xl font-bold uppercase text-white">Teknik Özellikler</h2>
                <dl className="mt-5 grid gap-2 sm:grid-cols-2">
                  {technicalItems.map(([label, value]) => <div key={label} className="rounded-xl border border-white/10 bg-black/20 p-3"><dt className="text-[.65rem] uppercase tracking-wider text-tokyo-muted">{label}</dt><dd className="mt-1 text-sm font-semibold text-white">{value}</dd></div>)}
                </dl>
              </article>
              <article className="rounded-3xl border border-white/10 bg-tokyo-surface p-6 sm:p-7">
                <h2 className="font-display text-3xl font-bold uppercase text-white">Donanım</h2>
                <ul className="mt-5 grid gap-2 sm:grid-cols-2">
                  {(vehicle.features || []).map((feature) => <li key={feature} className="flex items-start gap-2 rounded-xl border border-white/10 bg-black/20 p-3 text-sm text-tokyo-silver"><CheckCircle2 className="mt-0.5 size-4 shrink-0 text-tokyo-red" aria-hidden="true" />{feature}</li>)}
                </ul>
              </article>
            </div>
          </Container>
        </section>
      )}

      {similarVehicles.length > 0 && (
        <section className="py-16 sm:py-20">
          <Container>
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.25em] text-tokyo-red">
                Portföyümüz
              </p>

              <h2 className="mt-3 font-display text-4xl font-extrabold uppercase text-white sm:text-5xl">
                Benzer Araçlar
              </h2>
            </div>

            <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {similarVehicles.map((item) => (
                <VehicleCard key={item.id} vehicle={item} />
              ))}
            </div>
          </Container>
        </section>
      )}
      <MobileActionBar vehicleSlug={vehicle.slug} sold={isSold} />
    </>
  );
}
