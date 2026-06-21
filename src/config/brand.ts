/**
 * Locked brand assets — do not change paths or remove files without explicit product approval.
 * Logo + favicon must always load from these URLs across header, metadata and PWA hints.
 */
export const BRAND_ASSETS = {
 logo: {
 default: "/img/brand/sectorcalc-logo.png",
 onDark: "/img/brand/sectorcalc-logo-on-dark.png",
 /** Header/LCP — 2× display size; master PNGs kept for schema and print. */
 headerDefault: "/img/brand/sectorcalc-logo-header.png",
 headerOnDark: "/img/brand/sectorcalc-logo-on-dark-header.png",
    /** SVG symbol/icon logo (original thin stroke). */
    symbolSvg: "/img/brand/sectorcalc-logo.svg",
    /** SVG bold filled symbol — matches the real Trace AI bracket logo in black. */
    symbolBoldSvg: "/img/brand/sectorcalc-logo-bold.svg",
 /** Intrinsic asset dimensions (PNG master). */
 width: 1024,
 height: 268,
 /** Header asset dimensions (520×136 PNG). */
 headerWidth: 520,
 headerHeight: 136,
 /** Max rendered size in header — used for Next/Image `sizes` and layout. */
 displayWidth: 260,
 displayHeight: 68,
 /** SVG symbol display size — rendered via native <img>. */
 symbolWidth: 512,
 symbolHeight: 512,
 displaySymbolWidth: 88,
 displaySymbolHeight: 88,
 },
favicon: {
    /** Master PNG favicon (Sector Mavisi logo). */
    master: "/img/brand/sectorcalc-favicon.png",
    /** 32×32 PNG for standard browser tabs. */
    size32: "/img/brand/sectorcalc-favicon-32.png",
    /** Apple touch icon 180×180 PNG. */
    appleTouch: "/img/brand/sectorcalc-favicon-180.png",
    svg: "/img/brand/sectorcalc-favicon.svg",
    width: 512,
    height: 512,
  },
 heroDevices: {
 src: "/images/sectorcalc-devices-hero.png",
 width: 1024,
 height: 576,
 },
 platformFlow: {
 src: "/images/sectorcalc-platform-hero.png",
 width: 1024,
 height: 562,
 },
} as const;

export const BRAND_METADATA_ICONS = {
  icon: [
    { url: BRAND_ASSETS.favicon.size32, sizes: "32x32", type: "image/png" },
    { url: BRAND_ASSETS.favicon.master, sizes: "512x512", type: "image/png" },
  ],
  apple: [
    {
      url: BRAND_ASSETS.favicon.appleTouch,
      sizes: "180x180",
      type: "image/png",
    },
  ],
  shortcut: BRAND_ASSETS.favicon.master,
} as const;
