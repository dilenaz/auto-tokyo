"use client";

import Image from "next/image";
import { ChevronLeft, ChevronRight, Expand, X } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

const slides = [
  { src: "/images/about/opening/02.png", alt: "Auto Tokyo açılış töreninde kurdele kesimi", label: "Açılış Töreni" },
  { src: "/images/about/opening/05.jpg", alt: "Auto Tokyo açılışında davetlilere yapılan konuşma", label: "Açılış Konuşması" },
  { src: "/images/about/opening/03.png", alt: "Auto Tokyo açılışında kurucular ve davetliler", label: "Auto Tokyo Ailesi" },
  { src: "/images/about/opening/04.png", alt: "Auto Tokyo açılış töreninden konuşma anı", label: "Açılıştan Bir Kare" },
  { src: "/images/about/opening/01.png", alt: "Auto Tokyo açılışında gerçekleştirilen ziyaret", label: "Açılış Ziyareti" },
];

export default function AboutGallery() {
  const [active, setActive] = useState(0);
  const [open, setOpen] = useState(false);
  const [paused, setPaused] = useState(false);
  const closeRef = useRef(null);
  const dialogRef = useRef(null);
  const openerRef = useRef(null);
  const touchStart = useRef(null);

  const go = useCallback(
    (index) => setActive((index + slides.length) % slides.length),
    [],
  );

  useEffect(() => {
    if (!open) return;
    const opener = openerRef.current;
    closeRef.current?.focus();
    document.body.style.overflow = "hidden";

    const onKeyDown = (event) => {
      if (event.key === "Escape") setOpen(false);
      if (event.key === "ArrowLeft") go(active - 1);
      if (event.key === "ArrowRight") go(active + 1);
      if (event.key === "Tab") {
        const controls = [...(dialogRef.current?.querySelectorAll("button:not(:disabled)") || [])];
        if (!controls.length) return;
        const current = controls.indexOf(document.activeElement);
        const next = event.shiftKey ? (current <= 0 ? controls.length - 1 : current - 1) : (current >= controls.length - 1 ? 0 : current + 1);
        event.preventDefault();
        controls[next].focus();
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKeyDown);
      opener?.focus();
    };
  }, [active, go, open]);

  useEffect(() => {
    if (open || paused || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const timer = window.setInterval(() => {
      setActive((current) => (current + 1) % slides.length);
    }, 6000);
    return () => window.clearInterval(timer);
  }, [open, paused]);

  const swipeHandlers = {
    onTouchStart: (event) => {
      touchStart.current = event.touches[0].clientX;
    },
    onTouchEnd: (event) => {
      const distance = event.changedTouches[0].clientX - touchStart.current;
      if (Math.abs(distance) > 45) go(active + (distance < 0 ? 1 : -1));
    },
  };

  const frame = (fullscreen = false) => (
    <div
      {...swipeHandlers}
      className={`relative overflow-hidden bg-black ${
        fullscreen
          ? "h-[82svh]"
          : "aspect-[16/9] rounded-[2rem] border border-white/10 shadow-2xl"
      }`}
    >
      <Image
        src={slides[active].src}
        alt={slides[active].alt}
        fill
        priority={!fullscreen && active === 0}
        sizes={fullscreen ? "100vw" : "(max-width: 1280px) 100vw, 1280px"}
        className={fullscreen ? "object-contain" : "object-cover"}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-black/10" />
      <div className="absolute bottom-6 left-6 right-6 flex items-end justify-between gap-4">
        <p className="text-xs font-bold uppercase tracking-[.22em] text-white sm:text-sm">
          {slides[active].label}
        </p>
        <span className="rounded-full bg-black/60 px-3 py-1.5 text-xs text-white">
          {active + 1}/{slides.length}
        </span>
      </div>
    </div>
  );

  return (
    <section
      aria-label="Auto Tokyo açılış fotoğrafları"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
      className="border-b border-white/10 py-10 sm:py-14"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <button
          ref={openerRef}
          type="button"
          onClick={() => setOpen(true)}
          aria-label={`${slides[active].label} fotoğrafını tam ekran aç`}
          className="group relative block w-full text-left"
        >
          {frame()}
          <span className="absolute right-5 top-5 grid size-11 place-items-center rounded-full border border-white/15 bg-black/60 text-white backdrop-blur-md transition-colors group-hover:bg-tokyo-red">
            <Expand className="size-5" aria-hidden="true" />
          </span>
        </button>

        <div className="mt-4 flex gap-3 overflow-x-auto pb-2" aria-label="Açılış fotoğrafı önizlemeleri">
          {slides.map((slide, index) => (
            <button
              type="button"
              key={slide.src}
              onClick={() => setActive(index)}
              aria-label={`${index + 1}. fotoğrafı göster: ${slide.label}`}
              aria-current={active === index ? "true" : undefined}
              className={`relative aspect-[4/3] w-28 shrink-0 overflow-hidden rounded-xl border ${
                active === index ? "border-tokyo-red" : "border-white/10"
              }`}
            >
              <Image src={slide.src} alt="" fill sizes="112px" className="object-cover" />
            </button>
          ))}
        </div>
      </div>

      {open && (
        <div ref={dialogRef} role="dialog" aria-modal="true" aria-label="Auto Tokyo açılış galerisi" className="fixed inset-0 z-[100] grid place-items-center bg-black/95 p-4">
          <div className="w-full max-w-7xl">{frame(true)}</div>
          <button ref={closeRef} type="button" onClick={() => setOpen(false)} aria-label="Galeriyi kapat" className="absolute right-5 top-5 grid size-12 place-items-center rounded-full bg-white text-black">
            <X aria-hidden="true" />
          </button>
          <button type="button" onClick={() => go(active - 1)} aria-label="Önceki fotoğraf" className="absolute left-4 grid size-12 place-items-center rounded-full bg-black/70 text-white">
            <ChevronLeft aria-hidden="true" />
          </button>
          <button type="button" onClick={() => go(active + 1)} aria-label="Sonraki fotoğraf" className="absolute right-4 grid size-12 place-items-center rounded-full bg-black/70 text-white">
            <ChevronRight aria-hidden="true" />
          </button>
        </div>
      )}
    </section>
  );
}
