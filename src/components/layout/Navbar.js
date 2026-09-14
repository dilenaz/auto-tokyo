"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  ChevronDown,
  Heart,
  MapPin,
  Menu,
  MessageCircle,
  Phone,
  Scale,
  X,
} from "lucide-react";

const mainLinks = [
  {
    label: "Ana Sayfa",
    href: "/",
  },
  {
    label: "Araçlarımız",
    href: "/araclar",
  },
  {
    label: "İletişim",
    href: "/iletisim",
  },
];

const corporateLinks = [
  {
    label: "Hakkımızda",
    href: "/hakkimizda",
  },
  {
    label: "Aracını Sat / Takasa Ver",
    href: "/aracini-sat",
  },
];

export default function Navbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [corporateMenuOpen, setCorporateMenuOpen] = useState(false);

  const closeMenus = () => {
    setMobileMenuOpen(false);
    setCorporateMenuOpen(false);
  };

  const isActive = (href) => {
    if (href === "/") {
      return pathname === "/";
    }

    return pathname.startsWith(href);
  };

  const isCorporateActive = corporateLinks.some((link) =>
    isActive(link.href),
  );

  if (pathname.startsWith("/yonetim")) return null;

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-black/85 backdrop-blur-xl">
      <div className="hidden border-b border-white/10 bg-white/[0.025] lg:block">
        <div className="mx-auto flex h-9 max-w-7xl items-center justify-between px-6">
          <div className="flex items-center gap-2 text-xs text-tokyo-silver">
            <MapPin aria-hidden="true" className="size-3.5 text-tokyo-red" />
            <span>
              15 Temmuz Şehitler Bulvarı, B Blok No: 4, Otonomi,
              Aksaray/Merkez
            </span>
          </div>

          <div className="flex items-center gap-5 text-xs text-tokyo-silver">
            <span>Pazartesi–Cumartesi 09.00–17.00</span>

            <a
              href="tel:+905455520786"
              className="flex items-center gap-2 transition-colors hover:text-white"
            >
              <Phone aria-hidden="true" className="size-3.5 text-tokyo-red" />
              0545 552 07 86
            </a>
          </div>
        </div>
      </div>

      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6">
        <Link
          href="/"
          onClick={closeMenus}
          aria-label="Auto Tokyo ana sayfa"
          className="relative h-16 w-28 shrink-0 sm:h-[4.5rem] sm:w-32"
        >
          <Image
            src="/images/logo/auto-tokyo-logo.jpg"
            alt="Auto Tokyo"
            fill
            loading="eager"
            sizes="(max-width: 640px) 112px, 128px"
            className="object-contain"
          />
        </Link>

        <nav
          aria-label="Ana menü"
          className="hidden items-center gap-1 lg:flex"
        >
          {mainLinks.slice(0, 2).map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`relative px-4 py-3 text-sm font-semibold transition-colors ${
                isActive(link.href)
                  ? "text-white"
                  : "text-tokyo-silver hover:text-white"
              }`}
            >
              {link.label}

              {isActive(link.href) && (
                <span className="absolute inset-x-4 bottom-1 h-0.5 bg-tokyo-red shadow-[0_0_12px_rgba(237,17,31,0.8)]" />
              )}
            </Link>
          ))}

          <div
            className="relative"
            onMouseEnter={() => setCorporateMenuOpen(true)}
            onMouseLeave={() => setCorporateMenuOpen(false)}
          >
            <button
              type="button"
              aria-expanded={corporateMenuOpen}
              aria-haspopup="true"
              onClick={() => setCorporateMenuOpen((current) => !current)}
              className={`flex items-center gap-1 px-4 py-3 text-sm font-semibold transition-colors ${
                isCorporateActive
                  ? "text-white"
                  : "text-tokyo-silver hover:text-white"
              }`}
            >
              Kurumsal
              <ChevronDown
                aria-hidden="true"
                className={`size-4 transition-transform ${
                  corporateMenuOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            {corporateMenuOpen && (
              <div className="absolute left-1/2 top-full w-64 -translate-x-1/2 pt-3">
                <div className="glass-panel overflow-hidden rounded-2xl p-2">
                  {corporateLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={closeMenus}
                      className="block rounded-xl px-4 py-3 text-sm font-medium text-tokyo-silver transition-colors hover:bg-white/[0.06] hover:text-white"
                    >
                      {link.label}
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>

          <Link
            href="/iletisim"
            className={`relative px-4 py-3 text-sm font-semibold transition-colors ${
              isActive("/iletisim")
                ? "text-white"
                : "text-tokyo-silver hover:text-white"
            }`}
          >
            İletişim

            {isActive("/iletisim") && (
              <span className="absolute inset-x-4 bottom-1 h-0.5 bg-tokyo-red shadow-[0_0_12px_rgba(237,17,31,0.8)]" />
            )}
          </Link>
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          <Link
            href="/favoriler"
            aria-label="Favori araçlar"
            className="grid size-11 place-items-center rounded-full border border-white/10 bg-white/[0.04] text-tokyo-silver transition-all hover:border-tokyo-red/50 hover:text-white"
          >
            <Heart aria-hidden="true" className="size-5" />
          </Link>

          <Link
            href="/karsilastir"
            aria-label="Araç karşılaştırma"
            className="grid size-11 place-items-center rounded-full border border-white/10 bg-white/[0.04] text-tokyo-silver transition-all hover:border-tokyo-red/50 hover:text-white"
          >
            <Scale aria-hidden="true" className="size-5" />
          </Link>

          <a
            href="https://wa.me/905455520786"
            target="_blank"
            rel="noreferrer"
            aria-label="Tuğra Çevik ile WhatsApp üzerinden iletişim kur"
            className="grid size-11 place-items-center rounded-full border border-white/10 bg-white/[0.04] text-tokyo-silver transition-all hover:border-tokyo-red/50 hover:text-white"
          >
            <MessageCircle aria-hidden="true" className="size-5" />
          </a>

          <Link
            href="/randevu"
            className="red-glow rounded-full bg-tokyo-red px-6 py-3 text-sm font-bold text-white transition-all hover:-translate-y-0.5 hover:bg-red-500"
          >
            Randevu Al
          </Link>
        </div>

        <button
          type="button"
          aria-label={mobileMenuOpen ? "Menüyü kapat" : "Menüyü aç"}
          aria-expanded={mobileMenuOpen}
          onClick={() => setMobileMenuOpen((current) => !current)}
          className="grid size-11 place-items-center rounded-full border border-white/10 bg-white/[0.04] text-white lg:hidden"
        >
          {mobileMenuOpen ? (
            <X aria-hidden="true" className="size-5" />
          ) : (
            <Menu aria-hidden="true" className="size-5" />
          )}
        </button>
      </div>

      {mobileMenuOpen && (
        <nav
          aria-label="Mobil menü"
          className="border-t border-white/10 bg-black/95 px-4 py-5 lg:hidden"
        >
          <div className="mx-auto flex max-w-7xl flex-col">
            {mainLinks.slice(0, 2).map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={closeMenus}
                className={`rounded-xl px-4 py-3 font-semibold ${
                  isActive(link.href)
                    ? "bg-white/[0.06] text-white"
                    : "text-tokyo-silver"
                }`}
              >
                {link.label}
              </Link>
            ))}

            <button
              type="button"
              aria-expanded={corporateMenuOpen}
              onClick={() => setCorporateMenuOpen((current) => !current)}
              className="flex items-center justify-between rounded-xl px-4 py-3 text-left font-semibold text-tokyo-silver"
            >
              Kurumsal
              <ChevronDown
                aria-hidden="true"
                className={`size-4 transition-transform ${
                  corporateMenuOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            {corporateMenuOpen && (
              <div className="ml-4 border-l border-tokyo-red/40 pl-3">
                {corporateLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={closeMenus}
                    className="block rounded-xl px-4 py-3 text-sm text-tokyo-silver"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            )}

            <Link
              href="/iletisim"
              onClick={closeMenus}
              className={`rounded-xl px-4 py-3 font-semibold ${
                isActive("/iletisim")
                  ? "bg-white/[0.06] text-white"
                  : "text-tokyo-silver"
              }`}
            >
              İletişim
            </Link>

            <Link
              href="/favoriler"
              onClick={closeMenus}
              className="rounded-xl px-4 py-3 font-semibold text-tokyo-silver"
            >
              Favoriler
            </Link>

            <Link
              href="/karsilastir"
              onClick={closeMenus}
              className="flex items-center gap-2 rounded-xl px-4 py-3 font-semibold text-tokyo-silver"
            >
              <Scale aria-hidden="true" className="size-5 text-tokyo-red" />
              Araç Karşılaştır
            </Link>

            <div className="mt-4 grid grid-cols-2 gap-3">
              <a
                href="tel:+905455520786"
                className="flex items-center justify-center gap-2 rounded-full border border-white/10 px-4 py-3 text-sm font-semibold text-white"
              >
                <Phone aria-hidden="true" className="size-4 text-tokyo-red" />
                Hemen Ara
              </a>

              <Link
                href="/randevu"
                onClick={closeMenus}
                className="rounded-full bg-tokyo-red px-4 py-3 text-center text-sm font-bold text-white"
              >
                Randevu Al
              </Link>
            </div>
          </div>
        </nav>
      )}
    </header>
  );
}
