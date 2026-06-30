import { stripLocaleFromPath } from "@/lib/infrastructure/i18n/locale-routing";

/** Routes that need Firebase auth on first paint (account, checkout, premium tools). */
export function isAuthRequiredPath(pathname: string): boolean {
  const bare = stripLocaleFromPath(pathname);
  return (
    /^\/(account|login|pricing)(\/|$)/.test(bare) ||
    /^\/tools\/(premium|premium-schema)\//.test(bare) ||
    /^\/admin(\/|$)/.test(bare)
  );
}

export function isAuthRequiredBrowserPath(): boolean {
  if (typeof window === "undefined") {
    return false;
  }
  return isAuthRequiredPath(window.location.pathname);
}
