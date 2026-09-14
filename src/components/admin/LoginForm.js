"use client";

import { useActionState } from "react";
import { LockKeyhole, LogIn, Mail } from "lucide-react";
import { loginAction } from "@/app/yonetim/actions";

export default function LoginForm() {
  const [state, action, pending] = useActionState(loginAction, null);
  return (
    <form action={action} className="mt-8 space-y-5">
      <div>
        <label htmlFor="email" className="text-sm font-semibold text-white">E-posta</label>
        <div className="relative mt-2">
          <Mail className="absolute left-4 top-1/2 size-5 -translate-y-1/2 text-tokyo-muted" aria-hidden="true" />
          <input id="email" name="email" type="email" autoComplete="username" required className="w-full rounded-2xl border border-white/10 bg-black/40 py-4 pl-12 pr-4 text-white outline-none focus:border-tokyo-red" />
        </div>
      </div>
      <div>
        <label htmlFor="password" className="text-sm font-semibold text-white">Parola</label>
        <div className="relative mt-2">
          <LockKeyhole className="absolute left-4 top-1/2 size-5 -translate-y-1/2 text-tokyo-muted" aria-hidden="true" />
          <input id="password" name="password" type="password" autoComplete="current-password" required minLength={8} className="w-full rounded-2xl border border-white/10 bg-black/40 py-4 pl-12 pr-4 text-white outline-none focus:border-tokyo-red" />
        </div>
      </div>
      {state?.error && <p role="alert" className="rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-200">{state.error}</p>}
      <button disabled={pending} className="flex w-full items-center justify-center gap-2 rounded-full bg-tokyo-red px-6 py-4 text-sm font-bold text-white disabled:opacity-60">
        <LogIn className="size-4" aria-hidden="true" /> {pending ? "Giriş yapılıyor…" : "Giriş Yap"}
      </button>
    </form>
  );
}
