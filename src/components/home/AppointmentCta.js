import Link from "next/link";
import {
  ArrowRight,
  CalendarCheck,
  CheckCircle2,
  Clock3,
  MessageCircle,
} from "lucide-react";
import Container from "@/components/ui/Container";

const details = [
  "45 dakikalık görüşme",
  "Aynı gün randevu imkânı",
  "WhatsApp üzerinden onay",
];

export default function AppointmentCta() {
  return (
    <section className="relative overflow-hidden py-24 sm:py-28">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_50%,rgba(237,17,31,0.13),transparent_34rem)]" />

      <Container className="relative">
        <div className="grid overflow-hidden rounded-[2rem] border border-white/10 bg-tokyo-surface shadow-2xl lg:grid-cols-[0.9fr_1.1fr]">
          <div className="relative min-h-80 overflow-hidden bg-black p-8 sm:p-12">
            <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(237,17,31,0.24),transparent_48%)]" />

            <div className="absolute -bottom-24 -left-20 size-80 rounded-full border border-tokyo-red/20 shadow-[0_0_100px_rgba(237,17,31,0.14)]" />

            <div className="absolute -bottom-8 -left-4 size-56 rounded-full border border-white/10" />

            <div className="glass-panel absolute right-8 top-8 grid size-24 place-items-center rounded-3xl sm:right-12 sm:top-12 sm:size-28">
              <CalendarCheck
                aria-hidden="true"
                strokeWidth={1.2}
                className="size-12 text-tokyo-red sm:size-14"
              />
            </div>

            <div className="relative flex h-full flex-col justify-end">
              <span className="text-xs font-bold uppercase tracking-[0.28em] text-tokyo-red">
                Pazartesi–Cumartesi
              </span>

              <p className="mt-3 font-display text-6xl font-extrabold text-white sm:text-7xl">
                09.00
                <span className="mx-3 text-tokyo-red">–</span>
                17.00
              </p>

              <div className="mt-4 flex items-center gap-2 text-sm text-tokyo-silver">
                <Clock3 aria-hidden="true" className="size-4 text-tokyo-red" />
                Pazar günleri kapalıdır.
              </div>
            </div>
          </div>

          <div className="p-8 sm:p-12 lg:p-14">
            <span className="text-xs font-bold uppercase tracking-[0.28em] text-tokyo-red sm:text-sm">
              Randevu
            </span>

            <h2 className="mt-5 font-display text-4xl font-extrabold uppercase leading-none text-white sm:text-5xl lg:text-6xl">
              Beğendiğiniz Aracı Yakından İnceleyin
            </h2>

            <p className="mt-6 text-sm leading-7 text-tokyo-silver sm:text-base">
              Araç inceleme, satış veya takas görüşmesi için uygun tarihi
              seçerek randevu talebinizi oluşturun. Talebiniz incelendikten
              sonra WhatsApp üzerinden bilgilendirileceksiniz.
            </p>

            <ul className="mt-7 grid gap-3">
              {details.map((detail) => (
                <li
                  key={detail}
                  className="flex items-center gap-3 text-sm text-white"
                >
                  <CheckCircle2
                    aria-hidden="true"
                    className="size-5 shrink-0 text-tokyo-red"
                  />
                  {detail}
                </li>
              ))}
            </ul>

            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/randevu"
                className="red-glow inline-flex items-center justify-center gap-2 rounded-full bg-tokyo-red px-7 py-4 text-sm font-bold text-white transition-all hover:-translate-y-1 hover:bg-red-500"
              >
                Randevu Oluştur
                <ArrowRight aria-hidden="true" className="size-4" />
              </Link>

              <a
                href="https://wa.me/905455520786"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-white/15 px-7 py-4 text-sm font-bold text-white transition-all hover:-translate-y-1 hover:border-tokyo-red/50 hover:bg-tokyo-red/10"
              >
                <MessageCircle aria-hidden="true" className="size-4" />
                WhatsApp&apos;tan Sor
              </a>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}