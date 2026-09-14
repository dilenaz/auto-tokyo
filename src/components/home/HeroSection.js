"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

const slides = [
  { eyebrow: "Aksaray / Merkez", title: "Auto Tokyo'ya Hoş Geldiniz", text: "Güven, kalite ve performans anlayışıyla seçkin araçları keşfedin.", primary: ["Araçları İncele", "/araclar"], secondary: ["Bizi Tanıyın", "/hakkimizda"], image: "/images/about/opening/02.png", position: "object-center" },
  { eyebrow: "Güncel Portföy", title: "Yeni Gelen Araçlar", text: "Portföyümüzdeki güncel araçları filtreleyin, favorileyin ve karşılaştırın.", primary: ["Araçları Gör", "/araclar"], image: "/images/vehicles/land-rover/01.jpg", position: "object-center" },
  { eyebrow: "Satış ve Takas", title: "Aracınızı Değerlendirelim", text: "Aracınızı satmak veya takasa vermek için birkaç adımda talep oluşturun.", primary: ["Teklif Al", "/aracini-sat"], image: "/images/founders/tugra-cevik-ali-tezcan.jpg", position: "object-[center_35%]" },
  { eyebrow: "Planlı Ziyaret", title: "Araç İnceleme Randevusu", text: "Uygun gün ve saati seçin; talebiniz incelendikten sonra WhatsApp üzerinden bilgi alın.", primary: ["Randevu Al", "/randevu"], image: "/images/about/opening/01.png", position: "object-center" },
];

export default function HeroSection() {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const touchStart = useRef(null);
  const go = useCallback((index) => setActive((index + slides.length) % slides.length), []);

  useEffect(() => {
    if (paused || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const timer = window.setInterval(() => setActive((value) => (value + 1) % slides.length), 6500);
    return () => window.clearInterval(timer);
  }, [paused]);

  const slide = slides[active];
  return (
    <section aria-roledescription="carousel" aria-label="Auto Tokyo tanıtımı" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)} onFocusCapture={() => setPaused(true)} onBlurCapture={() => setPaused(false)} onKeyDown={(event) => { if (event.key === "ArrowLeft") go(active - 1); if (event.key === "ArrowRight") go(active + 1); }} onTouchStart={(event) => { touchStart.current = event.touches[0].clientX; }} onTouchEnd={(event) => { const distance = event.changedTouches[0].clientX - touchStart.current; if (Math.abs(distance) > 45) go(active + (distance < 0 ? 1 : -1)); }} className="relative isolate min-h-[calc(100svh-7rem)] overflow-hidden border-b border-white/10">
      <div key={slide.image} className="absolute inset-0 -z-30 animate-[hero-in_.7s_ease-out]">
        <Image src={slide.image} alt="" fill priority={active === 0} sizes="100vw" className={`object-cover ${slide.position}`} />
      </div>
      <div className="absolute inset-0 -z-20 bg-[linear-gradient(90deg,rgba(0,0,0,.94)_0%,rgba(0,0,0,.78)_42%,rgba(0,0,0,.34)_72%,rgba(0,0,0,.5)_100%),linear-gradient(0deg,rgba(0,0,0,.72),transparent_55%)]" />
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_18%_52%,rgba(237,17,31,.2),transparent_28rem)]" />
      <div className="mx-auto grid min-h-[calc(100svh-7rem)] max-w-7xl items-center px-4 py-20 sm:px-6">
        <div key={active} className="animate-[hero-in_.65s_ease-out]">
          <p className="text-xs font-bold uppercase tracking-[.28em] text-tokyo-red">{slide.eyebrow}</p>
          <h1 className="mt-5 max-w-4xl font-display text-6xl font-extrabold uppercase leading-[.9] text-white sm:text-7xl lg:text-8xl">{slide.title}</h1>
          <p className="mt-7 max-w-2xl text-base leading-8 text-tokyo-silver sm:text-lg">{slide.text}</p>
          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <Link href={slide.primary[1]} className="red-glow inline-flex items-center justify-center gap-2 rounded-full bg-tokyo-red px-7 py-4 text-sm font-bold text-white">{slide.primary[0]} <ArrowRight className="size-4" aria-hidden="true" /></Link>
            {slide.secondary && <Link href={slide.secondary[1]} className="inline-flex items-center justify-center rounded-full border border-white/15 bg-black/30 px-7 py-4 text-sm font-bold text-white">{slide.secondary[0]}</Link>}
          </div>
        </div>
      </div>
      <button type="button" aria-label="Önceki slayt" onClick={() => go(active - 1)} className="absolute bottom-8 left-4 grid size-11 place-items-center rounded-full border border-white/15 bg-black/50 text-white sm:left-8"><ArrowLeft className="size-5" /></button>
      <button type="button" aria-label="Sonraki slayt" onClick={() => go(active + 1)} className="absolute bottom-8 right-4 grid size-11 place-items-center rounded-full border border-white/15 bg-black/50 text-white sm:right-8"><ArrowRight className="size-5" /></button>
      <div className="absolute bottom-10 left-1/2 flex -translate-x-1/2 gap-2">{slides.map((item, index) => <button key={item.title} type="button" aria-label={`${index + 1}. slayta git`} aria-current={index === active ? "true" : undefined} onClick={() => go(index)} className={`h-2 rounded-full transition-all ${index === active ? "w-8 bg-tokyo-red" : "w-2 bg-white/35"}`} />)}</div>
    </section>
  );
}
