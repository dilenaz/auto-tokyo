"use client";

import Link from "next/link";
import { CalendarDays, MessageCircle, Phone, RefreshCw } from "lucide-react";

export default function MobileActionBar({ vehicleSlug, sold = false }) {
  const showTrade = Boolean(vehicleSlug && !sold);
  return (
    <div className={`fixed inset-x-0 bottom-0 z-40 grid ${showTrade ? "grid-cols-4" : "grid-cols-3"} border-t border-white/10 bg-black/95 p-2 pb-[calc(.5rem+env(safe-area-inset-bottom))] backdrop-blur md:hidden`}>
      <a href="tel:+905455520786" className="flex flex-col items-center gap-1 py-2 text-[.68rem] font-semibold"><Phone className="size-5 text-tokyo-red" aria-hidden="true" />Ara</a>
      {sold ? <span className="flex flex-col items-center gap-1 py-2 text-[.68rem] text-tokyo-muted"><MessageCircle className="size-5" aria-hidden="true" />Satıldı</span> : <a href="https://wa.me/905455520786" className="flex flex-col items-center gap-1 py-2 text-[.68rem] font-semibold"><MessageCircle className="size-5 text-tokyo-red" aria-hidden="true" />WhatsApp</a>}
      {showTrade && <Link href={`/aracini-sat?type=trade&vehicle=${vehicleSlug}`} className="flex flex-col items-center gap-1 py-2 text-[.68rem] font-semibold"><RefreshCw className="size-5 text-tokyo-red" aria-hidden="true" />Takas</Link>}
      {sold ? <span className="flex flex-col items-center gap-1 py-2 text-[.68rem] text-tokyo-muted"><CalendarDays className="size-5" aria-hidden="true" />Randevu</span> : <Link href={`/randevu${vehicleSlug ? `?vehicle=${vehicleSlug}` : ""}`} className="flex flex-col items-center gap-1 py-2 text-[.68rem] font-semibold"><CalendarDays className="size-5 text-tokyo-red" aria-hidden="true" />Randevu Al</Link>}
    </div>
  );
}
