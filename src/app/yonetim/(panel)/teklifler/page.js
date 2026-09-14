import RequestTable from "@/components/admin/RequestTable";
import { query } from "@/lib/db";

export const dynamic = "force-dynamic";
export const metadata = { title: "Satış ve Takas Talepleri" };

function parseVehicleData(value) {
  if (value && typeof value === "object") return value;
  try { return JSON.parse(value || "{}"); } catch { return {}; }
}

export default async function AdminOffersPage() {
  const rows = await query("SELECT o.id, o.customer_name, o.phone, o.request_type, o.vehicle_data, o.status, o.created_at, GROUP_CONCAT(i.image_url, '|||') photo_urls FROM vehicle_offers o LEFT JOIN offer_images i ON i.offer_id = o.id GROUP BY o.id ORDER BY o.created_at DESC LIMIT 250");
  const columns = [
    { key: "customer_name", label: "Müşteri" }, { key: "phone", label: "Telefon" },
    { key: "request_type", label: "Talep", render: (row) => row.request_type === "trade" ? "Takas" : "Satış" },
    { key: "vehicle_data", label: "Araç", render: (row) => {
      const data = parseVehicleData(row.vehicle_data);
      return `${data?.brand || "—"} ${data?.model || ""} · ${data?.year || "—"}`;
    } },
    { key: "photo_urls", label: "Fotoğraflar", render: (row) => row.photo_urls ? <div className="flex flex-wrap gap-2">{row.photo_urls.split("|||").map((url, index) => <a key={url} href={url} target="_blank" rel="noreferrer" className="rounded-lg border border-white/10 px-2 py-1 text-xs text-white hover:border-tokyo-red">{index + 1}</a>)}</div> : "—" },
    { key: "created_at", label: "Gönderim", render: (row) => new Date(row.created_at).toLocaleString("tr-TR") }, { key: "whatsapp", label: "İletişim" }, { key: "status", label: "Durum" },
  ];
  return <><p className="text-xs font-bold uppercase tracking-[.24em] text-tokyo-red">Talep Yönetimi</p><h1 className="mt-3 font-display text-5xl font-bold uppercase text-white">Satış ve Takas</h1><RequestTable columns={columns} rows={rows} emptyText="Henüz satış veya takas talebi bulunmuyor." entity="offer" statuses={["new", "reviewing", "contacted", "appointment_created", "completed", "rejected"]} /></>;
}
