export const Link = require("next/link").default;
export const useRouter = require("next/navigation").useRouter;
export const usePathname = require("next/navigation").usePathname;
export const routing = { defaultLocale: "en", locales: ["en"] };
export const locales = ["en"];
export const redirect = require("next/navigation").redirect;
export type AppLocale = "en";
export function isAppLocale(locale: string): locale is AppLocale { return locale === "en"; }
export function stripLocalePrefix(path: string): string { return path.replace(/^\/en/, ""); }
