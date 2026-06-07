/**
 * Locked brand assets — do not change paths or remove files without explicit product approval.
 * Logo + favicon must always load from these URLs across header, metadata and PWA hints.
 */
export const BRAND_ASSETS = {
 logo: {
 default: "/img/brand/sectorcalc-logo.png",
 onDark: "/img/brand/sectorcalc-logo-on-dark.png",
 width: 1024,
 height: 268,
 },
 favicon: {
 master: "/img/brand/sectorcalc-favicon.png",
 size32: "/img/brand/sectorcalc-favicon-32.png",
 appleTouch: "/img/brand/sectorcalc-favicon-180.png",
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
