import { Scale } from "lucide-react";
import ComparisonContent from "@/components/comparison/ComparisonContent";
import Container from "@/components/ui/Container";
import SectionHeading from "@/components/ui/SectionHeading";
import { getPublicVehicles } from "@/lib/vehicles";

export const metadata = {
  title: "Araç Karşılaştırma",
  description:
    "Auto Tokyo araç portföyünden seçtiğiniz en fazla üç aracı özellikleriyle yan yana karşılaştırın.",
};

export const dynamic = "force-dynamic";
export default async function ComparisonPage() {
  const vehicles = await getPublicVehicles();
  return (
    <>
      <section className="relative overflow-hidden border-b border-white/10 py-20 sm:py-24">
        <div className="absolute left-0 top-0 size-[28rem] -translate-x-1/3 -translate-y-1/3 rounded-full bg-tokyo-red/10 blur-3xl" />

        <Container className="relative">
          <div className="mb-7 grid size-16 place-items-center rounded-2xl bg-tokyo-red/10 text-tokyo-red">
            <Scale aria-hidden="true" className="size-8" />
          </div>

          <SectionHeading
            as="h1"
            eyebrow="Yan Yana İnceleyin"
            title="Araç Karşılaştırma"
            description="Auto Tokyo portföyünden seçtiğiniz en fazla üç aracı model, kilometre, yakıt, vites ve fiyat bilgileriyle karşılaştırabilirsiniz."
          />
        </Container>
      </section>

      <section className="py-16 sm:py-20 lg:py-24">
        <Container>
          <ComparisonContent vehicles={vehicles} />
        </Container>
      </section>
    </>
  );
}
