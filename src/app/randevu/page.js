import {
  CalendarCheck,
  CheckCircle2,
  Clock3,
  MessageCircle,
  ShieldCheck,
} from "lucide-react";
import AppointmentForm from "@/components/forms/AppointmentForm";
import Container from "@/components/ui/Container";
import SectionHeading from "@/components/ui/SectionHeading";
import MobileActionBar from "@/components/layout/MobileActionBar";
import { getPublicVehicles } from "@/lib/vehicles";

export const metadata = {
  title: "Randevu Al",
  description:
    "Auto Tokyo araç inceleme, araç satışı, takas veya genel görüşme randevunuzu çevrim içi oluşturun.",
};

const appointmentInformation = [
  {
    icon: Clock3,
    title: "45 Dakikalık Görüşme",
    description:
      "Her randevu için 45 dakikalık görüşme süresi ayrılır.",
  },
  {
    icon: CalendarCheck,
    title: "Aynı Gün Randevu",
    description:
      "Uygun saat bulunması hâlinde en az bir saat önceden randevu oluşturabilirsiniz.",
  },
  {
    icon: MessageCircle,
    title: "WhatsApp Onayi",
    description:
      "Talebiniz incelendikten sonra Tuğra Çevik tarafından WhatsApp üzerinden bilgilendirilirsiniz.",
  },
  {
    icon: ShieldCheck,
    title: "Güvenli Başvuru",
    description:
      "İletişim bilgileriniz yalnızca randevu sürecinin yürütülmesi amacıyla kullanılır.",
  },
];

export default async function AppointmentPage({ searchParams }) {
  const vehicles = await getPublicVehicles({ includeSold: false });
  const resolvedSearchParams = await searchParams;

  const initialVehicle =
    typeof resolvedSearchParams?.vehicle === "string"
      ? resolvedSearchParams.vehicle
      : "";

  return (
    <>
      <section className="relative overflow-hidden border-b border-white/10 py-20 sm:py-24">
        <div className="absolute left-0 top-0 size-[30rem] -translate-x-1/3 -translate-y-1/3 rounded-full bg-tokyo-red/10 blur-3xl" />

        <Container className="relative">
          <SectionHeading
            as="h1"
            eyebrow="Online Randevu"
            title="Auto Tokyo Randevunuzu Oluşturun"
            description="Araç inceleme, araç satışı, takas veya genel görüşme için uygun tarih ve saati seçerek randevu talebinizi birkaç adımda oluşturabilirsiniz."
          />
        </Container>
      </section>

      <section className="py-16 sm:py-20 lg:py-24">
        <Container>
          <div className="grid items-start gap-10 lg:grid-cols-[0.72fr_1.28fr]">
            <aside className="lg:sticky lg:top-36">
              <div className="glass-panel rounded-[2rem] p-7 sm:p-8">
                <div className="red-glow grid size-16 place-items-center rounded-2xl bg-tokyo-red text-white">
                  <CalendarCheck
                    aria-hidden="true"
                    className="size-8"
                  />
                </div>

                <h2 className="mt-7 font-display text-3xl font-extrabold uppercase text-white">
                  Randevu Bilgileri
                </h2>

                <p className="mt-4 text-sm leading-7 text-tokyo-silver">
                  Pazartesi–Cumartesi günleri 09.00–17.00 saatleri arasında
                  hizmet veriyoruz. Pazar günleri kapalıyız.
                </p>

                <div className="mt-8 grid gap-4">
                  {appointmentInformation.map((item) => {
                    const Icon = item.icon;

                    return (
                      <div
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
                      </div>
                    );
                  })}
                </div>

                <div className="mt-7 flex items-start gap-3 rounded-2xl border border-amber-500/20 bg-amber-500/[0.06] p-4">
                  <CheckCircle2
                    aria-hidden="true"
                    className="mt-0.5 size-5 shrink-0 text-amber-400"
                  />

                  <p className="text-xs leading-5 text-amber-100/80">
                    Formu gündermeniz randevunun doğrudan onaylandığı
                    anlamına gelmez. Onay durumu WhatsApp üzerinden
                    bildirilecektir.
                  </p>
                </div>
              </div>
            </aside>

            <AppointmentForm initialVehicle={initialVehicle} vehicles={vehicles} />
          </div>
        </Container>
      </section>
      <MobileActionBar />
    </>
  );
}
