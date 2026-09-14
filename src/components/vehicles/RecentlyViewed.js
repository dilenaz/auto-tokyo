"use client";
import { useEffect, useState } from "react";
import VehicleCard from "@/components/ui/VehicleCard";
export default function RecentlyViewed({ vehicles }) {
  const [items, setItems] = useState([]);
  useEffect(() => {
    try {
      const ids = JSON.parse(localStorage.getItem("autoTokyoRecentlyViewed") || "[]");
      const valid = ids.filter((id) => vehicles.some((vehicle) => vehicle.id === id)).slice(0, 6);
      localStorage.setItem("autoTokyoRecentlyViewed", JSON.stringify(valid));
      // Browser storage is intentionally read after hydration.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setItems(valid.map((id) => vehicles.find((vehicle) => vehicle.id === id)));
    } catch {
      try {
        localStorage.removeItem("autoTokyoRecentlyViewed");
      } catch {
        // Storage can be unavailable in strict privacy modes.
      }
    }
  }, [vehicles]);
  if (!items.length) return null;
  return <section className="mt-20 border-t border-white/10 pt-14" aria-labelledby="recent-title"><h2 id="recent-title" className="font-display text-4xl font-extrabold uppercase text-white">Son Görüntülenen Araçlar</h2><div className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-3">{items.map((vehicle) => <VehicleCard key={vehicle.id} vehicle={vehicle} />)}</div></section>;
}
