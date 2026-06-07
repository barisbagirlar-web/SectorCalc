import type { IndustrialRegistryKey } from "@/lib/os/registry/industrial-registry";

/** Locale keys aligned with next-intl routing (en, tr, de, es, ar). */
export type RegistryLocaleKey = "en" | "tr" | "de" | "es" | "ar";

export type LocalizedSectorName = Partial<Record<RegistryLocaleKey, string>>;

/**
 * Dynamic sector display names — merged over JSON config at parse time.
 * Fallback chain: locale → en → config string.
 */
export const SECTOR_LOCALIZED_NAMES: Record<IndustrialRegistryKey, LocalizedSectorName> = {
  cnc: { en: "CNC", tr: "CNC", de: "CNC" },
  textile: {
    en: "Textile Manufacturing",
    tr: "Tekstil İmalatı",
    de: "Textilfertigung",
  },
  plastics: {
    en: "Plastic Injection",
    tr: "Plastik Enjeksiyon",
    de: "Kunststoffspritzguss",
  },
  food_bev: {
    en: "Food & Beverage",
    tr: "Gıda & İçecek",
    de: "Lebensmittel & Getränke",
  },
  automotive: {
    en: "Automotive Assembly",
    tr: "Otomotiv Montaj",
    de: "Automobilmontage",
  },
  electronics: {
    en: "Electronics PCB",
    tr: "Elektronik PCB",
    de: "Elektronik PCB",
  },
  metalworking: {
    en: "Metal Fabrication",
    tr: "Metal İşleme",
    de: "Metallbearbeitung",
  },
  pharma: {
    en: "Pharmaceuticals",
    tr: "İlaç Sanayi",
    de: "Pharmazeutik",
  },
  logistics: {
    en: "Logistics & Routing",
    tr: "Lojistik & Rota",
    de: "Logistik & Routing",
  },
  warehousing: {
    en: "Warehouse Inventory",
    tr: "Depo Envanteri",
    de: "Lagerbestand",
  },
  marine: {
    en: "Marine Shipping",
    tr: "Deniz Taşımacılığı",
    de: "Seeschifffahrt",
  },
  waste_mgmt: {
    en: "Waste Management",
    tr: "Atık Yönetimi",
    de: "Abfallwirtschaft",
  },
  water_utility: {
    en: "Water Utility",
    tr: "Su Altyapısı",
    de: "Wasserversorgung",
  },
  construction: {
    en: "Construction Project",
    tr: "İnşaat Projesi",
    de: "Bauprojekt",
  },
  energy_plant: {
    en: "Energy & Utilities",
    tr: "Enerji & Altyapı",
    de: "Energie & Versorgung",
  },
  hvac: {
    en: "HVAC Facilities",
    tr: "HVAC Tesisleri",
    de: "HLK-Anlagen",
  },
  mining: {
    en: "Mining Operations",
    tr: "Madencilik Operasyonları",
    de: "Bergbau",
  },
  printing: {
    en: "Printing & Packaging",
    tr: "Baskı & Ambalaj",
    de: "Druck & Verpackung",
  },
  agriculture: {
    en: "Crop Yield Management",
    tr: "Tarımsal Verim Yönetimi",
    de: "Ertragsmanagement",
  },
  livestock: {
    en: "Livestock & Dairy",
    tr: "Hayvancılık & Süt",
    de: "Viehzucht & Milch",
  },
  hospitality: {
    en: "Hospitality / F&B",
    tr: "Konaklama / F&B",
    de: "Gastgewerbe / F&B",
  },
  retail: {
    en: "Retail Operations",
    tr: "Perakende Operasyonları",
    de: "Einzelhandel",
  },
  finance: {
    en: "Corporate Finance",
    tr: "Kurumsal Finans",
    de: "Unternehmensfinanz",
  },
  legal_it: {
    en: "IT & Software Services",
    tr: "BT & Yazılım Hizmetleri",
    de: "IT & Software",
  },
  facility_mgmt: {
    en: "Facility Maintenance",
    tr: "Tesis Bakımı",
    de: "Facility Management",
  },
  aviation_mro: {
    en: "Aviation MRO",
    tr: "Havacılık MRO",
    de: "Luftfahrt MRO",
  },
  paper_pkg: {
    en: "Paper & Packaging",
    tr: "Kağıt & Ambalaj",
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
      ? { en: raw, tr: raw, de: raw, es: raw, ar: raw }
      : { ...raw };

  const overlay = SECTOR_LOCALIZED_NAMES[key];
  return { ...base, ...overlay };
}
