import { getPublicVehicles } from "@/lib/vehicles";
export const dynamic = "force-dynamic";
export default async function sitemap() {
  const base = "https://autotokyo.com.tr";
  const routes = ["", "/araclar", "/hakkimizda", "/randevu", "/aracini-sat", "/iletisim", "/kvkk", "/gizlilik", "/cerez-politikasi"];
  const vehicles = await getPublicVehicles();
  return [...routes.map((route) => ({ url: `${base}${route}`, lastModified: new Date(), changeFrequency: route === "/araclar" ? "daily" : "monthly", priority: route === "" ? 1 : .7 })), ...vehicles.map((vehicle) => ({ url: `${base}/araclar/${vehicle.slug}`, lastModified: new Date(), changeFrequency: "weekly", priority: .8 }))];
}
