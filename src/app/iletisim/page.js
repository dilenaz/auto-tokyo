import {
  Camera,
  Clock3,
  Mail,
  MapPin,
  MessageCircle,
  Navigation,
  Phone,
} from "lucide-react";
import ContactForm from "@/components/forms/ContactForm";
import Container from "@/components/ui/Container";
import SectionHeading from "@/components/ui/SectionHeading";
import MobileActionBar from "@/components/layout/MobileActionBar";

export const metadata = {
  title: "İletişim",
  description:
    "Auto Tokyo Aksaray adres, telefon, WhatsApp, çalışma saatleri ve iletişim formu bilgilerine ulaşın.",
};

const contactCards = [
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

export default function ContactPage() {
  return (
    <>
      <section className="relative overflow-hidden border-b border-white/10 py-20 sm:py-24">
        <div className="absolute left-0 top-0 size-[30rem] -translate-x-1/3 -translate-y-1/3 rounded-full bg-tokyo-red/10 blur-3xl" />

        <Container className="relative">
          <SectionHeading
            as="h1"
            eyebrow="Auto Tokyo"
            title="Bizimle İletişime Geçin"
            description="Araçlarımız, randevu, satış veya takas hakkında bilgi almak için bizimle telefon, WhatsApp, e-posta veya iletişim formu üzerinden iletişime geçebilirsiniz."
          />
        </Container>
      </section>

      <section className="py-16 sm:py-20 lg:py-24">
        <Container>
          <div className="grid gap-10 lg:grid-cols-[0.85fr_1.15fr]">
            <div className="grid gap-5">
              <article className="glass-panel rounded-[2rem] p-7 sm:p-8">
                <div className="grid size-14 place-items-center rounded-2xl bg-tokyo-red/10 text-tokyo-red">
                  <MapPin aria-hidden="true" className="size-7" />
                </div>

                <p className="mt-6 text-xs font-bold uppercase tracking-[0.22em] text-tokyo-red">
                  Adres
                </p>

                <h2 className="mt-3 font-display text-3xl font-extrabold uppercase text-white">
                  Aksaray Otonomi
                </h2>

                <p className="mt-4 text-sm leading-7 text-tokyo-silver">
                  15 Temmuz Şehitler Bulvarı, B Blok No: 4, Otonomi,
                  Aksaray/Merkez
                </p>
              </article>

              <article className="glass-panel rounded-[2rem] p-7 sm:p-8">
                <div className="grid size-14 place-items-center rounded-2xl bg-tokyo-red/10 text-tokyo-red">
                  <Clock3 aria-hidden="true" className="size-7" />
                </div>

                <p className="mt-6 text-xs font-bold uppercase tracking-[0.22em] text-tokyo-red">
                  Çalışma Saatleri
                </p>

                <div className="mt-4 space-y-3 text-sm">
                  <div className="flex items-center justify-between gap-4 border-b border-white/10 pb-3">
                    <span className="text-tokyo-silver">
                      Pazartesi–Cumartesi
                    </span>

                    <span className="font-semibold text-white">
                      09.00–17.00
                    </span>
                  </div>

                  <div className="flex items-center justify-between gap-4">
                    <span className="text-tokyo-silver">
                      Pazar
                    </span>

                    <span className="font-semibold text-tokyo-red">
                      Kapalı
                    </span>
                  </div>
                </div>
              </article>

              <a
                href="mailto:autotokyo68@gmail.com"
                className="glass-panel rounded-[2rem] p-7 transition-transform hover:-translate-y-1 sm:p-8"
              >
                <div className="grid size-14 place-items-center rounded-2xl bg-tokyo-red/10 text-tokyo-red">
                  <Mail aria-hidden="true" className="size-7" />
                </div>

                <p className="mt-6 text-xs font-bold uppercase tracking-[0.22em] text-tokyo-red">
                  E-posta
                </p>

                <p className="mt-3 break-all text-sm font-semibold text-white">
                  autotokyo68@gmail.com
                </p>
              </a>
            </div>

            <ContactForm />
          </div>
        </Container>
      </section>

      <section className="border-y border-white/10 bg-white/[0.02] py-20 sm:py-24">
        <Container>
          <SectionHeading
            eyebrow="Doğrudan İletişim"
            title="Kurucu Ortaklarımız"
            description="Auto Tokyo ile doğrudan iletişim kurmak için aşağıdaki telefon ve WhatsApp bağlantılarını kullanabilirsiniz."
            align="center"
          />

          <div className="mx-auto mt-12 grid max-w-5xl gap-6 md:grid-cols-2">
            {contactCards.map((contact) => (
              <article
                key={contact.name}
                className="rounded-[2rem] border border-white/10 bg-tokyo-surface p-7 sm:p-8"
              >
                <p className="text-xs font-bold uppercase tracking-[0.22em] text-tokyo-red">
                  {contact.role}
                </p>

                <h2 className="mt-3 font-display text-4xl font-extrabold uppercase text-white">
                  {contact.name}
                </h2>

                <a
                  href={contact.phoneHref}
                  className="mt-6 flex items-center gap-3 rounded-2xl border border-white/10 bg-black/20 p-4 text-sm font-semibold text-white transition-colors hover:border-tokyo-red/40"
                >
                  <Phone
                    aria-hidden="true"
                    className="size-5 text-tokyo-red"
                  />
                  {contact.phone}
                </a>

                <a
                  href={contact.whatsappHref}
                  target="_blank"
                  rel="noreferrer"
                  className="red-glow mt-4 inline-flex w-full items-center justify-center gap-2 rounded-full bg-tokyo-red px-6 py-4 text-sm font-bold text-white transition-colors hover:bg-red-500"
                >
                  <MessageCircle
                    aria-hidden="true"
                    className="size-5"
                  />
                  WhatsApp&apos;tan Yaz
                </a>
              </article>
            ))}
          </div>
        </Container>
      </section>

      <section className="py-20 sm:py-24">
        <Container>
          <div className="grid overflow-hidden rounded-[2rem] border border-white/10 bg-tokyo-surface shadow-2xl lg:grid-cols-[1.1fr_0.9fr]">
            <div className="relative min-h-96 overflow-hidden bg-black">
              <iframe
                title="Auto Tokyo Google Haritalar konumu"
                src="https://www.google.com/maps?q=38.3507208,33.9863527&z=16&output=embed"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="absolute inset-0 size-full border-0 grayscale-[.25]"
                allowFullScreen
              />
            </div>

            <div className="flex flex-col justify-center p-8 sm:p-12">
              <div className="grid size-14 place-items-center rounded-2xl bg-tokyo-red/10 text-tokyo-red">
                <Camera aria-hidden="true" className="size-7" />
              </div>

              <h2 className="mt-7 font-display text-4xl font-extrabold uppercase leading-none text-white sm:text-5xl">
                Galerimizi Ziyaret Edin
              </h2>

              <p className="mt-5 text-sm leading-7 text-tokyo-silver">
                Google Haritalar üzerinden konumumuzu görüntüleyebilir ve
                bulunduğunuz yerden yol tarifi oluşturabilirsiniz.
              </p>

              <p className="mt-5 text-sm font-semibold leading-7 text-white">
                15 Temmuz Şehitler Bulvarı, B Blok No: 4, Otonomi,
                Aksaray/Merkez
              </p>

              <a
                href="https://maps.app.goo.gl/NXEieSLDxXSgS7As9?g_st=iw"
                target="_blank"
                rel="noreferrer"
                className="red-glow mt-7 inline-flex w-fit items-center gap-2 rounded-full bg-tokyo-red px-6 py-3.5 text-sm font-bold text-white transition-colors hover:bg-red-500"
              >
                <Navigation aria-hidden="true" className="size-4" />
                Yol Tarifi Al
              </a>
            </div>
          </div>
        </Container>
      </section>
      <MobileActionBar />
    </>
  );
}
