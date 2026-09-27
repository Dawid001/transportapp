import type { MetadataRoute } from "next";

// App-manifest: hiermee kun je Live OV als app op je telefoon installeren ("Zet op beginscherm").
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Live OV",
    short_name: "Live OV",
    description: "Van waar je bent naar waar je heen wilt, met je bus, tram, metro of trein live op de kaart.",
    lang: "nl",
    start_url: "/",
    scope: "/",
    display: "standalone",
    orientation: "portrait",
    background_color: "#0a0a0a",
    theme_color: "#2563eb",
    icons: [
      { src: "/pwa-icon/192", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/pwa-icon/512", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/pwa-icon/512", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}
