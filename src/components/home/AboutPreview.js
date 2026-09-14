import Link from "next/link";
import { ArrowRight, CalendarDays, MapPin, Users } from "lucide-react";
import Container from "@/components/ui/Container";
import SectionHeading from "@/components/ui/SectionHeading";

const facts = [
  {
    icon: CalendarDays,
    value: "30 Nisan 2026",
    label: "Açılış Tarihi",
  },
  {
    icon: Users,
    value: "Tuğra Çevik & Ali Tezcan",
    label: "Kurucu Ortaklar",
  },
  {
    icon: MapPin,
    value: "Aksaray / Merkez",
    label: "Hizmet Noktasi",
  },
];

export default function AboutPreview() {
  return (
    <section className="relative overflow-hidden py-24 sm:py-28">
      <div className="absolute left-0 top-1/2 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-tokyo-red/10 blur-3xl" />

      <Container className="relative">
        <div className="grid items-center gap-14 lg:grid-cols-2 lg:gap-20">
          <div className="relative min-h-[28rem]">
            <div className="absolute left-0 top-0 h-[82%] w-[82%] overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-white/10 via-white/[0.025] to-tokyo-red/10 shadow-2xl">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_65%_35%,rgba(237,17,31,0.25),transparent_45%)]" />

              <div className="absolute inset-8 flex flex-col justify-between rounded-2xl border border-white/10 bg-black/30 p-7 backdrop-blur-sm">
                <span className="text-xs font-bold uppercase tracking-[0.3em] text-tokyo-red">
                  Auto Tokyo
                </span>

                <div>
                  <p className="font-display text-5xl font-extrabold uppercase leading-[0.9] text-white sm:text-6xl">
                    Otomobile
                    <br />
                    duyulan
                    <br />
                    tutku.
                  </p>

                  <p className="mt-5 text-sm tracking-[0.2em] text-tokyo-silver">
                    GÜVEN – KALİTE – PERFORMANS
                  </p>
                </div>
              </div>
            </div>

            <div className="glass-panel red-glow absolute bottom-0 right-0 w-[72%] rounded-3xl p-7">
              <p className="font-display text-5xl font-extrabold text-tokyo-red">
                2026
              </p>

              <p className="mt-2 text-sm leading-6 text-tokyo-silver">
                Aksaray&apos;da güvenilir ve şeffaf araç alışverişi için
                çıktığımız yolculuğun başlangıcı.
              </p>
            </div>
          </div>

          <div>
            <SectionHeading
              eyebrow="Hakkımızda"
              title="Auto Tokyo’yu Yakından Tanıyın"
              description="Auto Tokyo, otomobile duydukları tutkuyu güvenilir hizmet anlayışıyla birleştiren Tuğra Çevik ve Ali Tezcan tarafından Aksaray’da hayata geçirildi."
            />

            <p className="mt-6 text-sm leading-7 text-tokyo-silver sm:text-base">
              Seçkin araç portföyü, şeffaf bilgilendirme ve müşteri
              memnuniyetini merkeze alan yaklaşımımızla araç alım, satım ve
              takas süreçlerini daha güvenli ve kolay hâle getiriyoruz.
            </p>

            <div className="mt-8 grid gap-4">
              {facts.map((fact) => {
                const Icon = fact.icon;

                return (
                  <div
                    key={fact.label}
                    className="flex items-center gap-4 rounded-2xl border border-white/10 bg-white/[0.025] p-4"
                  >
                    <div className="grid size-11 shrink-0 place-items-center rounded-xl bg-tokyo-red/10 text-tokyo-red">
                      <Icon aria-hidden="true" className="size-5" />
                    </div>

                    <div>
                      <p className="text-xs uppercase tracking-wider text-tokyo-muted">
                        {fact.label}
                      </p>

                      <p className="mt-1 text-sm font-semibold text-white">
                        {fact.value}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            <Link
              href="/hakkimizda"
              className="mt-9 inline-flex items-center gap-2 rounded-full border border-white/15 px-6 py-3.5 text-sm font-bold text-white transition-all hover:-translate-y-1 hover:border-tokyo-red/50 hover:bg-tokyo-red/10"
            >
              Hikâyemizi Keşfet
              <ArrowRight aria-hidden="true" className="size-4" />
            </Link>
          </div>
        </div>
      </Container>
    </section>
  );
}
