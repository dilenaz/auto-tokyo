import Image from "next/image";
import { redirect } from "next/navigation";
import AdminSetupForm from "@/components/admin/AdminSetupForm";
import { query } from "@/lib/db";

export const dynamic = "force-dynamic";
export const metadata = { title: "Yönetici Kurulumu", robots: { index: false, follow: false } };

export default async function AdminSetupPage() {
  const rows = await query("SELECT COUNT(*) total FROM admins");
  if (Number(rows[0]?.total || 0) > 0) redirect("/yonetim/giris");
  return (
    <section className="grid min-h-screen place-items-center bg-black px-4 py-12">
      <div className="w-full max-w-lg rounded-[2rem] border border-white/10 bg-tokyo-surface p-7 shadow-2xl sm:p-9">
        <Image src="/images/logo/auto-tokyo-logo.jpg" alt="Auto Tokyo" width={240} height={144} priority className="mx-auto h-auto w-40 object-contain" />
        <p className="mt-6 text-center text-xs font-bold uppercase tracking-[.24em] text-tokyo-red">Tek Seferlik Kurulum</p>
        <h1 className="mt-3 text-center font-display text-4xl font-bold uppercase text-white">Yönetici Hesabı</h1>
        <p className="mt-3 text-center text-sm leading-6 text-tokyo-silver">İlk yönetici hesabını <strong className="text-white">autotokyo68@gmail.com</strong> adresiyle oluşturun. Hesap açıldıktan sonra bu sayfa otomatik olarak kapanır.</p>
        <AdminSetupForm />
      </div>
    </section>
  );
}
