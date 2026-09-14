import Image from "next/image";
import { redirect } from "next/navigation";
import LoginForm from "@/components/admin/LoginForm";
import { getAdmin } from "@/lib/auth";

export const metadata = { title: "Yönetici Girişi", robots: { index: false, follow: false } };

export default async function AdminLoginPage() {
  if (await getAdmin()) redirect("/yonetim");
  return (
    <section className="grid min-h-screen place-items-center bg-black px-4 py-12">
      <div className="w-full max-w-md rounded-[2rem] border border-white/10 bg-tokyo-surface p-7 shadow-2xl sm:p-9">
        <Image src="/images/logo/auto-tokyo-logo.jpg" alt="Auto Tokyo" width={260} height={173} priority className="mx-auto h-24 w-auto object-contain" />
        <p className="mt-6 text-center text-xs font-bold uppercase tracking-[.24em] text-tokyo-red">Güvenli Yönetim</p>
        <h1 className="mt-3 text-center font-display text-4xl font-bold uppercase text-white">Yönetici Girişi</h1>
        <LoginForm />
        <p className="mt-6 text-center text-xs leading-5 text-tokyo-muted">Bu alan yalnızca yetkili Auto Tokyo yöneticileri içindir.</p>
      </div>
    </section>
  );
}
