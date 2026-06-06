const DEFAULT_SITE_URL = "https://sectorcalc.com";

function normalizeSiteUrl(value: string): string {
  return value.trim().replace(/\/$/, "");
}

/** Canonical public origin; override with NEXT_PUBLIC_SITE_URL at deploy time. */
export const siteUrl = normalizeSiteUrl(
  process.env.NEXT_PUBLIC_SITE_URL ?? DEFAULT_SITE_URL
);

export const SITE = {
  siteName: "SectorCalc",
  /** @deprecated Prefer siteName — kept for existing components */
  name: "SectorCalc",
  domain: "sectorcalc.com",
  url: siteUrl,
  defaultTitle: "SectorCalc — Sector-specific calculators for real business decisions",
  defaultDescription:
    "English-first sector decision platform. Free quick estimates and premium decision reports with risk signals and scenarios for Construction, Cleaning, Restaurant, E-commerce and CNC & Manufacturing.",
  tagline: "Sector-specific calculators for real business decisions.",
  secondaryTagline: "Calculate the number. Get the decision.",
  contactEmail: "hello@sectorcalc.com",
  privacyEmail: "privacy@sectorcalc.com",
  defaultLocale: "en" as const,
  defaultCurrency: "USD" as const,
} as const;

export const NAV_ITEMS = [
  { label: "Free Tools", href: "/free-tools" },
  { label: "Premium Tools", href: "/pricing#premium-tools" },
  { label: "Pricing", href: "/pricing" },
  { label: "Reports", href: "/account/reports" },
  { label: "Account", href: "/account" },
] as const;
