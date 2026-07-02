import { BRAND_ASSETS } from "@/config/brand";
import { buildOrganizationSameAs } from "@/config/knowledge-graph";
import { LEGAL_ENTITY } from "@/config/legal-entity";

/** Shared Organization / LocalBusiness trust signals for JSON-LD and microformats. */
export const ORGANIZATION_TRUST = {
  displayName: "SectorCalc",
  description: {
    en: "Sector calculators for manufacturing, industry, and business.",
    de: "Branchenspezifische Rechner fur Produktion, Industrie und Unternehmen.",
    fr: "Calculateurs sectoriels pour la production, l'industrie et les entreprises.",
    es: "Calculadoras sectoriales para producción, industria y negocios.",
    ar: "حاسبات قطاعية للتصنيع والصناعة والأعمال.",
  },
  founder: {
    name: "Baris Bagirlar",
    email: "barisbagirlar@gmail.com",
  },
  logoPath: BRAND_ASSETS.logo.default,
  email: LEGAL_ENTITY.email,
  phone: LEGAL_ENTITY.phone,
  address: {
    streetAddress: LEGAL_ENTITY.address,
    addressLocality: "Izmir",
    addressCountry: "Turkey",
  },
  sameAs: buildOrganizationSameAs(),
  contactType: "customer support",
} as const;

export function organizationDescriptionForLocale(locale: string): string {
  const key = locale as AppLocale;
  return ORGANIZATION_TRUST.description[key] ?? ORGANIZATION_TRUST.description.en;
}

export const SECURITY_TXT = {
  contact: "mailto:barisbagirlar@gmail.com",
  expires: "2027-06-16",
  preferredLanguages: "en, tr, de, fr, es, ar",
  canonical: "https://www.sectorcalc.com/.well-known/security.txt",
} as const;

export const THEME_COLOR = "#F0EEE6" as const;

export const INDEXNOW_KEY_WELL_KNOWN_PATH = "/.well-known/indexnow-key.txt" as const;
