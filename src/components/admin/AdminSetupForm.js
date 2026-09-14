"use client";

import { useActionState } from "react";
import { setupAdminAction } from "@/app/yonetim/actions";

const inputClass = "mt-2 w-full rounded-2xl border border-white/10 bg-black/50 px-4 py-3 text-white outline-none focus:border-tokyo-red";

export default function AdminSetupForm() {
  const [state, action, pending] = useActionState(setupAdminAction, {});
  return (
    <form action={action} className="mt-7 grid gap-5">
      <label className="text-sm font-semibold text-white">Ad soyad<input name="name" required autoComplete="name" className={inputClass} /></label>
      <label className="text-sm font-semibold text-white">Yönetici e-postası<input value="autotokyo68@gmail.com" readOnly className={`${inputClass} cursor-not-allowed opacity-70`} /></label>
      <label className="text-sm font-semibold text-white">Yeni parola<input name="password" type="password" required minLength={12} autoComplete="new-password" className={inputClass} /></label>
      {state?.error && <p role="alert" className="rounded-xl border border-red-500/30 bg-red-950/40 p-3 text-sm text-red-200">{state.error}</p>}
      <button disabled={pending} className="rounded-full bg-tokyo-red px-6 py-4 text-sm font-bold text-white disabled:opacity-60">{pending ? "Hesap oluşturuluyor…" : "Yönetici Hesabını Oluştur"}</button>
    </form>
  );
}
