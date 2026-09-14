"use client";

import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  CarFront,
  Fuel,
  Gauge,
  Settings2,
  Trash2,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";

function getComparisonIds() {
  try {
    const storedVehicles = window.localStorage.getItem(
      "autoTokyoComparison",
    );

    return storedVehicles ? JSON.parse(storedVehicles) : [];
  } catch {
    return [];
  }
}

export default function ComparisonContent({ vehicles = [] }) {
  const [comparisonIds, setComparisonIds] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Browser storage is intentionally read after hydration.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setComparisonIds(getComparisonIds());
    setIsLoaded(true);
  }, []);

  const comparedVehicles = vehicles.filter((vehicle) =>
    comparisonIds.includes(vehicle.id),
  );

  const removeVehicle = (vehicleId) => {
    const updatedIds = comparisonIds.filter(
      (id) => id !== vehicleId,
    );

    try { window.localStorage.setItem("autoTokyoComparison", JSON.stringify(updatedIds)); } catch {}

    setComparisonIds(updatedIds);
  };

  const clearComparison = () => {
    try { window.localStorage.removeItem("autoTokyoComparison"); } catch {}
    setComparisonIds([]);
  };

  if (!isLoaded) {
    return (
      <div className="grid min-h-64 place-items-center rounded-[2rem] border border-white/10 bg-white/[0.025]">
        <div className="size-10 animate-spin rounded-full border-2 border-white/10 border-t-tokyo-red" />
      </div>
    );
  }

  if (comparedVehicles.length === 0) {
    return (
      <div className="rounded-[2rem] border border-white/10 bg-white/[0.025] px-6 py-16 text-center sm:py-20">
        <div className="mx-auto grid size-20 place-items-center rounded-full border border-white/10 bg-white/[0.03] text-tokyo-red">
          <CarFront aria-hidden="true" className="size-9" />
        </div>

        <h2 className="mt-7 font-display text-4xl font-extrabold uppercase text-white">
          Karşılaştırılacak Araç Yok
        </h2>

        <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-tokyo-silver">
          Araç kartlarındaki karşılaştırma simgesini kullanarak en fazla üç
          aracı yan yana inceleyebilirsiniz.
        </p>

        <Link
          href="/araclar"
          className="red-glow mt-8 inline-flex items-center gap-2 rounded-full bg-tokyo-red px-7 py-4 text-sm font-bold text-white transition-colors hover:bg-red-500"
        >
          Araçları İncele
          <ArrowRight aria-hidden="true" className="size-4" />
        </Link>
      </div>
    );
  }

  const comparisonRows = [
    {
      label: "Model",
      getValue: (vehicle) => vehicle.model,
    },
    {
      label: "Model yılı",
      getValue: (vehicle) => vehicle.year || "Bilgi eklenecek",
    },
    {
      label: "Kilometre",
      getValue: (vehicle) =>
        vehicle.mileage || "Bilgi eklenecek",
    },
    {
      label: "Yakıt",
      getValue: (vehicle) => vehicle.fuel || "Bilgi eklenecek",
    },
    {
      label: "Vites",
      getValue: (vehicle) =>
        vehicle.transmission || "Bilgi eklenecek",
    },
    {
      label: "Fiyat",
      getValue: (vehicle) =>
        vehicle.price
          ? `${vehicle.price.toLocaleString("tr-TR")} TL`
          : "Bilgi için iletişime geçin",
    },
  ];

  return (
    <>
      <div className="mb-8 flex flex-col gap-4 border-b border-white/10 pb-6 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-tokyo-silver">
          {comparedVehicles.length}/3 araç karşılaştırılıyor
        </p>

        <button
          type="button"
          onClick={clearComparison}
          className="inline-flex w-fit items-center gap-2 text-sm font-semibold text-red-400 transition-colors hover:text-red-300"
        >
          <Trash2 aria-hidden="true" className="size-4" />
          Karşılaştırmayı Temizle
        </button>
      </div>

      <div className="overflow-x-auto rounded-[2rem] border border-white/10">
        <div
          className="grid min-w-[48rem]"
          style={{
            gridTemplateColumns: `12rem repeat(${comparedVehicles.length}, minmax(12rem, 1fr))`,
          }}
        >
          <div className="border-b border-r border-white/10 bg-black/40 p-5" />

          {comparedVehicles.map((vehicle) => (
            <article
              key={vehicle.id}
              className="relative border-b border-r border-white/10 bg-tokyo-surface p-5 last:border-r-0"
            >
              <button
                type="button"
                onClick={() => removeVehicle(vehicle.id)}
                aria-label={`${vehicle.brand} ${vehicle.model} aracını karşılaştırmadan kaldır`}
                className="absolute right-3 top-3 grid size-9 place-items-center rounded-full border border-white/10 bg-black/50 text-tokyo-silver transition-colors hover:border-red-500/50 hover:text-red-400"
              >
                <X aria-hidden="true" className="size-4" />
              </button>

              <div className="relative grid aspect-[4/3] place-items-center overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-white/[0.06] via-black to-tokyo-red/10">
                {vehicle.image ? (
                  <Image
                    src={vehicle.image}
                    alt={`${vehicle.brand} ${vehicle.model}`}
                    fill
                    sizes="(max-width: 768px) 14rem, 22rem"
                    className="object-contain p-2"
                  />
                ) : (
                  <CarFront
                    aria-hidden="true"
                    className="size-16 text-white/60"
                  />
                )}
              </div>

              <p className="mt-5 text-xs font-bold uppercase tracking-wider text-tokyo-red">
                {vehicle.brand}
              </p>

              <h2 className="mt-2 font-display text-2xl font-bold uppercase text-white">
                {vehicle.model}
              </h2>

              <Link
                href={`/araclar/${vehicle.slug}`}
                className="mt-5 inline-flex items-center gap-2 text-xs font-bold text-white transition-colors hover:text-tokyo-red"
              >
                Aracı İncele
                <ArrowRight aria-hidden="true" className="size-4" />
              </Link>
            </article>
          ))}

          {comparisonRows.map((row, rowIndex) => (
            <div key={row.label} className="contents">
              <div
                className={`border-r border-white/10 p-5 text-xs font-bold uppercase tracking-wider text-tokyo-muted ${
                  rowIndex < comparisonRows.length - 1
                    ? "border-b"
                    : ""
                }`}
              >
                {row.label}
              </div>

              {comparedVehicles.map((vehicle) => (
                <div
                  key={`${row.label}-${vehicle.id}`}
                  className={`border-r border-white/10 bg-white/[0.015] p-5 text-sm font-semibold text-white last:border-r-0 ${
                    rowIndex < comparisonRows.length - 1
                      ? "border-b"
                      : ""
                  }`}
                >
                  {row.getValue(vehicle)}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        {[
          {
            icon: Gauge,
            title: "Kilometre",
          },
          {
            icon: Fuel,
            title: "Yakıt",
          },
          {
            icon: Settings2,
            title: "Vites",
          },
        ].map((item) => {
          const Icon = item.icon;

          return (
            <div
              key={item.title}
              className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.025] p-4 text-sm text-tokyo-silver"
            >
              <Icon
                aria-hidden="true"
                className="size-5 text-tokyo-red"
              />
              Eksik {item.title.toLocaleLowerCase("tr-TR")} bilgileri ilan
              verileriyle güncellenecek.
            </div>
          );
        })}
      </div>
    </>
  );
}
