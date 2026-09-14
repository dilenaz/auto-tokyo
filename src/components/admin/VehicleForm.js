"use client";

import { useActionState, useRef, useState } from "react";
import Image from "next/image";
import { saveVehicleAction, deleteVehicleImage } from "@/app/yonetim/actions";

const fieldClass = "mt-2 w-full rounded-xl border border-white/10 bg-black/50 px-4 py-3 text-sm text-white outline-none focus:border-tokyo-red";

export default function VehicleForm({ vehicle, images = [] }) {
  const [state, action, pending] = useActionState(saveVehicleAction, {});
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFileCount, setSelectedFileCount] = useState(0);
  const fileInputRef = useRef(null);
  const acceptFiles = (files) => {
    if (!fileInputRef.current) return;
    const transfer = new DataTransfer();
    Array.from(files).filter((file) => ["image/jpeg", "image/png", "image/webp", "image/avif"].includes(file.type)).forEach((file) => transfer.items.add(file));
    fileInputRef.current.files = transfer.files;
    setSelectedFileCount(transfer.files.length);
  };
  const input = (name, label, type = "text", required = false) => <label className="text-sm text-tokyo-silver">{label}<input className={fieldClass} name={name} type={type} required={required} defaultValue={vehicle?.[name] ?? ""} /></label>;
  return <form action={action} className="mt-8 grid gap-8" encType="multipart/form-data">
    {vehicle && <input type="hidden" name="id" value={vehicle.id} />}
    <section className="rounded-3xl border border-white/10 bg-tokyo-surface p-6"><h2 className="font-display text-2xl font-bold uppercase text-white">Temel Bilgiler</h2><div className="mt-5 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
      {input("brand", "Marka", "text", true)}{input("model", "Model", "text", true)}{input("title", "İlan başlığı", "text", true)}{input("slug", "Bağlantı adı (slug)")}{input("price", "Fiyat (TL)", "number")}{input("modelYear", "Model yılı", "number")}{input("mileage", "Kilometre", "number")}
      <label className="text-sm text-tokyo-silver">Durum<select className={fieldClass} name="status" defaultValue={vehicle?.status || "draft"}><option value="draft">Taslak</option><option value="published">Yayında</option><option value="sold">Satıldı</option><option value="archived">Yayından kaldırıldı</option></select></label>
      <label className="flex items-end gap-3 pb-3 text-sm text-white"><input type="checkbox" name="featured" defaultChecked={vehicle?.featured} className="size-5 accent-red-600" /> Öne çıkan araç</label>
    </div></section>
    <section className="rounded-3xl border border-white/10 bg-tokyo-surface p-6"><h2 className="font-display text-2xl font-bold uppercase text-white">Teknik Bilgiler</h2><div className="mt-5 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
      {input("fuel", "Yakıt")}{input("transmission", "Vites")}{input("bodyType", "Kasa tipi")}{input("enginePower", "Motor gücü")}{input("engineVolume", "Motor hacmi")}{input("traction", "Çekiş")}{input("color", "Renk")}{input("sahibindenUrl", "Sahibinden ilan bağlantısı", "url")}
    </div><label className="mt-5 block text-sm text-tokyo-silver">Donanımlar (her satıra bir özellik)<textarea className={`${fieldClass} min-h-32`} name="features" defaultValue={vehicle?.features?.join("\n") || ""} /></label></section>
    <section className="rounded-3xl border border-white/10 bg-tokyo-surface p-6"><h2 className="font-display text-2xl font-bold uppercase text-white">Açıklamalar</h2><div className="mt-5 grid gap-5 md:grid-cols-2"><label className="text-sm text-tokyo-silver">Araç açıklaması<textarea className={`${fieldClass} min-h-40`} name="description" defaultValue={vehicle?.description || ""} /></label><label className="text-sm text-tokyo-silver">Hasar / ekspertiz bilgisi<textarea className={`${fieldClass} min-h-40`} name="damageInfo" defaultValue={vehicle?.damageInfo || ""} /></label></div></section>
    <section className="rounded-3xl border border-white/10 bg-tokyo-surface p-6"><h2 className="font-display text-2xl font-bold uppercase text-white">Fotoğraflar</h2><p className="mt-2 text-sm text-tokyo-muted">Birden fazla fotoğraf seçebilirsiniz. İlk fotoğraf kapak olarak kullanılır.</p>{images.length > 0 && <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4 xl:grid-cols-6">{images.map((image) => <div key={image.id} className="overflow-hidden rounded-xl border border-white/10"><div className="relative aspect-[4/3]"><Image src={image.image_url} fill sizes="180px" className="object-cover" alt={image.alt_text || "Araç fotoğrafı"} /></div><button formAction={deleteVehicleImage} name="imageId" value={image.id} className="w-full bg-red-950 px-2 py-2 text-xs font-bold text-red-200">Fotoğrafı sil</button></div>)}</div>}<label onDragEnter={(event) => { event.preventDefault(); setIsDragging(true); }} onDragOver={(event) => { event.preventDefault(); setIsDragging(true); }} onDragLeave={() => setIsDragging(false)} onDrop={(event) => { event.preventDefault(); setIsDragging(false); acceptFiles(event.dataTransfer.files); }} className={`mt-5 flex cursor-pointer flex-col items-center justify-center rounded-2xl border border-dashed px-5 py-10 text-center transition-colors ${isDragging ? "border-tokyo-red bg-tokyo-red/10" : "border-white/20 bg-black/30 hover:border-tokyo-red/60"}`}><span className="font-semibold text-white">Fotoğrafları sürükleyip bırakın veya seçin</span><span className="mt-2 text-xs text-tokyo-muted">JPG, PNG, WebP veya AVIF · {selectedFileCount ? `${selectedFileCount} dosya seçildi` : "Birden fazla dosya seçilebilir"}</span><input ref={fileInputRef} className="sr-only" type="file" name="images" accept="image/jpeg,image/png,image/webp,image/avif" multiple onChange={(event) => setSelectedFileCount(event.target.files?.length || 0)} /></label></section>
    {state?.error && <p role="alert" className="rounded-xl border border-red-500/30 bg-red-950/40 p-4 text-sm text-red-200">{state.error}</p>}
    <button disabled={pending} className="rounded-full bg-tokyo-red px-7 py-4 font-bold text-white disabled:opacity-60">{pending ? "Kaydediliyor…" : vehicle ? "Değişiklikleri Kaydet" : "Aracı Oluştur"}</button>
  </form>;
}
