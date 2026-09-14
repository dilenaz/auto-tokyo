import {
  Camera,
  CarFront,
  CheckCircle2,
  MessageCircle,
  ShieldCheck,
} from "lucide-react";
import VehicleOfferForm from "@/components/forms/VehicleOfferForm";
import { getPublicVehicles } from "@/lib/vehicles";
import Container from "@/components/ui/Container";
import SectionHeading from "@/components/ui/SectionHeading";
import MobileActionBar from "@/components/layout/MobileActionBar";

export const metadata = {
  title: "Aracını Sat veya Takasa Ver",
  description:
    "Aracınızı Auto Tokyo'ya satmak veya portföyümüzdeki bir araçla takas etmek için çevrim içi değerlendirme talebi oluşturun.",
};

const informationItems = [
  {
    icon: CarFront,
    title: "Araç Bilgilerini Paylaşın",
    description:
      "Marka, model, yıl, kilometre ve araç durumuna ilişkin bilgileri forma girin.",
  },
  {
    icon: Camera,
    title: "Fotoğrafları Yükleyin",
    description:
      "Aracın dış ve iç görünümünü gösteren en az dört fotoğraf ekleyin.",
  },
  {
    icon: ShieldCheck,
    title: "Güvenli Değerlendirme",
    description:
      "Bilgileriniz yalnızca araç değerlendirme sürecinin yürütülmesi için kullanılır.",
  },
  {
    icon: MessageCircle,
    title: "WhatsApp’tan Dönüş",
    description:
      "Talebiniz incelendikten sonra Tuğra Çevik sizinle WhatsApp üzerinden iletişime geçer.",
  },
];

export const dynamic = "force-dynamic";
export default async function SellVehiclePage({ searchParams }) {
  const params = await searchParams;
  const initialTransaction = params?.type === "trade" ? "trade" : params?.type === "sale" ? "sale" : "";
  const initialVehicle = typeof params?.vehicle === "string" ? params.vehicle : "";
  const vehicles = await getPublicVehicles({ includeSold: false });
  return (
    <>
      <section className="relative overflow-hidden border-b border-white/10 py-20 sm:py-24">
        <div className="absolute right-0 top-0 size-[30rem] translate-x-1/3 -translate-y-1/3 rounded-full bg-tokyo-red/10 blur-3xl" />

        <Container className="relative">
          <SectionHeading
            as="h1"
            eyebrow="Satış ve Takas"
            title="Aracınızı Auto Tokyo ile Değerlendirin"
            description="Aracınızı satmak veya Auto Tokyo portföyündeki bir araçla takas etmek için bilgilerinizi ve fotoğraflarınızı gönderin. Ekibimiz inceleme sonrasında sizinle iletişime geçsin."
          />
        </Container>
      </section>

      <section className="py-16 sm:py-20 lg:py-24">
        <Container>
          <div className="grid items-start gap-10 lg:grid-cols-[0.72fr_1.28fr]">
            <aside className="lg:sticky lg:top-36">
              <div className="glass-panel rounded-[2rem] p-7 sm:p-8">
                <div className="red-glow grid size-16 place-items-center rounded-2xl bg-tokyo-red text-white">
                  <CarFront
                    aria-hidden="true"
                    className="size-8"
                  />
                </div>

                <h2 className="mt-7 font-display text-3xl font-extrabold uppercase text-white">
                  Nasıl Çalışır?
                </h2>

                <p className="mt-4 text-sm leading-7 text-tokyo-silver">
                  Formu eksiksiz doldurmanız aracınızın daha doğru ve hızlı
                  değerlendirilmesine yardımcı olur.
                </p>

                <div className="mt-8 grid gap-4">
                  {informationItems.map((item) => {
                    const Icon = item.icon;

                    return (
                      <article
                        key={item.title}
                        className="flex items-start gap-4 rounded-2xl border border-white/10 bg-black/20 p-4"
                      >
                        <div className="grid size-10 shrink-0 place-items-center rounded-xl bg-tokyo-red/10 text-tokyo-red">
                          <Icon
                            aria-hidden="true"
                            className="size-5"
                          />
                        </div>

                        <div>
                          <h3 className="text-sm font-semibold text-white">
                            {item.title}
                          </h3>

                          <p className="mt-1 text-xs leading-5 text-tokyo-silver">
                            {item.description}
                          </p>
                        </div>
                      </article>
                    );
                  })}
                </div>

                <div className="mt-7 flex items-start gap-3 rounded-2xl border border-amber-500/20 bg-amber-500/[0.06] p-4">
                  <CheckCircle2
                    aria-hidden="true"
                    className="mt-0.5 size-5 shrink-0 text-amber-400"
                  />

                  <p className="text-xs leading-5 text-amber-100/80">
                    Formu göndermeniz kesin bir alım veya takas teklifi
                    anlamına gelmez. Nihai değerlendirme araç görüldükten
                    sonra yapılır.
                  </p>
                </div>
              </div>
            </aside>

            <VehicleOfferForm vehicles={vehicles} initialTransaction={initialTransaction} initialVehicle={initialVehicle} />
          </div>
        </Container>
      </section>
      <MobileActionBar />
    </>
  );
}
