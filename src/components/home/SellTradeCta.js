import Link from "next/link";
import {
  ArrowRight,
  BadgeTurkishLira,
  Camera,
  CarFront,
  RefreshCw,
} from "lucide-react";
import Container from "@/components/ui/Container";

const steps = [
  {
    icon: CarFront,
    number: "01",
    title: "Araç bilgilerini gir",
  },
  {
    icon: Camera,
    number: "02",
    title: "Fotoğrafları yükle",
  },
  {
    icon: BadgeTurkishLira,
    number: "03",
    title: "Değerlendirme talebi oluştur",
  },
];

export default function SellTradeCta() {
  return (
    <section className="relative overflow-hidden py-20 sm:py-24">
      <Container>
        <div className="relative isolate overflow-hidden rounded-[2rem] border border-white/10 bg-tokyo-surface px-6 py-14 shadow-2xl sm:px-10 lg:px-14">
          <div className="absolute inset-0 -z-20 bg-[linear-gradient(120deg,rgba(237,17,31,0.16),transparent_42%,rgba(255,255,255,0.025))]" />

          <div className="absolute -right-24 -top-40 -z-10 size-[30rem] rounded-full border border-tokyo-red/15" />

          <div className="absolute -right-8 -top-24 -z-10 size-[22rem] rounded-full border border-white/10 shadow-[0_0_100px_rgba(237,17,31,0.14)]" />

          <div className="grid items-center gap-12 lg:grid-cols-[1fr_1.1fr]">
            <div>
              <div className="mb-5 flex items-center gap-3">
                <RefreshCw
                  aria-hidden="true"
                  className="size-5 text-tokyo-red"
                />

                <span className="text-xs font-bold uppercase tracking-[0.26em] text-tokyo-red sm:text-sm">
                  Satış ve Takas
                </span>
              </div>

              <h2 className="font-display text-4xl font-extrabold uppercase leading-none text-white sm:text-5xl lg:text-6xl">
                Aracınızın Değerini Birlikte Belirleyelim
              </h2>

              <p className="mt-6 max-w-2xl text-sm leading-7 text-tokyo-silver sm:text-base">
                Aracınızı satmak veya Auto Tokyo portföyündeki bir araçla
                takas etmek için değerlendirme talebinizi birkaç adımda
                oluşturun.
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <Link href="/aracini-sat?type=sale" className="red-glow inline-flex items-center gap-2 rounded-full bg-tokyo-red px-7 py-4 text-sm font-bold text-white transition-all hover:-translate-y-1 hover:bg-red-500">Aracımı Sat <ArrowRight aria-hidden="true" className="size-4" /></Link>
                <Link href="/aracini-sat?type=trade" className="inline-flex items-center gap-2 rounded-full border border-white/15 px-7 py-4 text-sm font-bold text-white transition-all hover:border-tokyo-red hover:bg-tokyo-red/10"><RefreshCw aria-hidden="true" className="size-4" /> Takasa Ver</Link>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3">
              {steps.map((step) => {
                const Icon = step.icon;

                return (
                  <div
                    key={step.number}
                    className="glass-panel group relative overflow-hidden rounded-2xl p-5 transition-transform duration-300 hover:-translate-y-2"
                  >
                    <span className="absolute right-4 top-3 font-display text-4xl font-extrabold text-white/[0.05]">
                      {step.number}
                    </span>

                    <div className="grid size-11 place-items-center rounded-xl bg-tokyo-red/10 text-tokyo-red transition-colors group-hover:bg-tokyo-red group-hover:text-white">
                      <Icon aria-hidden="true" className="size-5" />
                    </div>

                    <p className="mt-5 text-sm font-semibold leading-6 text-white">
                      {step.title}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
