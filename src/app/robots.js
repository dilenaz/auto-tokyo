export default function robots() {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/api/", "/yonetim/", "/favoriler", "/karsilastir"],
    },
    sitemap: "https://autotokyo.com.tr/sitemap.xml",
    host: "https://autotokyo.com.tr",
  };
}
