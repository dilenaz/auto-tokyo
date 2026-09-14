import { CalendarDays, CarFront, Mail, RefreshCw } from "lucide-react";
import { query } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const [vehicles, appointments, offers, messages] = await Promise.all([
    query("SELECT COUNT(*) total FROM vehicles WHERE status IN ('published','sold')"),
    query("SELECT COUNT(*) total FROM appointments WHERE status = 'pending'"),
    query("SELECT COUNT(*) total FROM vehicle_offers WHERE status = 'new'"),
    query("SELECT COUNT(*) total FROM contact_messages WHERE status = 'new'"),
  ]);
  const cards = [
    ["Araçlar", vehicles[0].total, CarFront],
    ["Bekleyen Randevu", appointments[0].total, CalendarDays],
    ["Yeni Teklif", offers[0].total, RefreshCw],
    ["Yeni Mesaj", messages[0].total, Mail],
  ];
  return <><p className="text-xs font-bold uppercase tracking-[.24em] text-tokyo-red">Auto Tokyo</p><h1 className="mt-3 font-display text-5xl font-bold uppercase text-white">Genel Bakış</h1><div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">{cards.map(([label, value, Icon]) => <article key={label} className="rounded-3xl border border-white/10 bg-tokyo-surface p-6"><Icon className="size-6 text-tokyo-red" /><p className="mt-8 font-display text-5xl font-bold text-white">{value}</p><p className="mt-2 text-sm text-tokyo-silver">{label}</p></article>)}</div></>;
}
