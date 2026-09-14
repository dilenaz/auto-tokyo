"use client";
import { useRouter } from "next/navigation";
import Container from "@/components/ui/Container";
export default function QuickSearch({ brands }) {
  const router = useRouter();
  function submit(event) { event.preventDefault(); const data = new FormData(event.currentTarget); const query = new URLSearchParams(); if (data.get("brand")) query.set("brand", data.get("brand")); if (data.get("price")) query.set("price", data.get("price")); router.push(`/araclar?${query}`); }
  return <section aria-label="Hızlı araç arama" className="border-b border-white/10 bg-white/[.025] py-6"><Container><form onSubmit={submit} className="grid gap-3 rounded-3xl border border-white/10 bg-tokyo-surface p-4 sm:grid-cols-[1fr_1fr_auto] sm:p-5"><label className="sr-only" htmlFor="quick-brand">Marka</label><select id="quick-brand" name="brand" className="rounded-2xl border border-white/10 bg-black px-4 py-3 text-sm"><option value="">Tüm markalar</option>{brands.map((brand) => <option key={brand}>{brand}</option>)}</select><label className="sr-only" htmlFor="quick-price">Fiyat aralığı</label><select id="quick-price" name="price" className="rounded-2xl border border-white/10 bg-black px-4 py-3 text-sm"><option value="">Tüm fiyatlar</option><option value="contact">Fiyat bilgisi için iletişim</option></select><button className="rounded-2xl bg-tokyo-red px-6 py-3 text-sm font-bold text-white">Araçları Bul</button></form></Container></section>;
}
