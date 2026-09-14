import Link from "next/link";
import {
  ArrowRight,
  Clock3,
  Mail,
  MapPin,
  MessageCircle,
  Navigation,
  Phone,
} from "lucide-react";
import Container from "@/components/ui/Container";
import SectionHeading from "@/components/ui/SectionHeading";

const contacts = [
  {
    name: "Tuğra Çevik",
    role: "Ana iletişim ve WhatsApp",
    phone: "0545 552 07 86",
    phoneHref: "tel:+905455520786",
    whatsappHref: "https://wa.me/905455520786",
  },
  {
    name: "Ali Tezcan",
    role: "Kurucu ortak",
    phone: "0546 774 95 09",
    phoneHref: "tel:+905467749509",
    whatsappHref: "https://wa.me/905467749509",
  },
];

export default function ContactPreview() {
  return (
    <section className="relative overflow-hidden border-t border-white/10 py-24 sm:py-28">
      <Container>
        <div className="grid gap-14 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
          <div>
            <SectionHeading
              eyebrow="İletişim"
              title="Auto Tokyo’yu Ziyaret Edin"
              description="Araçlarımızı yakından incelemek, satış veya takas seçeneklerini görüşmek için Aksaray Otonomi’deki galerimizi ziyaret edebilirsiniz."
            />

            <div className="mt-8 grid gap-4">
              <div className="flex items-start gap-4 rounded-2xl border border-white/10 bg-white/[0.025] p-5">
                <div className="grid size-11 shrink-0 place-items-center rounded-xl bg-tokyo-red/10 text-tokyo-red">
                  <MapPin aria-hidden="true" className="size-5" />
                </div>

                <div>
                  <p className="text-xs uppercase tracking-wider text-tokyo-muted">
                    Adres
                  </p>

                  <p className="mt-2 text-sm leading-6 text-white">
                    15 Temmuz Şehitler Bulvarı, B Blok No: 4, Otonomi,
                    Aksaray/Merkez
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 rounded-2xl border border-white/10 bg-white/[0.025] p-5">
                <div className="grid size-11 shrink-0 place-items-center rounded-xl bg-tokyo-red/10 text-tokyo-red">
                  <Clock3 aria-hidden="true" className="size-5" />
                </div>

                <div>
                  <p className="text-xs uppercase tracking-wider text-tokyo-muted">
                    Çalışma Saatleri
                  </p>

                  <p className="mt-2 text-sm leading-6 text-white">
                    Pazartesi–Cumartesi: 09.00–17.00
                    <br />
                    Pazar: Kapalı
                  </p>
                </div>
              </div>

              <a
                href="mailto:autotokyo68@gmail.com"
                className="flex items-center gap-4 rounded-2xl border border-white/10 bg-white/[0.025] p-5 transition-colors hover:border-tokyo-red/40"
              >
                <div className="grid size-11 shrink-0 place-items-center rounded-xl bg-tokyo-red/10 text-tokyo-red">
                  <Mail aria-hidden="true" className="size-5" />
                </div>

                <div>
                  <p className="text-xs uppercase tracking-wider text-tokyo-muted">
                    E-posta
                  </p>

                  <p className="mt-2 text-sm text-white">
                    autotokyo68@gmail.com
                  </p>
                </div>
              </a>
            </div>

            <Link
              href="/iletisim"
              className="mt-8 inline-flex items-center gap-2 rounded-full border border-white/15 px-6 py-3.5 text-sm font-bold text-white transition-all hover:-translate-y-1 hover:border-tokyo-red/50 hover:bg-tokyo-red/10"
            >
              Tüm İletişim Bilgileri
              <ArrowRight aria-hidden="true" className="size-4" />
            </Link>
          </div>

          <div className="relative">
            <div className="absolute -right-16 -top-16 size-60 rounded-full bg-tokyo-red/10 blur-3xl" />

            <div className="glass-panel relative overflow-hidden rounded-[2rem] p-6 sm:p-8">
              <div className="relative mb-6 min-h-56 overflow-hidden rounded-2xl border border-white/10 bg-black">
                <iframe
                  title="Auto Tokyo harita konumu"
                  src="https://www.google.com/maps?q=38.3507208,33.9863527&z=16&output=embed"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="absolute inset-0 size-full border-0 grayscale-[.25]"
                />
              </div>

              <a
                href="https://maps.app.goo.gl/NXEieSLDxXSgS7As9?g_st=iw"
                target="_blank"
                rel="noreferrer"
                className="mb-6 inline-flex items-center gap-2 text-sm font-bold text-tokyo-red transition-colors hover:text-red-400"
              >
                <Navigation aria-hidden="true" className="size-4" />
                Google Haritalar&apos;da Yol Tarifi Al
              </a>

              <div className="grid gap-4">
                {contacts.map((contact) => (
                  <article
                    key={contact.name}
                    className="rounded-2xl border border-white/10 bg-black/30 p-5"
                  >
                    <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <h3 className="font-display text-2xl font-bold uppercase text-white">
                          {contact.name}
                        </h3>

                        <p className="mt-1 text-xs text-tokyo-muted">
                          {contact.role}
                        </p>

                        <a
                          href={contact.phoneHref}
                          className="mt-3 inline-flex items-center gap-2 text-sm font-semibold text-tokyo-silver transition-colors hover:text-white"
                        >
                          <Phone
                            aria-hidden="true"
                            className="size-4 text-tokyo-red"
                          />
                          {contact.phone}
                        </a>
                      </div>

                      <a
                        href={contact.whatsappHref}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center justify-center gap-2 rounded-full bg-tokyo-red px-5 py-3 text-sm font-bold text-white transition-colors hover:bg-red-500"
                      >
                        <MessageCircle
                          aria-hidden="true"
                          className="size-4"
                        />
                        WhatsApp
                      </a>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
