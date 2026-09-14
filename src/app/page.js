import AboutPreview from "@/components/home/AboutPreview";
import AppointmentCta from "@/components/home/AppointmentCta";
import ContactPreview from "@/components/home/ContactPreview";
import FeaturedVehicles from "@/components/home/FeaturedVehicles";
import HeroSection from "@/components/home/HeroSection";
import SellTradeCta from "@/components/home/SellTradeCta";
import IntroOverlay from "@/components/home/IntroOverlay";

export const metadata = {
  title: "Auto Tokyo | Aksaray Oto Galeri ve İkinci El Araç",
  description:
    "Aksaray Otonomi'de ikinci el araç alım, satım ve takas hizmetleri. Auto Tokyo'nun güncel araçlarını inceleyin, randevu alın veya aracınız için teklif isteyin.",
  alternates: {
    canonical: "/",
  },
};

export default function Home() {
  return (
    <>
      <IntroOverlay />
      <HeroSection />

      <FeaturedVehicles />

      <SellTradeCta />

      <AboutPreview />

      <AppointmentCta />

      <ContactPreview />
    </>
  );
}

export const dynamic = "force-dynamic";
