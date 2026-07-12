const DEFAULT_SITE_URL = "https://sectorcalc.com";

function normalizeSiteUrl(value: string): string {
 const trimmed = value.trim().replace(/\/$/, "");
 try {
  const url = new URL(trimmed);
  // Force canonical host: strip www. prefix
  if (url.hostname.startsWith("www.")) {
   url.hostname = url.hostname.slice(4);
  }
  return url.origin;
 } catch {
  return DEFAULT_SITE_URL;
 }
}

/** Canonical public origin; override with NEXT_PUBLIC_SITE_URL at deploy time. */
export const siteUrl = normalizeSiteUrl(
 process.env.NEXT_PUBLIC_SITE_URL ?? DEFAULT_SITE_URL
);

export const SITE_SOCIAL = {
 linkedin: "https://www.linkedin.com/company/sectorcalc",
 twitter: "https://x.com/sectorcalc",
 github: "https://github.com/sectorcalc",
} as const;

export const SITE = {
 siteName: "SectorCalc",
 /** @deprecated Prefer siteName - kept for existing components */
 name: "SectorCalc",
 domain: "sectorcalc.com",
 url: siteUrl,
  defaultTitle: "SectorCalc — cost, risk, and loss calculators",
  defaultDescription:
    "Calculate costs, measure efficiency, detect losses across 27 sectors. Free calculators and premium verdict reports without ERP complexity. Start free.",
 tagline: "Sector-specific calculation, measurement, and decision reports.",
 secondaryTagline: "Calculate the number. Get the decision.",
 contactEmail: "hello@sectorcalc.com",
 privacyEmail: "privacy@sectorcalc.com",
 defaultCurrency: "USD" as const,
} as const;

/** Desktop header nav - Free → Premium → Engineering Diagnostics → Industry → Pricing. */
export const DESKTOP_HEADER_NAV = [
  { key: "freeCalculators", href: "/free-tools" },
  { key: "premiumCalculators", href: "/pro-tools" },
  { key: "engineeringDiagnostics", href: "/engineering-diagnostics" },
  { key: "industryCalculators", href: "/industries" },
  { key: "pricing", href: "/pricing" },
] as const;

/** Mobile drawer nav - same order as desktop header. */
export const PRIMARY_HEADER_NAV = [...DESKTOP_HEADER_NAV] as const;

/** Footer platform links - moved from header. */
export const FOOTER_PLATFORM_NAV = [
  { key: "caseStudies", href: "/case-studies" },
  { key: "reports", href: "/account/reports" },
] as const;

export const PUBLIC_NAV_ITEMS = [
 { label: "Free Calculators", href: "/free-tools" },
 { label: "Pro Calculators", href: "/pro-tools" },
 { label: "Engineering Diagnostics", href: "/engineering-diagnostics" },
 { label: "Industry Calculators", href: "/industries" },
] as const;

export const AUTH_NAV_ITEMS = [
 { label: "Account", href: "/account" },
 { label: "Reports", href: "/account/reports" },
] as const;

/** @deprecated Use PUBLIC_NAV_ITEMS + AUTH_NAV_ITEMS */
export const NAV_ITEMS = [...PUBLIC_NAV_ITEMS, ...AUTH_NAV_ITEMS] as const;
