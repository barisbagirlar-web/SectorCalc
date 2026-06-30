/**
 * Sector registry — derived from IndustrialRegistry source.
 * UI: t("sector.cnc.title") or entry.name fallback
 */

import type { IndustrySlug } from "@/lib/features/tools/industry-registry";
import {
  IndustrialRegistry,
  isIndustrialRegistryKey,
  type IndustrialRegistryKey,
  type IndustrialParamTriple,
} from "@/lib/os/registry/industrial-registry";
import {
  resolveLocalizedName,
  type LocalizedSectorName,
} from "@/lib/os/registry/sector-localized-names";

import {
  smartModulesToExpertFeatures,
  hasSmartModule,
  listSmartModules,
  type ExpertFeatureKey,
  type SectorExpertFeatures,
  type SmartModuleId,
} from "@/lib/os/registry/smart-modules";

export const MANUFACTURING_OS_I18N_NS = "manufacturingOs" as const;

export type SectorUnitType =
  | "time"
  | "distance"
  | "currency"
  | "percent"
  | "volume"
  | "mass"
  | "energy"
  | "area";

export type SectorParamTriple = IndustrialParamTriple;

export type { ExpertFeatureKey, SectorExpertFeatures, SmartModuleId };

export interface SectorEntry {
  /** i18n root — e.g. sector.cnc */
  key: string;
  /** Dynamic localized names from registry */
  names: LocalizedSectorName;
  /** Default English display name (backward compat) */
  name: string;
  unitType: SectorUnitType;
  defaultTolerance: number;
  params: SectorParamTriple;
  /** Active Smart Module IDs */
  features: readonly SmartModuleId[];
  /** Intelligence Layer UI — derived from features (backward-compat) */
  expertFeatures: SectorExpertFeatures;
}

export type SectorRegistryKey = IndustrialRegistryKey;

const UNIT_TYPE_BY_KEY: Record<SectorRegistryKey, SectorUnitType> = {
  cnc: "time",
  textile: "mass",
  plastics: "time",
  food_bev: "percent",
  automotive: "time",
  electronics: "percent",
  metalworking: "mass",
  pharma: "percent",
  logistics: "distance",
  warehousing: "percent",
  marine: "volume",
  waste_mgmt: "currency",
  water_utility: "volume",
  construction: "currency",
  energy_plant: "energy",
  hvac: "energy",
  mining: "percent",
  printing: "mass",
  agriculture: "mass",
  livestock: "percent",
  hospitality: "percent",
  retail: "percent",
  finance: "currency",
  legal_it: "time",
  facility_mgmt: "currency",
  aviation_mro: "time",
  paper_pkg: "mass",
};

function toSectorEntry(
  id: SectorRegistryKey,
  entry: (typeof IndustrialRegistry)[SectorRegistryKey],
): SectorEntry {
  return {
    key: `sector.${id}`,
    names: entry.names,
    name: entry.name,
    unitType: UNIT_TYPE_BY_KEY[id],
    defaultTolerance: entry.tolerance,
    params: entry.params,
    features: entry.features,
    expertFeatures: smartModulesToExpertFeatures(entry.features),
  };
}

export const SectorRegistry = Object.fromEntries(
  (Object.entries(IndustrialRegistry) as [SectorRegistryKey, (typeof IndustrialRegistry)[SectorRegistryKey]][]).map(
    ([id, entry]) => [id, toSectorEntry(id, entry)],
  ),
) as Record<SectorRegistryKey, SectorEntry>;

const slugToSectorKeyMap: Record<IndustrySlug, SectorRegistryKey> = {
  "cnc-manufacturing": "cnc",
  construction: "construction",
  cleaning: "facility_mgmt",
  restaurant: "hospitality",
  ecommerce: "retail",
  "welding-fabrication": "metalworking",
  hvac: "hvac",
  "electrical-contracting": "legal_it",
  "landscaping-lawn-care": "agriculture",
  "auto-repair-shop": "automotive",
  "printing-signage": "printing",
  plumbing: "construction",
  "carpentry-millwork": "construction",
  roofing: "construction",
  painting: "construction",
  "sheet-metal": "metalworking",
  "3d-printing-service": "plastics",
  "logistics-transport": "logistics",
  "agriculture-crops": "agriculture",
  "agriculture-irrigation": "agriculture",
  "agriculture-feed": "livestock",
  "agriculture-dairy": "livestock",
  "energy-consumption": "energy_plant",
  "energy-carbon": "energy_plant",
  "daily-renovation": "construction",
  "daily-fuel": "logistics",
  "daily-meals": "hospitality",
};

export function industrySlugToSectorKey(slug: IndustrySlug): SectorRegistryKey {
  return slugToSectorKeyMap[slug];
}

export function getSectorEntry(key: SectorRegistryKey): SectorEntry {
  return SectorRegistry[key];
}

export function hasExpertFeature(entry: SectorEntry, feature: ExpertFeatureKey): boolean {
  return entry.expertFeatures[feature] === true;
}

