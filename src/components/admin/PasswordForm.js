"use client";
import { useActionState } from "react";
import { changePasswordAction } from "@/app/yonetim/actions";
export default function PasswordForm() {
  const [state, action, pending] = useActionState(changePasswordAction, {});
  const css = "mt-2 w-full rounded-xl border border-white/10 bg-black/50 px-4 py-3 text-white outline-none focus:border-tokyo-red";
  return <form action={action} className="mt-8 max-w-xl rounded-3xl border border-white/10 bg-tokyo-surface p-6"><label className="block text-sm text-tokyo-silver">Mevcut parola<input name="currentPassword" type="password" required className={css} /></label><label className="mt-5 block text-sm text-tokyo-silver">Yeni parola<input name="newPassword" type="password" minLength="10" required className={css} /></label>{state?.error && <p className="mt-4 text-sm text-red-300">{state.error}</p>}{state?.success && <p className="mt-4 text-sm text-green-300">{state.success}</p>}<button disabled={pending} className="mt-6 rounded-full bg-tokyo-red px-6 py-3 font-bold text-white disabled:opacity-60">{pending ? "Değiştiriliyor…" : "Parolayı Değiştir"}</button></form>;
}
