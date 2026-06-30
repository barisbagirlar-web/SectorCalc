import type { MetadataRoute } from "next";
import { THEME_COLOR } from "@/config/organization-trust";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "SectorCalc Industrial Tools",
    short_name: "SectorCalc",
    description: "Industrial engineering calculations and decision math platform.",
    start_url: "/",
    display: "standalone",
    background_color: "#1A1A1A", // industrial-matte
    theme_color: THEME_COLOR,
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
