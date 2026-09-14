"use client";

import Link from "next/link";
import { ArrowRight, Heart } from "lucide-react";
import { useEffect, useState } from "react";
import VehicleCard from "@/components/ui/VehicleCard";

function getFavoriteIds() {
  try {
    const storedFavorites = window.localStorage.getItem(
      "autoTokyoFavorites",
    );

    return storedFavorites ? JSON.parse(storedFavorites) : [];
  } catch {
    return [];
  }
}

export default function FavoritesContent({ vehicles = [] }) {
  const [favoriteIds, setFavoriteIds] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const loadFavorites = () => {
      setFavoriteIds(getFavoriteIds());
      setIsLoaded(true);
    };

    loadFavorites();

    window.addEventListener("storage", loadFavorites);

    return () => {
      window.removeEventListener("storage", loadFavorites);
    };
  }, []);

  const favoriteVehicles = vehicles.filter((vehicle) =>
    favoriteIds.includes(vehicle.id),
  );

  if (!isLoaded) {
    return (
      <div className="grid min-h-64 place-items-center rounded-[2rem] border border-white/10 bg-white/[0.025]">
        <div className="size-10 animate-spin rounded-full border-2 border-white/10 border-t-tokyo-red" />
      </div>
    );
  }

  if (favoriteVehicles.length === 0) {
    return (
      <div className="rounded-[2rem] border border-white/10 bg-white/[0.025] px-6 py-16 text-center sm:py-20">
        <div className="mx-auto grid size-20 place-items-center rounded-full border border-white/10 bg-white/[0.03] text-tokyo-red">
          <Heart aria-hidden="true" className="size-9" />
        </div>

        <h2 className="mt-7 font-display text-4xl font-extrabold uppercase text-white">
          Henüz Favori Aracınız Yok
        </h2>

        <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-tokyo-silver">
          Beğendiğiniz araçların üzerindeki kalp simgesine dokunarak
          favorilerinize ekleyebilir ve daha sonra kolayca
          görüntüleyebilirsiniz.
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

  return (
    <>
      <div className="mb-8 flex flex-col gap-3 border-b border-white/10 pb-6 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-tokyo-silver">
          {favoriteVehicles.length} favori araç görüntüleniyor
        </p>

        <Link
          href="/araclar"
          className="inline-flex w-fit items-center gap-2 text-sm font-bold text-tokyo-red transition-colors hover:text-red-400"
        >
          Diğer Araçları Gör
          <ArrowRight aria-hidden="true" className="size-4" />
        </Link>
      </div>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {favoriteVehicles.map((vehicle) => (
          <VehicleCard key={vehicle.id} vehicle={vehicle} />
        ))}
      </div>
    </>
  );
}
