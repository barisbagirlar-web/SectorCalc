/**
 * Locked brand assets — do not change paths or remove files without explicit product approval.
 * Logo + favicon must always load from these URLs across header, metadata and PWA hints.
 */
export const BRAND_ASSETS = {
 logo: {
 default: "/img/brand/sectorcalc-logo.svg",
 onDark: "/img/brand/sectorcalc-logo-on-dark.svg",
 /** Header/LCP — SVG with 4 blue squares + SectorCalc text. */
 headerDefault: "/img/brand/sectorcalc-logo.svg",
 headerOnDark: "/img/brand/sectorcalc-logo-on-dark.svg",
    /** SVG symbol/icon logo (original thin stroke). */
    symbolSvg: "/img/brand/sectorcalc-logo.svg",
    /** SVG bold filled symbol — matches the real Trace AI bracket logo in black. */
    symbolBoldSvg: "/img/brand/sectorcalc-logo-bold.svg",
 /** Intrinsic asset dimensions (SVG native). */
 width: 280,
 height: 72,
 /** Header asset dimensions (SVG). */
 headerWidth: 280,
 headerHeight: 72,
 /** Max rendered size in header — used for Next/Image `sizes` and layout. */
 displayWidth: 130,
 displayHeight: 34,
 /** SVG symbol display size — rendered via native <img>. */
 symbolWidth: 280,
 symbolHeight: 72,
 displaySymbolWidth: 130,
 displaySymbolHeight: 34,
 },
favicon: {
    /** Master PNG favicon (Sector Mavisi logo). */
    master: "/img/brand/sectorcalc-mark.png",
    /** 32×32 PNG for standard browser tabs. */
    size32: "/img/brand/sectorcalc-mark.png",
    /** Apple touch icon 180×180 PNG. */
    appleTouch: "/img/brand/sectorcalc-mark.png",
    svg: "/img/brand/sectorcalc-mark.svg",
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
