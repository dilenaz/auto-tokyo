import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  CalendarDays,
  CarFront,
  Fuel,
  Gauge,
  Settings2,
  Sparkles,
} from "lucide-react";
import { getPublicVehicles } from "@/lib/vehicles";
import Container from "@/components/ui/Container";
import SectionHeading from "@/components/ui/SectionHeading";
import VehicleCatalog from "@/components/vehicles/VehicleCatalog";
import RecentlyViewed from "@/components/vehicles/RecentlyViewed";

export const metadata = {
  title: "Araçlarımız",
  description:
    "Auto Tokyo Aksaray araç portföyünü inceleyin. Güncel araçları filtreleyin, karşılaştırın ve randevu oluşturun.",
};

export const dynamic = "force-dynamic";
export default async function VehiclesPage() {
  const vehicles = await getPublicVehicles();
  const publishedVehicles = vehicles.filter(
    (vehicle) => vehicle.status === "published",
  );

  const featuredVehicle =
    publishedVehicles.find((vehicle) => vehicle.featured) ||
    publishedVehicles[0];

  const featuredDetails = featuredVehicle
    ? [
        {
          icon: Gauge,
          label: "Kilometre",
          value: featuredVehicle.mileage || "Teyit ediliyor",
        },
        {
          icon: Fuel,
          label: "Yakıt",
          value: featuredVehicle.fuel || "Bilgi bekleniyor",
        },
        {
          icon: Settings2,
          label: "Vites",
          value: featuredVehicle.transmission || "Bilgi bekleniyor",
        },
        {
          icon: CalendarDays,
          label: "Model Yılı",
          value: featuredVehicle.year || "Bilgi bekleniyor",
        },
      ]
    : [];

  return (
    <>
      <section className="relative overflow-hidden border-b border-white/10 py-20 sm:py-24">
        <div className="absolute right-0 top-0 size-[28rem] translate-x-1/3 -translate-y-1/3 rounded-full bg-tokyo-red/10 blur-3xl" />

        <Container className="relative">
          <SectionHeading
            as="h1"
            eyebrow="Auto Tokyo"
            title="Araçlarımız"
            description="Güncel Auto Tokyo araç portföyünü inceleyin. Araçları filtreleyebilir, favorilerinize ekleyebilir, karşılaştırabilir ve araç inceleme randevusu oluşturabilirsiniz."
          />
        </Container>
      </section>

      {featuredVehicle && (
        <section className="py-16 sm:py-20">
          <Container>
            <div className="mb-7 flex items-center gap-3">
              <Sparkles
                aria-hidden="true"
                className="size-5 text-tokyo-red"
              />

              <span className="text-xs font-bold uppercase tracking-[0.25em] text-tokyo-red sm:text-sm">
                Öne Çıkan Araç
              </span>
            </div>

            <article className="relative isolate overflow-hidden rounded-[2rem] border border-white/10 bg-tokyo-surface shadow-2xl">
              <div className="absolute inset-0 -z-20 bg-[radial-gradient(circle_at_25%_50%,rgba(237,17,31,0.16),transparent_34rem)]" />

              <div className="grid lg:grid-cols-[1.15fr_0.85fr]">
                <div className="relative min-h-96 overflow-hidden border-b border-white/10 bg-gradient-to-br from-white/[0.06] via-black to-tokyo-red/10 lg:min-h-[34rem] lg:border-b-0 lg:border-r">
                  {featuredVehicle.image ? (
                    <Image
                      src={featuredVehicle.image}
                      alt={`${featuredVehicle.brand} ${featuredVehicle.model}`}
                      fill
                      priority
                      sizes="(max-width: 1024px) 100vw, 58vw"
                      className="object-cover"
                    />
                  ) : (
                    <CarFront aria-hidden="true" strokeWidth={0.8} className="absolute left-1/2 top-1/2 size-40 -translate-x-1/2 -translate-y-1/2 text-white/80" />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-black/10" />
                  <span className="absolute bottom-7 left-7 rounded-full border border-white/15 bg-black/60 px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-white backdrop-blur-md">
                    {featuredVehicle.color || "Auto Tokyo"}
                  </span>
                </div>

                <div className="flex flex-col justify-center p-7 sm:p-10 lg:p-12">
                  <p className="text-xs font-bold uppercase tracking-[0.25em] text-tokyo-red">
                    {featuredVehicle.brand}
                  </p>

                  <h2 className="mt-3 font-display text-4xl font-extrabold uppercase leading-none text-white sm:text-5xl">
                    {featuredVehicle.model}
                  </h2>

                  <p className="mt-5 text-sm leading-7 text-tokyo-silver">
                    {featuredVehicle.title}
                  </p>

                  <p className="mt-3 text-xs leading-6 text-tokyo-muted">
                    {[featuredVehicle.bodyType, featuredVehicle.engineVolume, featuredVehicle.traction]
                      .filter(Boolean)
                      .join(" • ")}
                  </p>

                  <div className="mt-8 grid grid-cols-2 gap-3 xl:grid-cols-4">
                    {featuredDetails.map((detail) => {
                      const Icon = detail.icon;

                      return (
                        <div
                          key={detail.label}
                          className="rounded-2xl border border-white/10 bg-white/[0.025] p-4"
                        >
                          <Icon
                            aria-hidden="true"
                            className="size-5 text-tokyo-red"
                          />

                          <p className="mt-3 text-[0.65rem] uppercase tracking-wider text-tokyo-muted">
                            {detail.label}
                          </p>

                          <p className="mt-1 truncate text-xs font-semibold text-white">
                            {detail.value}
                          </p>
                        </div>
                      );
                    })}
                  </div>

                  <div className="mt-9 border-t border-white/10 pt-7">
                    <p className="text-xs uppercase tracking-wider text-tokyo-muted">
                      Fiyat
                    </p>

                    <p className="mt-2 font-display text-3xl font-bold text-white">
                      {featuredVehicle.price
                        ? `${featuredVehicle.price.toLocaleString(
                            "tr-TR",
                          )} TL`
                        : "Bilgi için iletişime geçin"}
                    </p>
                  </div>

                  <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                    <Link
                      href={`/araclar/${featuredVehicle.slug}`}
                      className="red-glow inline-flex items-center justify-center gap-2 rounded-full bg-tokyo-red px-6 py-4 text-sm font-bold text-white transition-all hover:-translate-y-1 hover:bg-red-500"
                    >
                      Aracı İncele
                      <ArrowRight
                        aria-hidden="true"
                        className="size-4"
                      />
                    </Link>

                    <Link
                      href={`/randevu?vehicle=${featuredVehicle.slug}`}
                      className="inline-flex items-center justify-center rounded-full border border-white/15 px-6 py-4 text-sm font-bold text-white transition-all hover:border-tokyo-red/50 hover:bg-tokyo-red/10"
                    >
                      Randevu Al
                    </Link>
                  </div>
                </div>
              </div>
            </article>
          </Container>
        </section>
      )}

      <section className="pb-24 sm:pb-28">
        <Container>
          <div className="mb-8 border-b border-white/10 pb-7">
            <p className="text-xs font-bold uppercase tracking-[0.25em] text-tokyo-red">
              Güncel Portföy
            </p>

            <h2 className="mt-3 font-display text-4xl font-extrabold uppercase text-white sm:text-5xl">
              Tüm Araçlar
            </h2>
          </div>

          <VehicleCatalog vehicles={vehicles} />
          <RecentlyViewed vehicles={vehicles} />
        </Container>
      </section>
    </>
  );
}