export function hasSectorSmartModule(entry: SectorEntry, moduleId: SmartModuleId): boolean {
  return hasSmartModule(entry.features, moduleId);
}

export function listSectorSmartModules(entry: SectorEntry): SmartModuleId[] {
  return listSmartModules(entry.features);
}

export function listEnabledExpertFeatures(entry: SectorEntry): ExpertFeatureKey[] {
  return (Object.entries(entry.expertFeatures) as [ExpertFeatureKey, boolean | undefined][])
    .filter(([, enabled]) => enabled === true)
    .map(([feature]) => feature);
}

export function getSectorEntryBySlug(slug: IndustrySlug): SectorEntry {
  return SectorRegistry[slugToSectorKeyMap[slug]];
}

export function getSectorEntryByI18nKey(i18nKey: string): SectorEntry | null {
  const match = Object.values(SectorRegistry).find((entry) => entry.key === i18nKey);
  return match ?? null;
}

export function listSectorRegistryKeys(): SectorRegistryKey[] {
  return Object.keys(SectorRegistry) as SectorRegistryKey[];
}

export function sectorKeyToIndustrySlug(key: SectorRegistryKey): IndustrySlug | null {
  for (const [slug, sectorKey] of Object.entries(slugToSectorKeyMap) as [
    IndustrySlug,
    SectorRegistryKey,
  ][]) {
    if (sectorKey === key) {
      return slug;
    }
  }
  return null;
}

export function formatSectorParamLabel(param: string): string {
  return param.replace(/_/g, " ");
}

export function getSectorDisplayName(entry: SectorEntry, locale: string = "en"): string {
  return resolveLocalizedName(entry.names, locale) || entry.name;
}

/** Registry localized name → locale; i18n message fallback. */
export function resolveSectorTitle(
  entry: SectorEntry,
  translate: (key: string) => string,
  locale: string = "en",
): string {
  const registryName = resolveLocalizedName(entry.names, locale);
  const messageKey = sectorTitleMessageKey(entry);
  const translated = translate(messageKey);
  if (translated === messageKey || translated.includes("sector.")) {
    return registryName || entry.name;
  }
  return translated;
}

/** Translation if i18n available, otherwise readable param label. */
export function resolveSectorParamLabel(
  entry: SectorEntry,
  paramKey: string,
  translate: (key: string) => string,
): string {
  const messageKey = sectorParamMessageKey(entry, paramKey);
  const translated = translate(messageKey);
  if (translated === messageKey || translated.includes(".params.")) {
    return formatSectorParamLabel(paramKey);
  }
  return translated;
}

/** t("sector.cnc.title") */
export function sectorTitleMessageKey(entry: SectorEntry): string {
  return `${entry.key}.title`;
}

/** t("sector.cnc.params.target_cycle_time") */
export function sectorParamMessageKey(entry: SectorEntry, paramKey: string): string {
  return `${entry.key}.params.${paramKey}`;
}

export function costBasisForUnitType(
  unitType: SectorUnitType,
  params: SectorParamTriple,
): "direct" | "per-hour-on-second-delta" | "per-hour-on-minute-delta" {
  if (unitType !== "time") {
    return "direct";
  }
  const usesSeconds = params.some(
    (param) =>
      param.toLowerCase().includes("cycle_time") ||
      param.toLowerCase().includes("repair_time"),
  );
  return usesSeconds ? "per-hour-on-second-delta" : "direct";
}

export type SectorParamValues<K extends SectorRegistryKey> = Record<
  (typeof SectorRegistry)[K]["params"][number],
  number
>;

export {
  IndustrialRegistry,
  getIndustrialRegistryEntry,
  getIndustrialSectorName,
  isIndustrialRegistryKey,
  listIndustrialRegistryKeys,
  type IndustrialRegistryEntry,
  type IndustrialRegistryKey,
  type LocalizedSectorName,
} from "@/lib/os/registry/industrial-registry";

export {
  SmartModuleIds,
  SmartModules,
  hasSmartModule,
  listSmartModules,
  resolveSmartModuleLabel,
  smartModulesToExpertFeatures,
} from "@/lib/os/registry/smart-modules";

export function isSectorRegistryKey(value: string): value is SectorRegistryKey {
  return isIndustrialRegistryKey(value);
}

export type IndustrialSectorEntry = SectorEntry;
export type SectorDefinition = SectorEntry;

export const getIndustrialSector = getSectorEntry;
export const getIndustrialSectorBySlug = getSectorEntryBySlug;
export const industrySlugToIndustrialKey = industrySlugToSectorKey;
export const listIndustrialSectorKeys = listSectorRegistryKeys;
export const getIndustrialSectorById = getSectorEntryByI18nKey;
export const getSectorDefinition = getSectorEntry;
export const getSectorDefinitionBySlug = getSectorEntryBySlug;
export const listSectorDefinitionKeys = listSectorRegistryKeys;
export const getSectorDefinitionByI18nKey = getSectorEntryByI18nKey;

export type IndustrialParamValues<K extends SectorRegistryKey> = SectorParamValues<K>;
export type SectorUnit = SectorUnitType;
