import { Barlow_Condensed, Montserrat } from "next/font/google";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import "./globals.css";

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin", "latin-ext"],
  display: "swap",
});

const barlowCondensed = Barlow_Condensed({
  variable: "--font-barlow-condensed",
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

export const metadata = {
  metadataBase: new URL("https://autotokyo.com.tr"),

  title: {
    default: "Auto Tokyo | Aksaray Araç Alım Satım",
    template: "%s | Auto Tokyo",
  },

  description:
    "Auto Tokyo, Aksaray Merkez'de güven, kalite ve performans anlayışıyla araç alım, satım ve takas hizmetleri sunar.",

  keywords: [
    "Auto Tokyo",
    "Aksaray oto galeri",
    "Aksaray satılık araç",
    "ikinci el araç",
    "araç alım satım",
    "araç takas",
  ],

  authors: [
    {
      name: "Auto Tokyo",
    },
  ],

  creator: "Auto Tokyo",

  verification: {
    google: "vlYsMPqszTaeEKV2FPWhxEuxWG1MYrlaD7MKP2el0k4",
  },

  applicationName: "Auto Tokyo",

  category: "automotive",

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },

  openGraph: {
    type: "website",
    locale: "tr_TR",
    url: "https://autotokyo.com.tr",
    siteName: "Auto Tokyo",
    title: "Auto Tokyo | Güven, Kalite, Performans",
    description:
      "Aksaray Merkez'de seçkin araç portföyü, araç alım, satım ve takas hizmetleri.",
    images: [{ url: "/images/logo/auto-tokyo-logo.jpg", width: 1200, height: 630, alt: "Auto Tokyo" }],
  },

  twitter: {
    card: "summary_large_image",
    title: "Auto Tokyo | Güven, Kalite, Performans",
    description:
      "Aksaray Merkez'de seçkin araç portföyü, araç alım, satım ve takas hizmetleri.",
    images: ["/images/logo/auto-tokyo-logo.jpg"],
  },
};

const businessJsonLd = {
  "@context": "https://schema.org",
  "@type": ["AutoDealer", "LocalBusiness"],
  "@id": "https://autotokyo.com.tr/#business",
  name: "Auto Tokyo",
  url: "https://autotokyo.com.tr/",
  logo: "https://autotokyo.com.tr/images/logo/auto-tokyo-logo.jpg",
  image: "https://autotokyo.com.tr/images/logo/auto-tokyo-logo.jpg",
  description:
    "Auto Tokyo, Aksaray Merkez'de araç alım, satım ve takas hizmetleri sunan otomobil galerisidir.",
  email: "mailto:autotokyo68@gmail.com",
  telephone: "+90 545 552 07 86",
  address: {
    "@type": "PostalAddress",
    streetAddress: "15 Temmuz Şehitler Bulvarı, B Blok No: 4, Otonomi",
    addressLocality: "Merkez",
    addressRegion: "Aksaray",
    postalCode: "68100",
    addressCountry: "TR",
  },
  geo: {
    "@type": "GeoCoordinates",
    latitude: 38.3507208,
    longitude: 33.9863527,
  },
  openingHoursSpecification: [
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
      opens: "09:00",
      closes: "17:00",
    },
  ],
  sameAs: ["https://www.instagram.com/autotokyo68/"],
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="tr"
      className={`${montserrat.variable} ${barlowCondensed.variable}`}
    >
      <body className="flex min-h-screen flex-col">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(businessJsonLd).replace(/</g, "\\u003c"),
          }}
        />
        <Navbar />

        <main className="flex-1">{children}</main>

        <Footer />
      </body>
    </html>
  );
}
