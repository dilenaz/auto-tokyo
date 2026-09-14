"use client";

import { useActionState } from "react";
import { importSahibindenFileAction } from "@/app/yonetim/actions";

export default function SahibindenFileImportForm() {
  const [state, action, pending] = useActionState(importSahibindenFileAction, {});
  return (
    <section className="mt-8 rounded-3xl border border-emerald-500/30 bg-emerald-500/[.06] p-6">
      <h2 className="font-display text-2xl font-bold uppercase text-white">Sahibinden İlan Dosyası</h2>
      <p className="mt-2 max-w-3xl text-sm leading-6 text-tokyo-silver">Oto Galerim bölümünden indirdiğiniz CSV, JSON veya XML dosyasını yükleyin. Araçlar önce taslak olarak oluşturulur; fotoğraf bağlantıları güvenli kaynaktan indirilebildiğinde galeriye eklenir.</p>
      <form action={action} className="mt-5 flex flex-col gap-3 lg:flex-row" encType="multipart/form-data">
        <label className="flex min-w-0 flex-1 cursor-pointer items-center rounded-xl border border-dashed border-white/20 bg-black/50 px-4 py-3 text-sm text-tokyo-silver hover:border-emerald-500/60">
          <span className="mr-3 whitespace-nowrap font-semibold text-white">Dosya seç</span>
          <input name="listingFile" type="file" required accept=".csv,.json,.xml,text/csv,application/json,application/xml,text/xml" className="min-w-0 text-xs file:hidden" />
        </label>
        <button disabled={pending} className="rounded-xl bg-emerald-600 px-6 py-3 text-sm font-bold text-white hover:bg-emerald-500 disabled:opacity-60">{pending ? "İçe aktarılıyor…" : "Dosyayı İçe Aktar"}</button>
      </form>
      {state?.error && <p role="alert" className="mt-4 rounded-xl border border-red-500/30 bg-red-950/50 p-3 text-sm text-red-200">{state.error}</p>}
      {state?.success && <p role="status" className="mt-4 rounded-xl border border-emerald-500/30 bg-emerald-950/50 p-3 text-sm text-emerald-100">{state.success}</p>}
    </section>
  );
}
