"use client";

import Image from "next/image";
import { CarFront, ChevronLeft, ChevronRight, Expand, X } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

export default function VehicleGallery({ vehicle }) {
  const images = vehicle.images?.length ? vehicle.images : vehicle.image ? [vehicle.image] : [];
  const [active, setActive] = useState(0);
  const [open, setOpen] = useState(false);
  const closeButton = useRef(null);
  const dialogRef = useRef(null);
  const opener = useRef(null);
  const touchStart = useRef(null);
  const count = images.length || 1;
  const go = useCallback((index) => setActive((index + count) % count), [count]);

  useEffect(() => {
    if (!open) return;
    const openerNode = opener.current;
    closeButton.current?.focus();
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
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKeyDown);
      openerNode?.focus();
    };
  }, [open, active, go]);

  const swipe = {
    onTouchStart: (event) => { touchStart.current = event.touches[0].clientX; },
    onTouchEnd: (event) => {
      const distance = event.changedTouches[0].clientX - touchStart.current;
      if (Math.abs(distance) > 45) go(active + (distance < 0 ? 1 : -1));
    },
  };

  const frame = (modal = false) => (
    <div {...swipe} className={`relative overflow-hidden bg-gradient-to-br from-white/[0.07] via-black to-tokyo-red/10 ${modal ? "h-[min(82svh,52rem)]" : "h-[min(64vw,30rem)] min-h-64 rounded-[2rem] border border-white/10 shadow-2xl sm:min-h-80"}`}>
      {images.length ? (
        <Image src={images[active]} alt={`${vehicle.brand} ${vehicle.model} - ${active + 1}. fotoğraf`} fill priority={!modal && active === 0} sizes={modal ? "100vw" : "(max-width: 1024px) 100vw, 60vw"} className="object-contain p-2 sm:p-3" />
      ) : (
        <div className="absolute inset-0 grid place-items-center">
          <div className="absolute size-72 rounded-full border border-tokyo-red/20 shadow-[0_0_100px_rgba(237,17,31,.16)]" />
          <CarFront className="size-44 text-white/75" strokeWidth={0.8} aria-hidden="true" />
          <span className="absolute bottom-8 text-xs uppercase tracking-[.22em] text-tokyo-muted">Araç fotoğrafları eklenecek</span>
        </div>
      )}
      {modal && images.length > 1 && <>
        <button type="button" onClick={() => go(active - 1)} aria-label="Önceki fotoğraf" className="absolute left-4 top-1/2 grid size-11 -translate-y-1/2 place-items-center rounded-full bg-black/70"><ChevronLeft /></button>
        <button type="button" onClick={() => go(active + 1)} aria-label="Sonraki fotoğraf" className="absolute right-4 top-1/2 grid size-11 -translate-y-1/2 place-items-center rounded-full bg-black/70"><ChevronRight /></button>
      </>}
      <span className="absolute bottom-4 right-4 rounded-full bg-black/70 px-3 py-1.5 text-xs">{active + 1}/{count}</span>
    </div>
  );

  return (
    <div>
      <button ref={opener} type="button" onClick={() => setOpen(true)} className="relative block w-full text-left" aria-label="Araç fotoğrafını tam ekran aç">
        {frame()}
        <span className="absolute right-4 top-4 grid size-11 place-items-center rounded-full bg-black/70"><Expand className="size-5" /></span>
      </button>
      <div className="mt-4 flex gap-3 overflow-x-auto pb-2" aria-label="Araç fotoğrafı önizlemeleri">
        {Array.from({ length: count }).map((_, index) => (
          <button type="button" key={index} onClick={() => setActive(index)} aria-label={`${index + 1}. fotoğrafı göster`} aria-current={active === index ? "true" : undefined} className={`relative grid aspect-[4/3] w-24 shrink-0 place-items-center overflow-hidden rounded-2xl border ${active === index ? "border-tokyo-red" : "border-white/10"}`}>
            {images[index] ? <Image src={images[index]} alt="" fill sizes="160px" className="object-cover" /> : <CarFront className="size-7 text-white/25" aria-hidden="true" />}
          </button>
        ))}
      </div>
      {open && <div ref={dialogRef} role="dialog" aria-modal="true" aria-label={`${vehicle.brand} ${vehicle.model} fotoğraf galerisi`} className="fixed inset-0 z-[100] grid place-items-center bg-black/95 p-4">
        <div className="w-full max-w-7xl">{frame(true)}</div>
        <button ref={closeButton} type="button" onClick={() => setOpen(false)} aria-label="Galeriyi kapat" className="absolute right-5 top-5 grid size-12 place-items-center rounded-full bg-white text-black"><X /></button>
      </div>}
    </div>
  );
}
