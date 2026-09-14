"use client";

import Link from "next/link";
import {
  Filter,
  RotateCcw,
  Search,
  SlidersHorizontal,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import VehicleCard from "@/components/ui/VehicleCard";

const defaultFilters = {
  search: "",
  brand: "all",
  fuel: "all",
  transmission: "all",
  sort: "default",
  showSold: false,
};

function getStoredFilters() {
  if (typeof window === "undefined") {
    return defaultFilters;
  }

  try {
    const storedFilters = window.sessionStorage.getItem(
      "autoTokyoVehicleFilters",
    );

    return storedFilters
      ? {
          ...defaultFilters,
          ...JSON.parse(storedFilters),
        }
      : defaultFilters;
  } catch {
    return defaultFilters;
  }
}

export default function VehicleCatalog({ vehicles }) {
  const [filters, setFilters] = useState(defaultFilters);
  const [isFilterPanelOpen, setIsFilterPanelOpen] = useState(false);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // Browser storage is intentionally read after hydration.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setFilters(getStoredFilters());
    setIsReady(true);

    const storedScrollPosition = Number(
      window.sessionStorage.getItem(
        "autoTokyoVehicleScrollPosition",
      ) || 0,
    );

    if (storedScrollPosition > 0) {
      window.requestAnimationFrame(() => {
        window.scrollTo({
          top: storedScrollPosition,
          behavior: "instant",
        });
      });
    }
  }, []);

  useEffect(() => {
    if (!isReady) {
      return;
    }

    window.sessionStorage.setItem(
      "autoTokyoVehicleFilters",
      JSON.stringify(filters),
    );
  }, [filters, isReady]);

  useEffect(() => {
    if (!isReady) {
      return;
    }

    let scrollTimer;

    const saveScrollPosition = () => {
      window.clearTimeout(scrollTimer);

      scrollTimer = window.setTimeout(() => {
        window.sessionStorage.setItem(
          "autoTokyoVehicleScrollPosition",
          String(window.scrollY),
        );
      }, 150);
    };

    window.addEventListener("scroll", saveScrollPosition, {
      passive: true,
    });

    return () => {
      window.clearTimeout(scrollTimer);
      window.removeEventListener("scroll", saveScrollPosition);
    };
  }, [isReady]);

  const brands = useMemo(
    () =>
      [...new Set(vehicles.map((vehicle) => vehicle.brand))].sort(
        (firstBrand, secondBrand) =>
          firstBrand.localeCompare(secondBrand, "tr"),
      ),
    [vehicles],
  );

  const filteredVehicles = useMemo(() => {
    const normalizedSearch = filters.search
      .trim()
      .toLocaleLowerCase("tr-TR");

    const result = vehicles.filter((vehicle) => {
      const matchesStatus =
        vehicle.status === "published" ||
        (filters.showSold && vehicle.status === "sold");
      const searchableText = [
        vehicle.brand,
        vehicle.model,
        vehicle.title,
      ]
        .join(" ")
        .toLocaleLowerCase("tr-TR");

      const matchesSearch =
        !normalizedSearch ||
        searchableText.includes(normalizedSearch);

      const matchesBrand =
        filters.brand === "all" ||
        vehicle.brand === filters.brand;

      const matchesFuel =
        filters.fuel === "all" ||
        vehicle.fuel === filters.fuel;

      const matchesTransmission =
        filters.transmission === "all" ||
        vehicle.transmission === filters.transmission;

      return (
        matchesStatus &&
        matchesSearch &&
        matchesBrand &&
        matchesFuel &&
        matchesTransmission
      );
    });

    return [...result].sort((firstVehicle, secondVehicle) => {
      if (filters.sort === "price-asc") {
        if (!firstVehicle.price) {
          return 1;
        }

        if (!secondVehicle.price) {
          return -1;
        }

        return firstVehicle.price - secondVehicle.price;
      }

      if (filters.sort === "price-desc") {
        if (!firstVehicle.price) {
          return 1;
        }

        if (!secondVehicle.price) {
          return -1;
        }

        return secondVehicle.price - firstVehicle.price;
      }

      if (filters.sort === "mileage-asc") {
        const firstMileage = Number(
          String(firstVehicle.mileage || "")
            .replace(/\D/g, "")
            .replace("xxx", "000"),
        );

        const secondMileage = Number(
          String(secondVehicle.mileage || "")
            .replace(/\D/g, "")
            .replace("xxx", "000"),
        );

        if (!firstMileage) {
          return 1;
        }

        if (!secondMileage) {
          return -1;
        }

        return firstMileage - secondMileage;
      }

      if (filters.sort === "year-desc") {
        return (
          Number(secondVehicle.year || 0) -
          Number(firstVehicle.year || 0)
        );
      }

      return Number(secondVehicle.featured) -
        Number(firstVehicle.featured);
    });
  }, [filters, vehicles]);

  const updateFilter = (field, value) => {
    setFilters((current) => ({
      ...current,
      [field]: value,
    }));

    window.sessionStorage.setItem(
      "autoTokyoVehicleScrollPosition",
      "0",
    );
  };

  const resetFilters = () => {
    setFilters(defaultFilters);

    window.sessionStorage.setItem(
      "autoTokyoVehicleScrollPosition",
      "0",
    );
  };

  const hasActiveFilters =
    filters.search ||
    filters.brand !== "all" ||
    filters.fuel !== "all" ||
    filters.transmission !== "all" ||
    filters.sort !== "default";
  const hasFilters = hasActiveFilters || filters.showSold;

  return (
    <>
      <div className="rounded-[2rem] border border-white/10 bg-tokyo-surface p-5 shadow-2xl sm:p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
          <div className="relative flex-1">
            <Search
              aria-hidden="true"
              className="absolute left-4 top-1/2 size-5 -translate-y-1/2 text-tokyo-muted"
            />

            <input
              type="search"
              value={filters.search}
              onChange={(event) =>
                updateFilter("search", event.target.value)
              }
              placeholder="Marka, model veya özellik ara..."
              className="w-full rounded-2xl border border-white/10 bg-black/40 py-4 pl-12 pr-5 text-sm text-white outline-none placeholder:text-tokyo-muted focus:border-tokyo-red"
            />
          </div>

          <button
            type="button"
            onClick={() =>
              setIsFilterPanelOpen((current) => !current)
            }
            aria-expanded={isFilterPanelOpen}
            className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/10 px-5 py-4 text-sm font-bold text-white transition-colors hover:border-tokyo-red/40"
          >
            <SlidersHorizontal
              aria-hidden="true"
              className="size-5 text-tokyo-red"
            />
            Filtrele ve Sırala
          </button>

          <Link
            href="/karsilastir"
            className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/10 px-5 py-4 text-sm font-bold text-white transition-colors hover:border-tokyo-red/40"
          >
            <Filter
              aria-hidden="true"
              className="size-5 text-tokyo-red"
            />
            Karşılaştır
          </Link>
        </div>

        {isFilterPanelOpen && (
          <div className="mt-5 grid gap-4 border-t border-white/10 pt-5 sm:grid-cols-2 lg:grid-cols-4">
            <FilterSelect
              label="Marka"
              value={filters.brand}
              onChange={(value) => updateFilter("brand", value)}
              options={brands}
            />

            <FilterSelect
              label="Yakıt"
              value={filters.fuel}
              onChange={(value) => updateFilter("fuel", value)}
              options={[
                "Benzin",
                "Dizel",
                "LPG",
                "Hibrit",
                "Elektrik",
              ]}
            />

            <FilterSelect
              label="Vites"
              value={filters.transmission}
              onChange={(value) =>
                updateFilter("transmission", value)
              }
              options={[
                "Manuel",
                "Otomatik",
                "Yarı Otomatik",
              ]}
            />

            <div>
              <label
                htmlFor="vehicle-sort"
                className="text-xs font-semibold uppercase tracking-wider text-tokyo-muted"
              >
                Sıralama
              </label>

              <select
                id="vehicle-sort"
                value={filters.sort}
                onChange={(event) =>
                  updateFilter("sort", event.target.value)
                }
                className="mt-2 w-full rounded-xl border border-white/10 bg-black px-4 py-3 text-sm text-white outline-none focus:border-tokyo-red"
              >
                <option value="default">Önerilen sıralama</option>
                <option value="price-asc">
                  Fiyatı artan
                </option>
                <option value="price-desc">
                  Fiyatı azalan
                </option>
                <option value="mileage-asc">
                  Kilometresi düşük
                </option>
                <option value="year-desc">
                  Model yılı yüksek
                </option>
              </select>
            </div>
          </div>
        )}

        <div className="mt-5 flex flex-col gap-4 border-t border-white/10 pt-5 sm:flex-row sm:items-center sm:justify-between">
          <label className="inline-flex cursor-pointer items-center gap-3 text-sm font-semibold text-white">
            <input
              type="checkbox"
              checked={filters.showSold}
              onChange={(event) => updateFilter("showSold", event.target.checked)}
              className="size-4 accent-tokyo-red"
            />
            Satılan araçları göster
          </label>
          {hasFilters && (
            <button
              type="button"
              onClick={resetFilters}
              className="inline-flex w-fit items-center gap-2 text-xs font-bold text-tokyo-red transition-colors hover:text-red-400"
            >
              <RotateCcw aria-hidden="true" className="size-4" />
              Filtreleri Temizle
            </button>
          )}
        </div>

      </div>

      <div className="mt-9 flex flex-col gap-3 border-b border-white/10 pb-6 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-tokyo-silver">
          {filteredVehicles.length} araç listeleniyor
        </p>

        {hasFilters && (
          <p className="text-xs text-tokyo-muted">
            Filtreleriniz bu cihazda geçici olarak korunur.
          </p>
        )}
      </div>

      {filteredVehicles.length > 0 ? (
        <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {filteredVehicles.map((vehicle) => (
            <VehicleCard key={vehicle.id} vehicle={vehicle} />
          ))}
        </div>
      ) : (
        <div className="mt-10 rounded-[2rem] border border-white/10 bg-white/[0.025] px-6 py-16 text-center">
          <h2 className="font-display text-3xl font-bold uppercase text-white">
            Aradığınız Kriterlerde Araç Bulunamadı
          </h2>

          <p className="mt-4 text-sm text-tokyo-silver">
            Filtreleri değiştirerek diğer araçları inceleyebilirsiniz.
          </p>

          <button
            type="button"
            onClick={resetFilters}
            className="mt-7 inline-flex items-center gap-2 rounded-full bg-tokyo-red px-6 py-3 text-sm font-bold text-white"
          >
            <RotateCcw aria-hidden="true" className="size-4" />
            Filtreleri Temizle
          </button>
        </div>
      )}
    </>
  );
}

function FilterSelect({
  label,
  value,
  onChange,
  options,
}) {
  const fieldId = `filter-${label
    .toLocaleLowerCase("tr-TR")
    .replaceAll(" ", "-")}`;

  return (
    <div>
      <label
        htmlFor={fieldId}
        className="text-xs font-semibold uppercase tracking-wider text-tokyo-muted"
      >
        {label}
      </label>

      <select
        id={fieldId}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="mt-2 w-full rounded-xl border border-white/10 bg-black px-4 py-3 text-sm text-white outline-none focus:border-tokyo-red"
      >
        <option value="all">Tümü</option>

        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );
}
