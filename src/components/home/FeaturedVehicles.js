import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { getPublicVehicles } from "@/lib/vehicles";
import Container from "@/components/ui/Container";
import SectionHeading from "@/components/ui/SectionHeading";
import VehicleCard from "@/components/ui/VehicleCard";

export default async function FeaturedVehicles() {
  const vehicles = await getPublicVehicles({ includeSold: false });
  const featuredVehicles = vehicles.filter((vehicle) => vehicle.featured).slice(0, 3);
  return (
    <section className="relative overflow-hidden py-24 sm:py-28">
      <div className="absolute right-0 top-1/3 size-96 translate-x-1/2 rounded-full bg-tokyo-red/[0.07] blur-3xl" />

      <Container className="relative">
        <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <SectionHeading
            eyebrow="Araç Portföyü"
            title="Öne Çıkan Araçlarımız"
            description="Auto Tokyo portföyünde öne çıkan araçları keşfedin. Ayrıntılı bilgi almak veya randevu oluşturmak için aracı inceleyebilirsiniz."
          />

          <Link
            href="/araclar"
            className="inline-flex w-fit shrink-0 items-center gap-2 rounded-full border border-white/15 px-6 py-3.5 text-sm font-bold text-white transition-all hover:-translate-y-1 hover:border-tokyo-red/50 hover:bg-tokyo-red/10"
          >
            Tüm Araçları Gör
            <ArrowRight aria-hidden="true" className="size-4" />
          </Link>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {featuredVehicles.map((vehicle) => (
            <VehicleCard key={vehicle.id} vehicle={vehicle} />
          ))}
        </div>

        {featuredVehicles.length === 0 && (
          <div className="mt-12 rounded-3xl border border-white/10 bg-white/[0.025] px-6 py-16 text-center">
            <p className="text-sm text-tokyo-silver">
              Öne çıkan araçlar yakında burada görüntülenecek.
            </p>
          </div>
        )}
      </Container>
    </section>
  );
}
