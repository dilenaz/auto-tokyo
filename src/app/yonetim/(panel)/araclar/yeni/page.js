import VehicleForm from "@/components/admin/VehicleForm";
import SahibindenFileImportForm from "@/components/admin/SahibindenFileImportForm";

export default function NewVehiclePage() {
  return <><p className="text-xs font-bold uppercase tracking-[.24em] text-tokyo-red">Portföy Yönetimi</p><h1 className="mt-3 font-display text-5xl font-bold uppercase text-white">Yeni Araç</h1><SahibindenFileImportForm /><VehicleForm /></>;
}
