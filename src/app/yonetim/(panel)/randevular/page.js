import RequestTable from "@/components/admin/RequestTable";
import { query } from "@/lib/db";

export const dynamic = "force-dynamic";
export const metadata = { title: "Randevular" };

export default async function AdminAppointmentsPage() {
  const rows = await query("SELECT id, customer_name, phone, appointment_type, appointment_at, status FROM appointments ORDER BY appointment_at DESC LIMIT 250");
  const columns = [
    { key: "customer_name", label: "Müşteri" }, { key: "phone", label: "Telefon" }, { key: "appointment_type", label: "Tür" },
    { key: "appointment_at", label: "Tarih", render: (row) => new Date(row.appointment_at).toLocaleString("tr-TR") }, { key: "whatsapp", label: "İletişim" }, { key: "status", label: "Durum" },
  ];
  return <><p className="text-xs font-bold uppercase tracking-[.24em] text-tokyo-red">Talep Yönetimi</p><h1 className="mt-3 font-display text-5xl font-bold uppercase text-white">Randevular</h1><RequestTable columns={columns} rows={rows} emptyText="Henüz randevu talebi bulunmuyor." entity="appointment" statuses={["pending", "approved", "completed", "rejected", "cancelled", "no_show"]} /></>;
}
