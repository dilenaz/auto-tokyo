import RequestTable from "@/components/admin/RequestTable";
import { query } from "@/lib/db";

export const dynamic = "force-dynamic";
export const metadata = { title: "İletişim Mesajları" };

export default async function AdminMessagesPage() {
  const rows = await query("SELECT id, customer_name, phone, email, subject, message, status, created_at FROM contact_messages ORDER BY created_at DESC LIMIT 250");
  const columns = [
    { key: "customer_name", label: "Gönderen" }, { key: "phone", label: "Telefon" }, { key: "subject", label: "Konu" },
    { key: "message", label: "Mesaj" }, { key: "created_at", label: "Tarih", render: (row) => new Date(row.created_at).toLocaleString("tr-TR") }, { key: "whatsapp", label: "İletişim" }, { key: "status", label: "Durum" },
  ];
  return <><p className="text-xs font-bold uppercase tracking-[.24em] text-tokyo-red">İletişim Kutusu</p><h1 className="mt-3 font-display text-5xl font-bold uppercase text-white">Mesajlar</h1><RequestTable columns={columns} rows={rows} emptyText="Henüz iletişim mesajı bulunmuyor." entity="message" statuses={["new", "read", "replied", "archived"]} /></>;
}
