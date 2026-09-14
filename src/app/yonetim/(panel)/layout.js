import Link from "next/link";
import { CalendarDays, CarFront, ExternalLink, Gauge, LogOut, Mail, RefreshCw, Settings } from "lucide-react";
import { requireAdmin } from "@/lib/auth";
import { logoutAction } from "@/app/yonetim/actions";

const links = [
  ["Genel Bakış", "/yonetim", Gauge],
  ["Araçlar", "/yonetim/araclar", CarFront],
  ["Randevular", "/yonetim/randevular", CalendarDays],
  ["Satış ve Takas", "/yonetim/teklifler", RefreshCw],
  ["Mesajlar", "/yonetim/mesajlar", Mail],
  ["Ayarlar", "/yonetim/ayarlar", Settings],
];

export const metadata = { title: { default: "Yönetim", template: "%s | Auto Tokyo Yönetim" }, robots: { index: false, follow: false } };

export default async function AdminLayout({ children }) {
  const admin = await requireAdmin();
  return (
    <div className="min-h-screen bg-[#080808] lg:grid lg:grid-cols-[17rem_1fr]">
      <aside className="border-b border-white/10 bg-black p-5 lg:sticky lg:top-0 lg:h-screen lg:border-b-0 lg:border-r">
        <Link href="/yonetim" className="font-display text-2xl font-extrabold uppercase text-white">Auto <span className="text-tokyo-red">Tokyo</span></Link>
        <p className="mt-1 text-xs text-tokyo-muted">Yönetim Paneli</p>
        <nav className="mt-7 grid gap-2" aria-label="Yönetim menüsü">
          {links.map(([label, href, Icon]) => <Link key={href} href={href} className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm text-tokyo-silver transition hover:bg-white/[.06] hover:text-white"><Icon className="size-4 text-tokyo-red" aria-hidden="true" />{label}</Link>)}
        </nav>
        <div className="mt-8 border-t border-white/10 pt-5 lg:absolute lg:inset-x-5 lg:bottom-5">
          <p className="truncate text-sm font-semibold text-white">{admin.name}</p>
          <p className="truncate text-xs text-tokyo-muted">{admin.email}</p>
          <form action={logoutAction}><button className="mt-4 flex items-center gap-2 text-xs font-bold text-tokyo-silver hover:text-white"><LogOut className="size-4" /> Güvenli Çıkış</button></form>
          <Link href="/" target="_blank" className="mt-3 flex items-center gap-2 text-xs font-bold text-tokyo-silver hover:text-white"><ExternalLink className="size-4" /> Siteyi Görüntüle</Link>
        </div>
      </aside>
      <main className="min-w-0 p-5 sm:p-8 lg:p-10">{children}</main>
    </div>
  );
}
