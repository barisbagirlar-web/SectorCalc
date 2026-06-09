const DEFAULT_SITE_URL = "https://sectorcalc.com";

function normalizeSiteUrl(value: string): string {
 return value.trim().replace(/\/$/, "");
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
 /** @deprecated Prefer siteName — kept for existing components */
 name: "SectorCalc",
 domain: "sectorcalc.com",
 url: siteUrl,
 defaultTitle: "SectorCalc — Sector-specific measurement, loss detection and decision reports",
 defaultDescription:
 "Calculate costs, measure efficiency, detect losses, and optimize operations across 27 sectors — free calculators and premium verdict reports without ERP complexity.",
 tagline: "Her sektör için özel hesaplama, ölçüm ve karar raporları.",
 secondaryTagline: "Calculate the number. Get the decision.",
 contactEmail: "hello@sectorcalc.com",
 privacyEmail: "privacy@sectorcalc.com",
 defaultLocale: "en" as const,
 defaultCurrency: "USD" as const,
} as const;

/** Primary header nav — manifesto v2: Calculators → Industries → Case Studies → Pricing → Resources. */
export const PRIMARY_HEADER_NAV = [
 { key: "calculators", href: "/free-tools" },
 { key: "industries", href: "/industries" },
 { key: "caseStudies", href: "/case-studies" },
 { key: "pricing", href: "/pricing" },
 { key: "resources", href: "/categories" },
] as const;

export const PUBLIC_NAV_ITEMS = [
 { label: "Free Checks", href: "/free-tools" },
 { label: "Premium Verdicts", href: "/premium-tools" },
 { label: "Industries", href: "/industries" },
] as const;

export const AUTH_NAV_ITEMS = [
 { label: "Account", href: "/account" },
 { label: "Reports", href: "/account/reports" },
] as const;

/** @deprecated Use PUBLIC_NAV_ITEMS + AUTH_NAV_ITEMS */
export const NAV_ITEMS = [...PUBLIC_NAV_ITEMS, ...AUTH_NAV_ITEMS] as const;
