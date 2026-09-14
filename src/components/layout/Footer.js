"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ArrowUpRight,
  Camera,
  Clock3,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
} from "lucide-react";

const quickLinks = [
  {
    label: "Ana Sayfa",
    href: "/",
  },
  {
    label: "Araçlarımız",
    href: "/araclar",
  },
  {
    label: "Hakkımızda",
    href: "/hakkimizda",
  },
  {
    label: "Aracını Sat / Takasa Ver",
    href: "/aracini-sat",
  },
  {
    label: "Randevu Al",
    href: "/randevu",
  },
  {
    label: "İletişim",
    href: "/iletisim",
  },
];

export default function Footer() {
  const pathname = usePathname();
  const currentYear = new Date().getFullYear();

  if (pathname.startsWith("/yonetim")) return null;

  return (
    <footer className="border-t border-white/10 bg-black">
      <div className="mx-auto grid max-w-7xl gap-12 px-4 py-16 sm:px-6 lg:grid-cols-[1.2fr_0.8fr_1fr]">
        <div>
          <Link
            href="/"
            aria-label="Auto Tokyo ana sayfa"
            className="relative block h-28 w-48"
          >
            <Image
              src="/images/logo/auto-tokyo-logo.jpg"
              alt="Auto Tokyo"
              fill
              sizes="192px"
              className="object-contain"
            />
          </Link>

          <p className="mt-5 max-w-md text-sm leading-7 text-tokyo-silver">
            Auto Tokyo, Aksaray Merkez&apos;de güven, kalite ve performans
            anlayışıyla seçkin araçları müşterileriyle buluşturur.
          </p>

          <a
            href="https://www.instagram.com/autotokyo68/"
            target="_blank"
            rel="noreferrer"
            className="mt-7 inline-flex items-center gap-3 rounded-full border border-white/10 bg-white/[0.04] px-5 py-3 text-sm font-semibold text-white transition-all hover:border-tokyo-red/50 hover:bg-tokyo-red/10"
          >
            <Camera aria-hidden="true" className="size-5 text-tokyo-red" />
            @autotokyo68
            <ArrowUpRight aria-hidden="true" className="size-4" />
          </a>
        </div>

        <div>
          <h2 className="font-display text-xl font-bold uppercase tracking-wider text-white">
            Hızlı Bağlantılar
          </h2>

          <nav aria-label="Alt menü" className="mt-6 grid gap-3">
            {quickLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="w-fit text-sm text-tokyo-silver transition-colors hover:text-tokyo-red"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        <div>
          <h2 className="font-display text-xl font-bold uppercase tracking-wider text-white">
            İletişim
          </h2>

          <div className="mt-6 space-y-5 text-sm text-tokyo-silver">
            <div className="flex items-start gap-3">
              <MapPin
                aria-hidden="true"
                className="mt-0.5 size-5 shrink-0 text-tokyo-red"
              />
              <span>
                15 Temmuz Şehitler Bulvarı, B Blok No: 4, Otonomi,
                Aksaray/Merkez
              </span>
            </div>

            <a
              href="tel:+905455520786"
              className="flex items-center gap-3 transition-colors hover:text-white"
            >
              <Phone
                aria-hidden="true"
                className="size-5 shrink-0 text-tokyo-red"
              />
              Tuğra Çevik: 0545 552 07 86
            </a>

            <a
              href="tel:+905467749509"
              className="flex items-center gap-3 transition-colors hover:text-white"
            >
              <Phone
                aria-hidden="true"
                className="size-5 shrink-0 text-tokyo-red"
              />
              Ali Tezcan: 0546 774 95 09
            </a>

            <a
              href="mailto:autotokyo68@gmail.com"
              className="flex items-center gap-3 transition-colors hover:text-white"
            >
              <Mail
                aria-hidden="true"
                className="size-5 shrink-0 text-tokyo-red"
              />
              autotokyo68@gmail.com
            </a>

            <div className="flex items-start gap-3">
              <Clock3
                aria-hidden="true"
                className="mt-0.5 size-5 shrink-0 text-tokyo-red"
              />
              <span>
                Pazartesi–Cumartesi: 09.00–17.00
                <br />
                Pazar: Kapalı
              </span>
            </div>
          </div>

          <a
            href="https://wa.me/905455520786"
            target="_blank"
            rel="noreferrer"
            className="mt-7 inline-flex items-center gap-2 rounded-full bg-tokyo-red px-5 py-3 text-sm font-bold text-white transition-colors hover:bg-red-500"
          >
            <MessageCircle aria-hidden="true" className="size-4" />
            WhatsApp&apos;tan Yaz
          </a>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-6 text-xs text-tokyo-muted sm:px-6 md:flex-row md:items-center md:justify-between">
          <p>
            © {currentYear} Auto Tokyo. Tüm hakları saklıdır.
          </p>

          <div className="flex flex-wrap gap-5">
            <Link
              href="/kvkk"
              className="transition-colors hover:text-white"
            >
              KVKK Aydınlatma Metni
            </Link>

            <Link
              href="/gizlilik"
              className="transition-colors hover:text-white"
            >
              Gizlilik Politikası
            </Link>

            <Link
              href="/cerez-politikasi"
              className="transition-colors hover:text-white"
            >
              Çerez Politikası
            </Link>
          </div>
        </div>

        <div className="border-t border-white/[0.06] px-4 py-4 text-center text-xs text-tokyo-muted sm:px-6">
          Designed &amp; Developed by{" "}
          <Link
            href="https://dilenazozdemir.com.tr"
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold text-white transition-colors hover:text-tokyo-red"
          >
            Dilenaz Özdemir
          </Link>
        </div>
      </div>
    </footer>
  );
}
