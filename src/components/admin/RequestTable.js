import { updateRequestStatus } from "@/app/yonetim/actions";

const statusLabels = {
  pending: "Onay Bekliyor", approved: "Onaylandı", completed: "Tamamlandı", rejected: "Reddedildi", cancelled: "İptal", no_show: "Gelmedi",
  new: "Yeni", reviewing: "İnceleniyor", contacted: "Görüşüldü", appointment_created: "Randevu Oluşturuldu", replied: "Yanıtlandı", read: "Okundu", archived: "Arşivlendi",
};

function whatsappUrl(row, entity) {
  const digits = String(row.phone || "").replace(/\D/g, "");
  const phone = digits.startsWith("0") ? `90${digits.slice(1)}` : digits.startsWith("90") ? digits : `90${digits}`;
  if (phone.length !== 12) return null;
  const requestLabel = entity === "appointment" ? "randevu talebiniz" : entity === "offer" ? "araç satış/takas talebiniz" : "iletişim mesajınız";
  const message = `Merhaba ${row.customer_name || ""}, Auto Tokyo'ya ilettiğiniz ${requestLabel} hakkında sizinle iletişime geçiyoruz.`;
  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
}

export default function RequestTable({ columns, rows, emptyText, entity, statuses = [] }) {
  return (
    <div className="mt-8 overflow-hidden rounded-3xl border border-white/10">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[760px] text-left text-sm">
          <thead className="bg-white/[.05] text-xs uppercase tracking-wider text-tokyo-muted"><tr>{columns.map((column) => <th key={column.key} className="p-5">{column.label}</th>)}</tr></thead>
          <tbody className="divide-y divide-white/10">
            {rows.map((row) => <tr key={row.id} className="bg-tokyo-surface">{columns.map((column) => <td key={column.key} className="max-w-sm p-5 text-tokyo-silver">{column.key === "status" && entity ? (
              <form action={updateRequestStatus} className="flex gap-2">
                <input type="hidden" name="entity" value={entity} /><input type="hidden" name="id" value={row.id} />
                <select name="status" defaultValue={row.status} className="rounded-xl border border-white/10 bg-black px-3 py-2 text-xs text-white">{statuses.map((status) => <option key={status} value={status}>{statusLabels[status] || status}</option>)}</select>
                <button className="rounded-xl bg-tokyo-red px-3 py-2 text-xs font-bold text-white">Kaydet</button>
              </form>
            ) : column.key === "whatsapp" ? (() => { const url = whatsappUrl(row, entity); return url ? <a href={url} target="_blank" rel="noreferrer" className="inline-flex whitespace-nowrap rounded-xl bg-emerald-600 px-3 py-2 text-xs font-bold text-white hover:bg-emerald-500">WhatsApp&apos;tan Yaz</a> : "—"; })() : column.render ? column.render(row) : row[column.key] || "—"}</td>)}</tr>)}
            {!rows.length && <tr><td colSpan={columns.length} className="p-10 text-center text-tokyo-muted">{emptyText}</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}
