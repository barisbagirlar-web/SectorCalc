// Self-contained PWA Web App Manifest — no indirect imports from config chains.
// Breaking the indirect import chain isolates this route from build errors
// in the wider configuration/import graph.

interface ManifestIcon {
  src: string;
  sizes: string;
  type: string;
}

interface Manifest {
  name: string;
  short_name: string;
  description: string;
  start_url: string;
  display: string;
  background_color: string;
  theme_color: string;
  icons: ManifestIcon[];
}

export default function manifest(): Manifest {
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
