"use client";

import Link from "next/link";
import { Heart, Scale } from "lucide-react";
import { useEffect, useState } from "react";

function readIds(key) {
  try {
    return JSON.parse(window.localStorage.getItem(key) || "[]");
  } catch {
    return [];
  }
}

export default function VehicleActions({ vehicleId }) {
  const [favorite, setFavorite] = useState(false);
  const [compared, setCompared] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    // Browser storage is intentionally read after hydration.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setFavorite(readIds("autoTokyoFavorites").includes(vehicleId));
    setCompared(readIds("autoTokyoComparison").includes(vehicleId));
  }, [vehicleId]);

  function toggleFavorite() {
    const ids = readIds("autoTokyoFavorites");
    const next = ids.includes(vehicleId)
      ? ids.filter((id) => id !== vehicleId)
      : [...ids, vehicleId];
    window.localStorage.setItem("autoTokyoFavorites", JSON.stringify(next));
    setFavorite(next.includes(vehicleId));
    setMessage(next.includes(vehicleId) ? "Favorilere eklendi." : "Favorilerden çıkarıldı.");
  }

  function toggleComparison() {
    const ids = readIds("autoTokyoComparison");
    if (!ids.includes(vehicleId) && ids.length >= 3) {
      setMessage("En fazla 3 araç karşılaştırabilirsiniz.");
      return;
    }
    const next = ids.includes(vehicleId)
      ? ids.filter((id) => id !== vehicleId)
      : [...ids, vehicleId];
    window.localStorage.setItem("autoTokyoComparison", JSON.stringify(next));
    setCompared(next.includes(vehicleId));
    setMessage(next.includes(vehicleId) ? "Karşılaştırmaya eklendi." : "Karşılaştırmadan çıkarıldı.");
  }

  const button = "inline-flex items-center justify-center gap-2 rounded-2xl border border-white/15 px-4 py-3 text-xs font-bold transition-colors hover:border-tokyo-red/60";

  return (
    <div className="min-w-0 rounded-2xl border border-white/10 bg-black/25 p-4">
      <p className="mb-3 text-xs font-bold uppercase tracking-[.18em] text-tokyo-muted">
        Araç İşlemleri
      </p>
      <div className="grid gap-2 sm:grid-cols-2">
        <button type="button" aria-pressed={favorite} onClick={toggleFavorite} className={`${button} ${favorite ? "bg-tokyo-red text-white" : "bg-black/30"}`}>
          <Heart className={`size-4 ${favorite ? "fill-current" : ""}`} aria-hidden="true" />
          {favorite ? "Favoride" : "Favoriye Ekle"}
        </button>
        <button type="button" aria-pressed={compared} onClick={toggleComparison} className={`${button} ${compared ? "bg-tokyo-red text-white" : "bg-black/30"}`}>
          <Scale className="size-4" aria-hidden="true" />
          {compared ? "Karşılaştırmada" : "Karşılaştır"}
        </button>
      </div>
      <p className="mt-2 min-h-5 text-center text-xs text-tokyo-silver" role="status" aria-live="polite">{message}</p>
      <Link
        href="/karsilastir"
        className="mt-2 flex w-full items-center justify-center gap-2 rounded-2xl border border-tokyo-red/50 bg-tokyo-red/10 px-4 py-3 text-xs font-bold text-white transition hover:bg-tokyo-red"
      >
        <Scale className="size-4" aria-hidden="true" />
        Karşılaştırma Sayfasına Git
      </Link>
    </div>
  );
}
