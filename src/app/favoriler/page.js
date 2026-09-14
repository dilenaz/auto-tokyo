import { Heart } from "lucide-react";
import FavoritesContent from "@/components/favorites/FavoritesContent";
import Container from "@/components/ui/Container";
import SectionHeading from "@/components/ui/SectionHeading";
import { getPublicVehicles } from "@/lib/vehicles";

export const metadata = {
  title: "Favori Araçlarım",
  description:
    "Auto Tokyo araç portföyünden favorilerinize eklediğiniz araçları görüntüleyin.",
};

export const dynamic = "force-dynamic";
export default async function FavoritesPage() {
  const vehicles = await getPublicVehicles();
  return (
    <>
      <section className="relative overflow-hidden border-b border-white/10 py-20 sm:py-24">
        <div className="absolute right-0 top-0 size-[28rem] translate-x-1/3 -translate-y-1/3 rounded-full bg-tokyo-red/10 blur-3xl" />

        <Container className="relative">
          <div className="mb-7 grid size-16 place-items-center rounded-2xl bg-tokyo-red/10 text-tokyo-red">
            <Heart aria-hidden="true" className="size-8" />
          </div>

          <SectionHeading
            as="h1"
            eyebrow="Kaydettiğiniz Araçlar"
            title="Favori Araçlarım"
            description="Beğendiğiniz araçları üyelik oluşturmadan favorilerinize ekleyebilir ve bu sayfadan yeniden inceleyebilirsiniz."
          />
        </Container>
      </section>

      <section className="py-16 sm:py-20 lg:py-24">
        <Container>
          <FavoritesContent vehicles={vehicles} />
        </Container>
      </section>
    </>
  );
}
