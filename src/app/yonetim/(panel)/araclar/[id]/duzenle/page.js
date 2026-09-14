import { notFound } from "next/navigation";
import VehicleForm from "@/components/admin/VehicleForm";
import { getVehicleForAdmin } from "@/lib/vehicles";
import { query } from "@/lib/db";

export const dynamic = "force-dynamic";
export default async function EditVehiclePage({ params }) {
  const { id } = await params;
  if (!/^\d+$/.test(id)) notFound();
  const [vehicle, images] = await Promise.all([getVehicleForAdmin(Number(id)), query("SELECT id,image_url,alt_text,is_cover FROM vehicle_images WHERE vehicle_id=? ORDER BY sort_order,id", [id])]);
  if (!vehicle) notFound();
  return <><p className="text-xs font-bold uppercase tracking-[.24em] text-tokyo-red">Portföy Yönetimi</p><h1 className="mt-3 font-display text-5xl font-bold uppercase text-white">Aracı Düzenle</h1><VehicleForm vehicle={{...vehicle, modelYear: vehicle.year, mileage: vehicle.mileageValue}} images={images} /></>;
}
