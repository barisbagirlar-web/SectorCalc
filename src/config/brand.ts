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
 /** SVG symbol/icon logo. */
 symbolSvg: "/img/brand/sectorcalc-logo.svg",
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
    /** Only SVG used — PNG variants removed for cross-locale consistency. */
    svg: "/img/brand/sectorcalc-favicon.svg",
    appleTouch: "/img/brand/sectorcalc-favicon.svg",
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
    { url: BRAND_ASSETS.favicon.svg, sizes: "any", type: "image/svg+xml" },
  ],
  apple: [
    {
      url: BRAND_ASSETS.favicon.appleTouch,
      sizes: "any",
      type: "image/svg+xml",
    },
  ],
  shortcut: BRAND_ASSETS.favicon.svg,
} as const;
