import type { IndustrialRegistryKey } from "@/lib/os/registry/industrial-registry";

/** Locale keys aligned with next-intl routing. */
export type RegistryLocaleKey = "en";

export type LocalizedSectorName = Partial<Record<RegistryLocaleKey, string>>;

/**
 * Dynamic sector display names — merged over JSON config at parse time.
 * Fallback chain: locale → en → config string.
 */
export const SECTOR_LOCALIZED_NAMES: Record<IndustrialRegistryKey, LocalizedSectorName> = {
  cnc: { en: "CNC" },
  textile: { en: "Textile Manufacturing" },
  plastics: { en: "Plastic Injection" },
  food_bev: { en: "Food & Beverage" },
  automotive: { en: "Automotive Assembly" },
  electronics: { en: "Electronics PCB" },
  metalworking: { en: "Metal Fabrication" },
  pharma: { en: "Pharmaceuticals" },
  logistics: { en: "Logistics & Routing" },
  warehousing: { en: "Warehouse Inventory" },
  marine: { en: "Marine Shipping" },
  waste_mgmt: { en: "Waste Management" },
  water_utility: { en: "Water Utility" },
  construction: { en: "Construction Project" },
  energy_plant: { en: "Energy & Utilities" },
  hvac: { en: "HVAC Facilities" },
  mining: { en: "Mining Operations" },
  printing: { en: "Printing & Packaging" },
  agriculture: { en: "Crop Yield Management" },
  livestock: { en: "Livestock & Dairy" },
  hospitality: { en: "Hospitality / F&B" },
  retail: { en: "Retail Operations" },
  finance: { en: "Corporate Finance" },
  legal_it: { en: "IT & Software Services" },
  facility_mgmt: { en: "Facility Maintenance" },
  aviation_mro: { en: "Aviation MRO" },
  paper_pkg: { en: "Paper & Packaging" },
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
      ? { en: raw }
      : { ...raw };

  const overlay = SECTOR_LOCALIZED_NAMES[key];
  return { ...base, ...overlay };
}
