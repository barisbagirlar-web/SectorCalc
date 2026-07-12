import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "SectorCalc Industrial Tools",
    short_name: "SectorCalc",
    description: "Industrial engineering calculations and decision math platform.",
    start_url: "/",
    display: "standalone",
    background_color: "#1A1A1A",
    theme_color: "#F0EEE6",
    icons: [
      {
        src: "/icons/icon-192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/icons/icon-512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  };
}
