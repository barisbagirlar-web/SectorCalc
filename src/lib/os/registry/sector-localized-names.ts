import type { IndustrialRegistryKey } from "@/lib/os/registry/industrial-registry";

/** Locale keys aligned with next-intl routing (en, de, es, ar). */
export type RegistryLocaleKey = "en" | "de" | "es" | "ar";

export type LocalizedSectorName = Partial<Record<RegistryLocaleKey, string>>;

/**
 * Dynamic sector display names — merged over JSON config at parse time.
 * Fallback chain: locale → en → config string.
 */
export const SECTOR_LOCALIZED_NAMES: Record<IndustrialRegistryKey, LocalizedSectorName> = {
  cnc: { en: "CNC", de: "CNC" },
  textile: {
    en: "Textile Manufacturing",
    de: "Textilfertigung",
  },
  plastics: {
    en: "Plastic Injection",
    de: "Kunststoffspritzguss",
  },
  food_bev: {
    en: "Food & Beverage",
    de: "Lebensmittel & Getränke",
  },
  automotive: {
    en: "Automotive Assembly",
    de: "Automobilmontage",
  },
  electronics: {
    en: "Electronics PCB",
    de: "Elektronik PCB",
  },
  metalworking: {
    en: "Metal Fabrication",
    de: "Metallbearbeitung",
  },
  pharma: {
    en: "Pharmaceuticals",
    de: "Pharmazeutik",
  },
  logistics: {
    en: "Logistics & Routing",
    de: "Logistik & Routing",
  },
  warehousing: {
    en: "Warehouse Inventory",
    de: "Lagerbestand",
  },
  marine: {
    en: "Marine Shipping",
    de: "Seeschifffahrt",
  },
  waste_mgmt: {
    en: "Waste Management",
    de: "Abfallwirtschaft",
  },
  water_utility: {
    en: "Water Utility",
    de: "Wasserversorgung",
  },
  construction: {
    en: "Construction Project",
    de: "Bauprojekt",
  },
  energy_plant: {
    en: "Energy & Utilities",
    de: "Energie & Versorgung",
  },
  hvac: {
    en: "HVAC Facilities",
    de: "HLK-Anlagen",
  },
  mining: {
    en: "Mining Operations",
    de: "Bergbau",
  },
  printing: {
    en: "Printing & Packaging",
    de: "Druck & Verpackung",
  },
  agriculture: {
    en: "Crop Yield Management",
    de: "Ertragsmanagement",
  },
  livestock: {
    en: "Livestock & Dairy",
    de: "Viehzucht & Milch",
  },
  hospitality: {
    en: "Hospitality / F&B",
    de: "Gastgewerbe / F&B",
  },
  retail: {
    en: "Retail Operations",
    de: "Einzelhandel",
  },
  finance: {
    en: "Corporate Finance",
    de: "Unternehmensfinanz",
  },
  legal_it: {
    en: "IT & Software Services",
    de: "IT & Software",
  },
  facility_mgmt: {
    en: "Facility Maintenance",
    de: "Facility Management",
  },
  aviation_mro: {
    en: "Aviation MRO",
    de: "Luftfahrt MRO",
  },
  paper_pkg: {
    en: "Paper & Packaging",
    de: "Papier & Verpackung",
  },
};

export function resolveLocalizedName(
  names: LocalizedSectorName,
  locale: string,
): string {
  const key = locale.split("-")[0] as RegistryLocaleKey;
  return (
    names[key] ??
    names.en ??
    Object.values(names).find((v) => typeof v === "string" && v.length > 0) ??
    ""
  );
}

export function mergeLocalizedNames(
  key: IndustrialRegistryKey,
  raw: string | LocalizedSectorName,
): LocalizedSectorName {
  const base: LocalizedSectorName =
    typeof raw === "string"
      ? { en: raw, de: raw, es: raw, ar: raw }
      : { ...raw };

  const overlay = SECTOR_LOCALIZED_NAMES[key];
  return { ...base, ...overlay };
}
