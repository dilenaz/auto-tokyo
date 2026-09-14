"use client";

import { useEffect } from "react";

export default function VehicleViewTracker({ vehicleId }) {
  useEffect(() => {
    try {
      const storedVehicles = window.localStorage.getItem(
        "autoTokyoRecentlyViewed",
      );

      const recentlyViewedIds = storedVehicles
        ? JSON.parse(storedVehicles)
        : [];

      const updatedIds = [
        vehicleId,
        ...recentlyViewedIds.filter((id) => id !== vehicleId),
      ].slice(0, 6);

      window.localStorage.setItem(
        "autoTokyoRecentlyViewed",
        JSON.stringify(updatedIds),
      );
    } catch {
      try {
        window.localStorage.removeItem("autoTokyoRecentlyViewed");
      } catch {
        // Storage can be unavailable in strict privacy modes.
      }
    }
  }, [vehicleId]);

  return null;
}
