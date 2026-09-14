"use client";

import Image from "next/image";
import Link from "next/link";
import {
  CarFront,
  Fuel,
  Gauge,
  Heart,
  Scale,
  Settings2,
} from "lucide-react";
import { useEffect, useState } from "react";

function getStoredIds(storageKey) {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    const storedValue = window.localStorage.getItem(storageKey);

    return storedValue ? JSON.parse(storedValue) : [];
  } catch {
    return [];
  }
}

export default function VehicleCard({ vehicle }) {
  const [isFavorite, setIsFavorite] = useState(false);
  const [isCompared, setIsCompared] = useState(false);
  const [comparisonMessage, setComparisonMessage] = useState("");

  useEffect(() => {
    const favoriteIds = getStoredIds("autoTokyoFavorites");
    const comparisonIds = getStoredIds("autoTokyoComparison");

    // Browser storage is intentionally read after hydration.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsFavorite(favoriteIds.includes(vehicle.id));
    setIsCompared(comparisonIds.includes(vehicle.id));
  }, [vehicle.id]);

  const toggleFavorite = () => {
    const favoriteIds = getStoredIds("autoTokyoFavorites");

    const updatedFavoriteIds = favoriteIds.includes(vehicle.id)
      ? favoriteIds.filter((id) => id !== vehicle.id)
      : [...favoriteIds, vehicle.id];

    window.localStorage.setItem(
      "autoTokyoFavorites",
      JSON.stringify(updatedFavoriteIds),
    );

    setIsFavorite(updatedFavoriteIds.includes(vehicle.id));
  };

  const toggleComparison = () => {
    const comparisonIds = getStoredIds("autoTokyoComparison");

    if (comparisonIds.includes(vehicle.id)) {
      const updatedComparisonIds = comparisonIds.filter(
        (id) => id !== vehicle.id,
      );

      window.localStorage.setItem(
        "autoTokyoComparison",
        JSON.stringify(updatedComparisonIds),
      );

      setIsCompared(false);
      setComparisonMessage("Karşılaştırmadan çıkarıldı.");

      window.setTimeout(() => {
        setComparisonMessage("");
      }, 2500);

      return;
    }

    if (comparisonIds.length >= 3) {
      setComparisonMessage("En fazla 3 araç karşılaştırabilirsiniz.");

      window.setTimeout(() => {
        setComparisonMessage("");
      }, 3000);

      return;
    }

    const updatedComparisonIds = [...comparisonIds, vehicle.id];

    window.localStorage.setItem(
      "autoTokyoComparison",
      JSON.stringify(updatedComparisonIds),
    );

    setIsCompared(true);
    setComparisonMessage("Karşılaştırmaya eklendi.");

    window.setTimeout(() => {
      setComparisonMessage("");
    }, 2500);
  };

  const detailItems = [
    {
      key: "mileage",
      icon: Gauge,
      value: vehicle.mileage || "Bilgi bekleniyor",
    },
    {
      key: "fuel",
      icon: Fuel,
      value: vehicle.fuel || "Bilgi bekleniyor",
    },
    {
      key: "transmission",
      icon: Settings2,
      value: vehicle.transmission || "Bilgi bekleniyor",
    },
  ];

  const isSold = vehicle.status === "sold";

  return (
    <article className="group relative overflow-hidden rounded-3xl border border-white/10 bg-tokyo-surface shadow-2xl transition-all duration-500 hover:-translate-y-2 hover:border-tokyo-red/40 hover:shadow-[0_30px_80px_rgba(237,17,31,0.12)]">
      <div className="relative aspect-[4/3] overflow-hidden bg-gradient-to-br from-white/[0.07] via-black to-tokyo-red/10">
        {vehicle.image ? (
          <Image
            src={vehicle.image}
            alt={`${vehicle.brand} ${vehicle.model}`}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className={`object-cover transition-transform duration-700 group-hover:scale-105 ${
              isSold ? "grayscale" : ""
            }`}
          />
        ) : (
          <>
            <div className="absolute left-1/2 top-1/2 size-48 -translate-x-1/2 -translate-y-1/2 rounded-full border border-tokyo-red/20 shadow-[0_0_70px_rgba(237,17,31,0.15)]" />

            <CarFront
              aria-hidden="true"
              strokeWidth={0.9}
              className="absolute left-1/2 top-1/2 size-28 -translate-x-1/2 -translate-y-1/2 text-white/70 transition-transform duration-500 group-hover:scale-110"
            />

            <span className="absolute bottom-5 left-1/2 -translate-x-1/2 whitespace-nowrap text-xs uppercase tracking-[0.22em] text-tokyo-muted">
              Fotoğraf eklenecek
            </span>
          </>
        )}

        <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-tokyo-surface to-transparent" />

        {vehicle.featured && !isSold && (
          <span className="absolute left-4 top-4 rounded-full bg-tokyo-red px-4 py-2 text-[0.68rem] font-bold uppercase tracking-wider text-white">
            Öne Çıkan
          </span>
        )}

        {isSold && (
          <span className="absolute left-4 top-4 rounded-full bg-white px-4 py-2 text-[0.68rem] font-bold uppercase tracking-wider text-black">
            Satıldı
          </span>
        )}

        <div className="absolute right-4 top-4 flex flex-col gap-2">
          <button
            type="button"
            aria-label={
              isFavorite ? "Favorilerden çıkar" : "Favorilere ekle"
            }
            aria-pressed={isFavorite}
            onClick={toggleFavorite}
            className={`grid size-11 place-items-center rounded-full border backdrop-blur-md transition-all ${
              isFavorite
                ? "border-tokyo-red bg-tokyo-red text-white"
                : "border-white/15 bg-black/40 text-white hover:border-tokyo-red"
            }`}
          >
            <Heart
              aria-hidden="true"
              className={`size-5 ${
                isFavorite ? "fill-current" : ""
              }`}
            />
          </button>

          <button
            type="button"
            aria-label={
              isCompared
                ? "Karşılaştırmadan çıkar"
                : "Karşılaştırmaya ekle"
            }
            aria-pressed={isCompared}
            onClick={toggleComparison}
            className={`grid size-11 place-items-center rounded-full border backdrop-blur-md transition-all ${
              isCompared
                ? "border-tokyo-red bg-tokyo-red text-white"
                : "border-white/15 bg-black/40 text-white hover:border-tokyo-red"
            }`}
          >
            <Scale aria-hidden="true" className="size-5" />
          </button>
        </div>

        {comparisonMessage && (
          <div
            role="status"
            className="absolute bottom-4 left-4 right-4 rounded-xl border border-white/10 bg-black/85 px-4 py-3 text-center text-xs font-semibold text-white backdrop-blur-md"
          >
            {comparisonMessage}
          </div>
        )}
      </div>

      <div className="relative p-6">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-tokyo-red">
          {vehicle.brand}
        </p>

        <h3 className="mt-2 font-display text-3xl font-bold uppercase leading-none text-white">
          {vehicle.model}
        </h3>

        <p className="mt-3 min-h-10 text-sm leading-5 text-tokyo-silver">
          {vehicle.title}
        </p>

        <div className="mt-6 grid grid-cols-3 gap-2 border-y border-white/10 py-4">
          {detailItems.map((item) => {
            const Icon = item.icon;

            return (
              <div
                key={item.key}
                className="min-w-0 text-center"
              >
                <Icon
                  aria-hidden="true"
                  className="mx-auto size-4 text-tokyo-red"
                />

                <p className="mt-2 truncate text-[0.68rem] text-tokyo-silver">
                  {item.value}
                </p>
              </div>
            );
          })}
        </div>

        <div className="mt-6 flex items-end justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-wider text-tokyo-muted">
              {isSold ? "İlan Durumu" : "Fiyat"}
            </p>

            <p className="mt-1 font-display text-2xl font-bold text-white">
              {isSold
                ? "Satıldı"
                : vehicle.price
                  ? `${vehicle.price.toLocaleString("tr-TR")} TL`
                  : "Bilgi için iletişime geçin"}
            </p>
          </div>

          {!isSold && (
            <Link
              href={`/araclar/${vehicle.slug}`}
              aria-label={`${vehicle.brand} ${vehicle.model} aracını incele`}
              className="grid size-12 shrink-0 place-items-center rounded-full border border-white/15 bg-white/[0.04] text-white transition-all group-hover:border-tokyo-red group-hover:bg-tokyo-red"
            >
              <span aria-hidden="true" className="text-xl">
                →
              </span>
            </Link>
          )}
        </div>
      </div>
    </article>
  );
}
