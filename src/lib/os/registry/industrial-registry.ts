/**
 * Industrial OS — 27 sector canonical registry.
 * JSON-config driven (sector-registry.config.json).
 * After config changes: npm run seo:llms && npm run seo:indexnow
 */

import sectorConfig from "@/lib/os/registry/sector-registry.config.json";
import {
  mergeLocalizedNames,
  resolveLocalizedName,
  type LocalizedSectorName,
  type RegistryLocaleKey,
} from "@/lib/os/registry/sector-localized-names";
import { isSmartModuleId, type SmartModuleId } from "@/lib/os/registry/smart-modules";

export type IndustrialRegistryKey =
  | "cnc"
  | "textile"
  | "plastics"
  | "food_bev"
  | "automotive"
  | "electronics"
  | "metalworking"
  | "pharma"
  | "logistics"
  | "warehousing"
  | "marine"
  | "waste_mgmt"
  | "water_utility"
  | "construction"
  | "energy_plant"
  | "hvac"
  | "mining"
  | "printing"
  | "agriculture"
  | "livestock"
  | "hospitality"
  | "retail"
  | "finance"
  | "legal_it"
  | "facility_mgmt"
  | "aviation_mro"
  | "paper_pkg";

export type IndustrialParamTriple = readonly [string, string, string];

export interface IndustrialRegistryEntry {
  /** Dynamic localized names — { en, tr, de, ... } */
  names: LocalizedSectorName;
  /** Default English display (backward compat) */
  name: string;
  params: IndustrialParamTriple;
  tolerance: number;
  features: readonly SmartModuleId[];
}

interface SectorConfigRecord {
  name: string | LocalizedSectorName;
  params: [string, string, string];
  tolerance: number;
  features: string[];
}

function parseSectorEntry(
  key: IndustrialRegistryKey,
  raw: SectorConfigRecord,
): IndustrialRegistryEntry {
  const features = raw.features.filter(isSmartModuleId);
  if (features.length !== raw.features.length) {
    throw new Error("Invalid smart module id in sector-registry.config.json");
  }

  const names = mergeLocalizedNames(key, raw.name);

  return {
    names,
    name: resolveLocalizedName(names, "en"),
    params: raw.params,
    tolerance: raw.tolerance,
    features,
  };
}

const configSectors = sectorConfig.sectors as unknown as Record<IndustrialRegistryKey, SectorConfigRecord>;

export const IndustrialRegistry = Object.fromEntries(
  (Object.entries(configSectors) as [IndustrialRegistryKey, SectorConfigRecord][]).map(
    ([key, raw]) => [key, parseSectorEntry(key, raw)],
  ),
) as Record<IndustrialRegistryKey, IndustrialRegistryEntry>;

export function listIndustrialRegistryKeys(): IndustrialRegistryKey[] {
  return Object.keys(IndustrialRegistry) as IndustrialRegistryKey[];
}

export function isIndustrialRegistryKey(value: string): value is IndustrialRegistryKey {
  return (listIndustrialRegistryKeys() as string[]).includes(value);
}

export function getIndustrialRegistryEntry(
  key: IndustrialRegistryKey,
): IndustrialRegistryEntry {
  return IndustrialRegistry[key];
}

export function getIndustrialSectorName(
  entry: IndustrialRegistryEntry,
  locale: string = "en",
): string {
  return resolveLocalizedName(entry.names, locale);
}

export type { LocalizedSectorName, RegistryLocaleKey };
